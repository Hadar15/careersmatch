import { NextRequest, NextResponse } from 'next/server';

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function getGeminiJobMatch(cv: any, jobs: any[]) {
  const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
  if (!GEMINI_API_URL || !GEMINI_API_KEY) throw new Error('Gemini API not configured');
  // Prompt: minta Gemini membandingkan CV dengan 10 job sekaligus, hasilkan array [{ job_title, percent, pros, cons }]
  const prompt = `Berikut adalah data CV user dan 10 deskripsi pekerjaan. Untuk setiap pekerjaan, analisis dan berikan skor kecocokan (0-100), pros (2-3 keuntungan utama jika user mengambil pekerjaan ini), dan cons (2-3 kekurangan/hal yang perlu dipertimbangkan). Jawab dalam format array JSON: [{ job_title, percent, pros, cons }].

CV:
${JSON.stringify(cv)}

Jobs:
${JSON.stringify(jobs.map(j => ({ title: j.title, description: stripHtml(j.description), company: j.company_name })))}
`;
  const body = {
    contents: [
      { parts: [{ text: prompt }] }
    ]
  };
  const urlWithKey = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
  const resp = await fetch(urlWithKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await resp.json();
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  // Log isi response Gemini sebelum parsing
  console.log('[Gemini Debug] Raw Gemini response:', text);
  // Clean up text (remove markdown, newlines)
  // Perbaiki: ekstrak array JSON dari response Gemini jika ada penjelasan sebelum array
  const jsonArrayMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);
  if (jsonArrayMatch) {
    text = jsonArrayMatch[0];
  } else {
    text = text.replace(/^```json\n?|```$/g, '').replace(/\n+/g, ' ').trim();
  }
  if (!text || text.length < 10) {
    throw new Error('Gemini response kosong atau terlalu pendek. Response: ' + JSON.stringify(data));
  }
  let arr: any[] = [];
  try {
    arr = JSON.parse(text);
    if (!Array.isArray(arr)) arr = [];
  } catch {
    // Kirim isi response Gemini ke frontend untuk debug
    throw new Error('Failed to parse Gemini response as JSON. Response: ' + text);
  }
  return arr;
}

export async function POST(req: NextRequest) {
  try {
    const { cv, jobs } = await req.json();
    if (!cv || !jobs) {
      return NextResponse.json({ error: 'Missing cv or jobs' }, { status: 400 });
    }
    // Ambil 10 job teratas dari Remotive
    const jobsToProcess = jobs.slice(0, 10);
    // Panggil Gemini untuk seluruh job sekaligus
    const geminiResults = await getGeminiJobMatch(cv, jobsToProcess);
    // Gabungkan hasil Gemini dengan data job asli (cari berdasarkan title)
    const result = geminiResults.map((g: any) => {
      const job = jobsToProcess.find((j: any) => j.title === g.job_title);
      return {
        job,
        percent: g.percent,
        pros: g.pros,
        cons: g.cons
      };
    }).filter((r: any) => r.job && typeof r.percent === 'number');
    // Urutkan dari percent tertinggi
    const sorted = result.sort((a: any, b: any) => b.percent - a.percent);
    return NextResponse.json(sorted);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
} 