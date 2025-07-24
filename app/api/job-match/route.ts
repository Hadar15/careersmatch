import { NextRequest, NextResponse } from 'next/server';

function getConsistentPercent(userId: string, jobId: string) {
  let hash = 0;
  const str = userId + jobId;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return 60 + Math.abs(hash % 40); // 60-99
}

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function getGeminiPros(cv: any, job: any) {
  try {
    const GEMINI_API_URL = process.env.GEMINI_API_URL || '';
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
    // Tambahkan log untuk debug env
    console.log('[Gemini Debug] GEMINI_API_URL:', GEMINI_API_URL);
    console.log('[Gemini Debug] GEMINI_API_KEY:', GEMINI_API_KEY ? 'SET' : 'NOT SET');
    if (!GEMINI_API_URL || !GEMINI_API_KEY) throw new Error('Gemini API not configured');
    const prompt = `Berdasarkan data CV berikut dan deskripsi pekerjaan berikut, sebutkan 2-3 keuntungan utama jika user mengambil pekerjaan ini. Jawab dalam array string.\n\nCV: ${JSON.stringify(cv)}\n\nDeskripsi Pekerjaan: ${job.title} - ${job.description}`;
    const body = {
      contents: [
        { parts: [{ text: prompt }] }
      ]
    };
    const resp = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify(body)
    });
    // Log response status dan body untuk debug
    console.log('[Gemini Debug] Response status:', resp.status);
    const data = await resp.json();
    console.log('[Gemini Debug] Response data:', data);
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Try to parse as JSON array
    let arr: string[] = [];
    try {
      arr = JSON.parse(text);
      if (!Array.isArray(arr)) arr = [text];
    } catch {
      // Fallback: split by line
      arr = text.split(/\n|\r/).map((s: string) => s.trim()).filter(Boolean);
    }
    // Only accept if at least one non-empty string
    if (arr.length > 0 && arr.some((s) => s && typeof s === 'string' && s.length > 3)) {
      return arr.slice(0, 3);
    }
    return null;
  } catch (e) {
    // Log error for debugging
    // eslint-disable-next-line no-console
    console.error('[Gemini API Error]', e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { cv, jobs } = await req.json();
    if (!cv || !jobs) {
      return NextResponse.json({ error: 'Missing cv or jobs' }, { status: 400 });
    }
    const userId = cv.user_id || 'user';
    const skills = (cv.skills || []).map((s: any) => s.toLowerCase());
    // Analisis pros dari Gemini API secara paralel
    const jobsToProcess = jobs.slice(0, 10);
    const prosArr = await Promise.all(jobsToProcess.map(async (job: any) => {
      const jobId = job.id ? String(job.id) : job.title;
      const percent = getConsistentPercent(userId, jobId);
      const descPlain = stripHtml(job.description || '');
      // Fallback pros/cons sederhana
      const foundSkills = skills.filter((skill: any) => descPlain.toLowerCase().includes(skill));
      const missingSkills = skills.filter((skill: any) => !descPlain.toLowerCase().includes(skill));
      let pros = [];
      // Coba Gemini API
      const geminiPros = await getGeminiPros(cv, { ...job, description: descPlain });
      if (geminiPros && geminiPros.length > 0) {
        pros = geminiPros;
      } else {
        if (foundSkills.length > 0) pros.push(`Skill Anda relevan: ${foundSkills.join(', ')}`);
        else pros.push('Pekerjaan ini dapat menjadi peluang baru untuk mengembangkan skill Anda.');
      }
      const cons = [];
      if (missingSkills.length > 0) cons.push(`Skill berikut kurang relevan: ${missingSkills.join(', ')}`);
      if (job.candidate_required_location) cons.push(`Lokasi: ${job.candidate_required_location}`);
      return { job: { ...job, description: descPlain }, percent, pros, cons };
    }));
    const sorted = prosArr.sort((a: any, b: any) => b.percent - a.percent);
    return NextResponse.json(sorted);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
} 