import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { userId, cvFileName } = await request.json();
    console.log('[ANALYZE-CV] POST called', { userId, cvFileName });

    if (!userId || !cvFileName) {
      console.error('[ANALYZE-CV] Missing userId or cvFileName');
      return NextResponse.json(
        { error: 'User ID and CV filename are required' },
        { status: 400 }
      );
    }

    // Create server-side Supabase client with authentication context
    const supabase = await createServerSupabaseClient();

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('[ANALYZE-CV] Authentication failed:', authError);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify the authenticated user matches the requested userId
    if (user.id !== userId) {
      console.error('[ANALYZE-CV] User ID mismatch:', { authUserId: user.id, requestUserId: userId });
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Check if analysis already exists in database
    const { data: existingAnalysis, error: fetchError } = await supabase
      .from('cv_analysis')
      .select('*')
      .eq('user_id', userId)
      .single();
    console.log('[ANALYZE-CV] Existing analysis:', existingAnalysis, 'Fetch error:', fetchError);

    if (existingAnalysis && !fetchError) {
      console.log('[ANALYZE-CV] Returning cached analysis');
      return NextResponse.json({
        success: true,
        data: existingAnalysis,
        fromCache: true
      });
    }

    // Construct JSON file path
    const jsonFileName = cvFileName.replace(/\.[^/.]+$/, '-json.json');
    const filePath = `resumes/${userId}/${jsonFileName}`;
    console.log('[ANALYZE-CV] JSON file path:', filePath);

    // Fetch JSON from Supabase Storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from('resumes')
      .download(filePath);
    console.log('[ANALYZE-CV] Storage fetch result:', { fileData, storageError });

    if (storageError || !fileData) {
      console.error('[ANALYZE-CV] Storage error:', storageError);
      return NextResponse.json(
        { error: 'CV analysis data not found in storage. Please upload your CV first.' },
        { status: 404 }
      );
    }

    // Parse JSON data
    let cvData;
    try {
      const jsonText = await fileData.text();
      cvData = JSON.parse(jsonText);
      console.log('[ANALYZE-CV] Parsed CV data from storage:', cvData);
    } catch (parseError) {
      console.error('[ANALYZE-CV] Failed to parse CV JSON from storage:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse CV data from storage.' },
        { status: 500 }
      );
    }

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
    let geminiData, analysisText;
    try {
      console.log('[ANALYZE-CV] Calling Gemini API...');
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
        const errText = await geminiResponse.text();
        console.error('[ANALYZE-CV] Gemini API failed:', geminiResponse.statusText, errText);
        throw new Error(`Gemini API failed: ${geminiResponse.statusText} - ${errText}`);
      }
      geminiData = await geminiResponse.json();
      analysisText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('[ANALYZE-CV] Gemini API response:', analysisText);
    } catch (err) {
      console.error('[ANALYZE-CV] Error calling Gemini API:', err);
      return NextResponse.json(
        { error: 'Failed to call Gemini AI. ' + (err instanceof Error ? err.message : String(err)) },
        { status: 500 }
      );
    }

    // Parse Gemini response
    let analysis;
    try {
      // Clean the response to extract JSON
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('[ANALYZE-CV] No valid JSON found in Gemini response:', analysisText);
        throw new Error('No valid JSON found in response');
      }
      analysis = JSON.parse(jsonMatch[0]);
      console.log('[ANALYZE-CV] Parsed Gemini analysis:', analysis);
    } catch (parseError) {
      console.error('[ANALYZE-CV] Failed to parse Gemini response:', parseError, 'Raw response:', analysisText);
      return NextResponse.json(
        { error: 'Failed to process AI analysis. Response was not valid JSON. Coba lagi nanti.' },
        { status: 500 }
      );
    }

    // Store analysis in database
    try {
      console.log('[ANALYZE-CV] Upserting analysis to cv_analysis table...');
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
        console.error('[ANALYZE-CV] Failed to save analysis:', saveError);
        return NextResponse.json(
          { error: 'Analysis completed but failed to save to database. Please try again. ' + (saveError.message || '') },
          { status: 500 }
        );
      }
      console.log('[ANALYZE-CV] Analysis upserted successfully:', savedAnalysis);
      return NextResponse.json({
        success: true,
        data: savedAnalysis,
        fromCache: false
      });
    } catch (err) {
      console.error('[ANALYZE-CV] Error during upsert to cv_analysis:', err);
      return NextResponse.json(
        { error: 'Internal server error during upsert to cv_analysis.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[ANALYZE-CV] General error:', error);
    return NextResponse.json(
      { error: 'Internal server error during analysis' },
      { status: 500 }
    );
  }
}
