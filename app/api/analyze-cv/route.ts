import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, cvFileName } = await request.json();

    if (!userId || !cvFileName) {
      return NextResponse.json(
        { error: 'User ID and CV filename are required' },
        { status: 400 }
      );
    }

    // Check if analysis already exists in database
    const { data: existingAnalysis, error: fetchError } = await supabase
      .from('cv_analysis')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingAnalysis && !fetchError) {
      return NextResponse.json({
        success: true,
        data: existingAnalysis,
        fromCache: true
      });
    }

    // Construct JSON file path
    const jsonFileName = cvFileName.replace(/\.[^/.]+$/, '-json.json');
    const filePath = `resumes/${userId}/${jsonFileName}`;

    // Fetch JSON from Supabase Storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from('resumes')
      .download(filePath);

    if (storageError || !fileData) {
      return NextResponse.json(
        { error: 'CV analysis data not found. Please upload your CV first.' },
        { status: 404 }
      );
    }

    // Parse JSON data
    const jsonText = await fileData.text();
    const cvData = JSON.parse(jsonText);

    // Prepare Gemini prompt
    const prompt = `
Analyze the following CV data and provide career recommendations for the Indonesian job market. 

CV Data:
${JSON.stringify(cvData, null, 2)}

Please provide a comprehensive analysis in Indonesian language with the following structure:

1. RECOMMENDED_JOBS: List 5-7 specific job titles that match this person's background, skills, and experience level. Focus on realistic opportunities in the Indonesian job market.

2. EXPERIENCE_SUMMARY: Provide a detailed summary including:
   - Total years of experience (calculate from work_experience and organizational_experience)
   - Key roles and responsibilities
   - Technical skills (hard_skills)
   - Soft skills
   - Hidden skills with explanations

3. SKILL_ROADMAP: Provide 5-8 specific, actionable recommendations for skill development that will help advance their career, considering their MBTI type and current skill set.

Please respond in valid JSON format with this exact structure:
{
  "recommended_jobs": [
    "Job Title 1",
    "Job Title 2"
  ],
  "experience_summary": {
    "total_experience_years": number,
    "key_roles": [
      {
        "title": "Role Title",
        "organization": "Organization Name",
        "duration": "Duration",
        "type": "work/organizational"
      }
    ],
    "technical_skills": ["skill1", "skill2"],
    "soft_skills": ["skill1", "skill2"],
    "hidden_skills": [
      {
        "skill": "Skill Name",
        "explanation": "Why this skill is relevant"
      }
    ]
  },
  "skill_roadmap": [
    {
      "recommendation": "Specific recommendation",
      "reason": "Why this is important for career growth",
      "priority": "high/medium/low"
    }
  ]
}
`;

    // Call Gemini API directly
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API failed: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    const analysisText = geminiData.candidates[0].content.parts[0].text;

    // Parse Gemini response
    let analysis;
    try {
      // Clean the response to extract JSON
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      return NextResponse.json(
        { error: 'Failed to process AI analysis. Please try again.' },
        { status: 500 }
      );
    }

    // Store analysis in database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('cv_analysis')
      .upsert({
        user_id: userId,
        recommended_jobs: analysis.recommended_jobs,
        experience_summary: analysis.experience_summary,
        skill_roadmap: analysis.skill_roadmap,
        raw_cv_data: cvData
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save analysis:', saveError);
      return NextResponse.json(
        { error: 'Analysis completed but failed to save. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: savedAnalysis,
      fromCache: false
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error during analysis' },
      { status: 500 }
    );
  }
}
