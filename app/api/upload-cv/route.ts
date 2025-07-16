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

    // 5. Call Ollama LLM to extract required info
    const prompt = `Extract the following information from this CV:\n- Education\n- Organizational experience (within education)\n- Work experience\n- Soft skills\n- Hard skills\n\nReturn the result as a JSON object with keys: education, organizational_experience, work_experience, soft_skills, hard_skills.\n\nCV Content:\n"""\n${extractedText}\n"""`;
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-llm:7b', // Use DeepSeek-LLM 7B model
        prompt,
        stream: false,
      }),
    });
    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      return NextResponse.json({ error: 'Ollama API error', details: errorText }, { status: 500 });
    }
    const ollamaData = await ollamaResponse.json();
    const aiResponse = ollamaData.response;
    let extractedJson;
    try {
      extractedJson = JSON.parse(aiResponse || '{}');
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse Ollama response as JSON.', aiResponse }, { status: 500 });
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