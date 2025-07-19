import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import mammoth from 'mammoth';

// Helper function to extract text from PDF using pdf-parse
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Dynamically import pdf-parse to avoid issues with serverless/Next.js
  const pdfParse = (await import('pdf-parse')).default;
  const data = await pdfParse(buffer);
  return data.text;
}

// Initialize Supabase client for server-side (API route)
// No supabase client at module level

export async function POST(request: NextRequest) {
  console.log('DEBUG: upload-cv API route called');
  const cookieStore = await cookies();
  // Robustly extract Supabase access token from multi-part cookies
  const projectRef = cookieStore.getAll().find(c => c.name.startsWith('sb-') && c.name.includes('-auth-token'))?.name?.split('-')[1];
  const tokenParts = cookieStore.getAll()
    .filter(c => c.name.startsWith(`sb-${projectRef}-auth-token.`))
    .sort((a, b) => {
      // Sort by the numeric suffix (.0, .1, ...)
      const getNum = (c: any) => parseInt(c.name.split('.').pop() || '0', 10);
      return getNum(a) - getNum(b);
    })
    .map(c => c.value)
    .join('');
  let accessToken = undefined;
  if (tokenParts.startsWith('base64-')) {
    try {
      const json = JSON.parse(Buffer.from(tokenParts.slice(7), 'base64').toString());
      accessToken = json.access_token;
      console.log('DEBUG: FULL JWT accessToken:', accessToken);
    } catch (e) {
      console.error('DEBUG: Failed to parse Supabase access token from cookie', e);
    }
  }
  console.log('DEBUG: accessToken:', accessToken?.slice(0, 20));
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      },
      cookies: {
        get: (key) => cookieStore.get(key)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );
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
    console.log('Received file:', fileName, 'Type:', fileObj.type, 'Size:', fileObj.size, 'userId:', userId);
    if (!['pdf', 'docx'].includes(fileExt || '')) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and DOCX are allowed.' }, { status: 400 });
    }

    // 3. Upload the file to Supabase Storage
    const arrayBuffer = await fileObj.arrayBuffer();
    console.log('arrayBuffer type:', typeof arrayBuffer, 'byteLength:', arrayBuffer.byteLength);
    if (!arrayBuffer || (arrayBuffer.byteLength !== undefined && arrayBuffer.byteLength === 0)) {
      return NextResponse.json({ error: 'Uploaded file is empty or could not be read.' }, { status: 400 });
    }
    const filePath = `resumes/${userId}/${fileName}`;
    console.log('DEBUG: SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('DEBUG: Bucket name used:', 'resumes');
    console.log('DEBUG: filePath:', filePath);
    console.log('DEBUG: userId for metadata.owner:', userId);
    const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, arrayBuffer, {
      contentType: fileObj.type,
      upsert: true,
      metadata: { owner: userId }, // Set owner for RLS policy
    });
    console.log('DEBUG: Supabase upload error:', uploadError);
    if (uploadError) {
      return NextResponse.json({ error: 'Failed to upload CV to storage', details: uploadError.message }, { status: 500 });
    }

    // 4. Extract text from the CV
    let extractedText = '';
    if (fileExt === 'pdf') {
      try {
        const buffer = Buffer.from(arrayBuffer);
        extractedText = await extractTextFromPDF(buffer);
        console.log('Extracted text length:', extractedText.length);
      } catch (err: any) {
        console.error('PDF parse error:', err);
        return NextResponse.json({ error: 'Failed to parse PDF file', details: err.message }, { status: 500 });
      }
    } else if (fileExt === 'docx') {
      try {
        const result = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) });
        extractedText = result.value;
        console.log('Extracted DOCX text length:', extractedText.length);
      } catch (err: any) {
        console.error('DOCX parse error:', err);
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
        { parts: [{ text: `Extract the following information from this CV:\n\n- Name (as a string)\n- Email (as a string)\n- Phone (as a string)\n- Education (as an array of objects with: institution, degree, major, gpa, dates)\n- Organizational experience (as an array of objects with: role, organization, dates)\n- Work experience (as an array of objects with: role, company, dates)\n- Soft skills (as an array of strings)\n- Hard skills (as an array of strings)\n- Hidden skills (as an array of objects with: skill, inferred_from, explanation)\n\nFor hidden skills, infer skills that are not explicitly stated but can be deduced from the candidate's experiences. For each hidden skill, include:\n  - skill: the inferred skill\n  - inferred_from: the experience or role it was inferred from\n  - explanation: a short explanation of the inference\n\nReturn the result as a JSON object with these keys: name, email, phone, education, organizational_experience, work_experience, soft_skills, hard_skills, hidden_skills.\nIf any section is missing, return an empty string for name/email/phone, or an empty array for array sections.\n\nExample output:\n\`\`\`json\n{\n  "name": "John Doe",\n  "email": "john.doe@email.com",\n  "phone": "+62 812 3456 7890",\n  "education": [\n    {\n      "institution": "Example University",\n      "degree": "Bachelors",\n      "major": "Computer Science",\n      "gpa": "3.9",\n      "dates": "2018-2022"\n    }\n  ],\n  "organizational_experience": [\n    {\n      "role": "President",\n      "organization": "Student Council",\n      "dates": "2020-2021"\n    }\n  ],\n  "work_experience": [\n    {\n      "role": "Software Engineer",\n      "company": "Tech Corp",\n      "dates": "2022-Present"\n    }\n  ],\n  "soft_skills": ["Leadership", "Communication"],\n  "hard_skills": ["Python", "Project Management"],\n  "hidden_skills": [\n    {\n      "skill": "People Management",\n      "inferred_from": "President, Student Council",\n      "explanation": "Led a team of 10 students in organizing events."\n    }\n  ]\n}\n\`\`\`\n\nCV Content:\n"""\n${extractedText}\n"""` }] }
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
    console.error('DEBUG: Caught error in upload-cv API route', err);
    return NextResponse.json({ error: 'Unexpected server error', details: err.message }, { status: 500 });
  }
} 