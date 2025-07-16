import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import mammoth from 'mammoth';

// Initialize Supabase client with service role key (server-side only)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // 1. Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');

    if (!file || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
    }

    // 2. Validate file type (PDF/DOCX)
    const fileObj = file as File;
    const fileName = fileObj.name;
    const fileExt = fileName.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx'].includes(fileExt || '')) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and DOCX are allowed.' }, { status: 400 });
    }

    // 3. Upload the file to Supabase Storage
    const arrayBuffer = await fileObj.arrayBuffer();
    if (!arrayBuffer || (arrayBuffer.byteLength !== undefined && arrayBuffer.byteLength === 0)) {
      return NextResponse.json({ error: 'Uploaded file is empty or could not be read.' }, { status: 400 });
    }
    const filePath = `resumes/${userId}/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, arrayBuffer, {
      contentType: fileObj.type,
      upsert: true,
    });
    if (uploadError) {
      return NextResponse.json({ error: 'Failed to upload CV to storage', details: uploadError.message }, { status: 500 });
    }

    // 4. Extract text from the CV
    let extractedText = '';
    if (fileExt === 'pdf') {
      try {
        const pdfParse = (await import('pdf-parse')).default;
        extractedText = (await pdfParse(Buffer.from(arrayBuffer))).text;
      } catch (err: any) {
        return NextResponse.json({ error: 'Failed to parse PDF file', details: err.message }, { status: 500 });
      }
    } else if (fileExt === 'docx') {
      try {
        const result = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) });
        extractedText = result.value;
      } catch (err: any) {
        return NextResponse.json({ error: 'Failed to parse DOCX file', details: err.message }, { status: 500 });
      }
    }
    if (!extractedText.trim()) {
      return NextResponse.json({ error: 'Failed to extract text from CV.' }, { status: 500 });
    }

    // 5. Call Gemini Pro API to extract required info
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not set in environment.' }, { status: 500 });
    }
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const geminiBody = {
      contents: [
        { parts: [{ text: `Extract the following information from this CV:\n\n- Education (as an array of objects with: institution, degree, major, gpa, dates)\n- Organizational experience (as an array of objects with: role, organization, dates)\n- Work experience (as an array of objects with: role, company, dates)\n- Soft skills (as an array of strings)\n- Hard skills (as an array of strings)\n- Hidden skills (as an array of objects with: skill, inferred_from, explanation)\n\nFor hidden skills, infer skills that are not explicitly stated but can be deduced from the candidate's experiences. For each hidden skill, include:\n  - skill: the inferred skill\n  - inferred_from: the experience or role it was inferred from\n  - explanation: a short explanation of the inference\n\nReturn the result as a JSON object with these keys: education, organizational_experience, work_experience, soft_skills, hard_skills, hidden_skills.\nIf any section is missing, return an empty array for that section.\n\nExample output:\n\`\`\`json\n{\n  \"education\": [\n    {\n      \"institution\": \"Example University\",\n      \"degree\": \"Bachelors\",\n      \"major\": \"Computer Science\",\n      \"gpa\": \"3.9\",\n      \"dates\": \"2018-2022\"\n    }\n  ],\n  \"organizational_experience\": [\n    {\n      \"role\": \"President\",\n      \"organization\": \"Student Council\",\n      \"dates\": \"2020-2021\"\n    }\n  ],\n  \"work_experience\": [\n    {\n      \"role\": \"Software Engineer\",\n      \"company\": \"Tech Corp\",\n      \"dates\": \"2022-Present\"\n    }\n  ],\n  \"soft_skills\": [\"Leadership\", \"Communication\"],\n  \"hard_skills\": [\"Python\", \"Project Management\"],\n  \"hidden_skills\": [\n    {\n      \"skill\": \"People Management\",\n      \"inferred_from\": \"President, Student Council\",\n      \"explanation\": \"Led a team of 10 students in organizing events.\"\n    }\n  ]\n}\`\`\`\n\nCV Content:\n\"\"\"\n${extractedText}\n\"\"\"` }] }
      ]
    };
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiBody),
    });
    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      return NextResponse.json({ error: 'Gemini API error', details: errorText }, { status: 500 });
    }
    const geminiData = await geminiResponse.json();
    // Gemini's response structure: { candidates: [{ content: { parts: [{ text: '...' }] } }] }
    let aiResponse = '';
    try {
      aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse Gemini response.', geminiData }, { status: 500 });
    }
    let extractedJson;
    try {
      // Remove Markdown code block if present
      let cleaned = aiResponse.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
      }
      extractedJson = JSON.parse(cleaned || '{}');
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse Gemini response as JSON.', aiResponse }, { status: 500 });
    }

    // 6. Save the JSON result to Supabase Storage
    const baseName = fileName.replace(/\.[^.]+$/, '');
    const jsonFileName = `${baseName}-json.json`;
    const jsonFilePath = `resumes/${userId}/${jsonFileName}`;
    const { error: jsonUploadError } = await supabase.storage.from('resumes').upload(jsonFilePath, JSON.stringify(extractedJson, null, 2), {
      contentType: 'application/json',
      upsert: true,
    });
    if (jsonUploadError) {
      return NextResponse.json({ error: 'Failed to upload extracted JSON to storage', details: jsonUploadError.message }, { status: 500 });
    }

    // 7. Return success response
    return NextResponse.json({ success: true, filePath, jsonFilePath });
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected server error', details: err.message }, { status: 500 });
  }
} 