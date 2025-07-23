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
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    // Ambil data tambahan dari formData
    const locationRaw = formData.get('location');
    const mbtiType = formData.get('mbtiType');
    const mbtiParagraph = formData.get('mbtiParagraph');

    if (!file || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
    }
    // Parse location jika ada
    let location = null;
    if (typeof locationRaw === 'string') {
      try {
        location = JSON.parse(locationRaw);
      } catch (e) {
        location = null;
      }
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

    // Tambahkan location dan mbti ke dalam JSON hasil
    if (location) {
      extractedJson.location = location;
    }
    // Proses MBTI analysis dengan Gemini jika mbtiType ada
    if (typeof mbtiType === 'string' && mbtiType.length === 4) {
      // Panggil Gemini API untuk deskripsi MBTI
      let mbtiText = '';
      try {
        const mbtiPrompt = `Jelaskan tipe kepribadian MBTI ${mbtiType} dalam 2 paragraf panjang, bahasa Indonesia, untuk orang awam. Paragraf 1: karakteristik umum, kekuatan, dan gaya interaksi sosial. Paragraf 2: potensi karir, tantangan, dan tips pengembangan diri. Jangan sebut 'MBTI' di paragraf.`;
        const mbtiGeminiBody = {
          contents: [
            { parts: [{ text: mbtiPrompt }] }
          ]
        };
        const mbtiGeminiResponse = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mbtiGeminiBody),
        });
        if (mbtiGeminiResponse.ok) {
          const mbtiGeminiData = await mbtiGeminiResponse.json();
          let mbtiAI = mbtiGeminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (mbtiAI.startsWith('```')) {
            mbtiAI = mbtiAI.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
          }
          mbtiText = mbtiAI.trim();
        }
      } catch (e) {}
      // Fallback jika Gemini gagal atau kosong
      if (!mbtiText) {
        const mbtiDescriptions: Record<string, string> = {
          ISTJ: `Orang dengan tipe ini dikenal sangat logis, bertanggung jawab, dan sangat terorganisir. Mereka cenderung memegang teguh prinsip, dapat diandalkan, dan suka bekerja dengan sistem yang jelas. Dalam interaksi sosial, mereka lebih suka lingkungan yang terstruktur dan menghargai tradisi serta aturan yang berlaku.\n\nDalam dunia kerja, mereka cocok di bidang administrasi, keuangan, atau manajemen yang membutuhkan ketelitian dan konsistensi. Tantangan utama adalah fleksibilitas terhadap perubahan mendadak. Tips pengembangan diri: belajar lebih terbuka terhadap ide baru dan meningkatkan kemampuan komunikasi interpersonal.`,
          ISFJ: `Tipe ini sangat setia, teliti, dan peduli terhadap orang lain. Mereka suka membantu, perhatian pada detail, dan sering menjadi pendengar yang baik. Dalam hubungan sosial, mereka cenderung hangat, suportif, dan menjaga keharmonisan kelompok.\n\nKarir yang cocok meliputi bidang kesehatan, pendidikan, atau pelayanan sosial. Tantangan yang sering dihadapi adalah kesulitan berkata 'tidak' dan cenderung mengabaikan kebutuhan diri sendiri. Tips: belajar menetapkan batasan dan mengutamakan self-care.`,
          INFJ: `Visioner, idealis, dan sangat empatik, tipe ini sering memiliki tujuan hidup yang jelas dan ingin membuat perubahan positif. Mereka mampu memahami perasaan orang lain secara mendalam dan sering menjadi inspirasi di lingkungannya.\n\nKarir yang cocok di bidang konseling, psikologi, atau penulisan kreatif. Tantangan: mudah merasa lelah secara emosional dan perfeksionis. Tips: belajar menerima ketidaksempurnaan dan menjaga keseimbangan antara membantu orang lain dan diri sendiri.`,
          INTJ: `Strategis, mandiri, berpikiran logis dan analitis, tipe ini suka merencanakan masa depan dan mencari solusi inovatif. Mereka cenderung independen, percaya diri, dan tidak takut mengambil keputusan besar.\n\nCocok di bidang riset, teknologi, atau manajemen strategis. Tantangan: kadang dianggap terlalu kaku atau kurang peka terhadap perasaan orang lain. Tips: kembangkan empati dan keterampilan komunikasi untuk membangun kerja tim yang lebih baik.`,
          ISTP: `Praktis, suka eksplorasi, dan problem-solver, tipe ini senang memahami cara kerja sesuatu dan cepat beradaptasi dengan situasi baru. Mereka cenderung tenang, logis, dan suka tantangan teknis.\n\nKarir yang cocok di bidang teknik, mekanik, atau pekerjaan lapangan. Tantangan: kadang kurang ekspresif dan sulit berkomitmen pada rutinitas. Tips: belajar mengelola emosi dan membangun hubungan jangka panjang.`,
          ISFP: `Sederhana, artistik, dan menyukai kedamaian, tipe ini sangat menghargai keindahan dan harmoni. Mereka cenderung sensitif, rendah hati, dan suka membantu secara praktis.\n\nCocok di bidang seni, desain, atau pekerjaan yang melibatkan kreativitas. Tantangan: mudah menghindari konflik dan sulit mengungkapkan pendapat. Tips: berlatih asertif dan percaya diri dalam mengekspresikan ide.`,
          INFP: `Penuh imajinasi, idealis, dan sensitif, tipe ini sangat peduli pada nilai-nilai pribadi dan ingin hidup bermakna. Mereka kreatif, setia, dan suka mendukung orang lain secara tulus.\n\nKarir yang cocok di bidang sastra, seni, atau pekerjaan sosial. Tantangan: mudah kecewa jika realita tidak sesuai harapan. Tips: belajar menerima perbedaan dan mengelola ekspektasi dengan realistis.`,
          INTP: `Intelektual, analitis, dan suka ide-ide baru, tipe ini senang memecahkan masalah kompleks dan berpikir out of the box. Mereka mandiri, objektif, dan suka diskusi mendalam.\n\nCocok di bidang riset, teknologi, atau pengembangan produk. Tantangan: kadang terlalu kritis dan kurang memperhatikan detail praktis. Tips: kembangkan keterampilan implementasi dan kerja sama tim.`,
          ESTP: `Aktif, spontan, dan menyukai tantangan, tipe ini suka bertindak cepat dan menikmati pengalaman baru. Mereka komunikatif, percaya diri, dan mudah bergaul.\n\nKarir yang cocok di bidang sales, olahraga, atau event organizer. Tantangan: cenderung impulsif dan kurang perencanaan jangka panjang. Tips: belajar membuat strategi dan mengelola risiko dengan lebih matang.`,
          ESFP: `Ceria, suka bersosialisasi, dan hidup di saat ini, tipe ini sangat menikmati interaksi sosial dan membawa energi positif ke sekitarnya. Mereka ekspresif, hangat, dan mudah menyesuaikan diri.\n\nCocok di bidang hiburan, hospitality, atau public relations. Tantangan: mudah bosan dan kurang fokus pada tugas rutin. Tips: kembangkan disiplin dan kemampuan menyelesaikan pekerjaan hingga tuntas.`,
          ENFP: `Penuh energi, kreatif, dan sangat ekspresif, tipe ini suka mengeksplorasi ide baru dan menginspirasi orang lain. Mereka antusias, mudah beradaptasi, dan peduli pada pertumbuhan pribadi.\n\nKarir yang cocok di bidang kreatif, pendidikan, atau komunikasi. Tantangan: mudah kehilangan fokus dan terlalu banyak mengambil proyek. Tips: belajar prioritas dan manajemen waktu yang efektif.`,
          ENTP: `Debater, inovatif, dan suka berpikir out of the box, tipe ini senang berdebat untuk menguji ide dan mencari solusi kreatif. Mereka cepat belajar, suka tantangan intelektual, dan tidak takut berbeda pendapat.\n\nCocok di bidang teknologi, konsultasi, atau entrepreneurship. Tantangan: kadang kurang konsisten dan mudah bosan pada rutinitas. Tips: kembangkan ketekunan dan kemampuan mendengarkan secara aktif.`,
          ESTJ: `Tegas, pemimpin, dan berorientasi hasil, tipe ini suka mengatur dan memastikan segala sesuatu berjalan sesuai rencana. Mereka disiplin, praktis, dan suka mengambil tanggung jawab.\n\nKarir yang cocok di bidang manajemen, pemerintahan, atau militer. Tantangan: kadang terlalu kaku dan kurang fleksibel. Tips: belajar kompromi dan mendengarkan masukan dari orang lain.`,
          ESFJ: `Ramah, kooperatif, dan suka membantu orang, tipe ini sangat peduli pada keharmonisan kelompok dan suka bekerja sama. Mereka komunikatif, suportif, dan mudah dipercaya.\n\nCocok di bidang pelayanan, pendidikan, atau HR. Tantangan: mudah terpengaruh opini orang lain dan sulit mengambil keputusan sendiri. Tips: kembangkan kemandirian dan kepercayaan diri.`,
          ENFJ: `Karismatik, memotivasi, dan sangat perhatian, tipe ini pandai membaca perasaan orang lain dan suka membangun hubungan harmonis. Mereka inspiratif, suportif, dan suka memimpin dengan empati.\n\nKarir yang cocok di bidang pendidikan, konseling, atau kepemimpinan sosial. Tantangan: mudah terbebani masalah orang lain. Tips: belajar menjaga batasan dan merawat diri sendiri.`,
          ENTJ: `Pemimpin alami, tegas, strategis, dan logis, tipe ini suka merancang visi besar dan menggerakkan orang lain untuk mencapainya. Mereka percaya diri, ambisius, dan suka tantangan besar.\n\nCocok di bidang bisnis, manajemen, atau hukum. Tantangan: kadang terlalu dominan dan kurang peka pada perasaan orang lain. Tips: kembangkan empati dan kemampuan mendengarkan.`
        };
        mbtiText = mbtiDescriptions[mbtiType.toUpperCase()] || 'Deskripsi belum tersedia.';
      }
      extractedJson.mbti_type = mbtiType;
      extractedJson.mbti_analysis = mbtiText;
    } else if (typeof mbtiType === 'string') {
      extractedJson.mbti_type = mbtiType;
      extractedJson.mbti_analysis = 'Deskripsi belum tersedia.';
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