import { NextRequest, NextResponse } from 'next/server';

async function getGeminiCourseRecommend(cv: any, jobs: any[], prompt: string) {
  const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
  if (!GEMINI_API_URL || !GEMINI_API_KEY) throw new Error('Gemini API not configured');
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
    throw new Error('Failed to parse Gemini response as JSON. Response: ' + text);
  }
  //p
  return arr;
}

export async function POST(req: Request) {
  try {
    const { cv, jobs } = await req.json();
    console.log('[Gemini Debug] Payload CV:', JSON.stringify(cv).slice(0, 300));
    console.log('[Gemini Debug] Payload Jobs:', JSON.stringify(jobs).slice(0, 200));
    // Perjelas prompt agar AI SELALU mengembalikan array JSON
    const prompt = `Berdasarkan skill gap antara CV user berikut dan 10 job match berikut, rekomendasikan 10 course online (judul, provider, url, durasi, level, deskripsi, reason relevansi). Jawab HANYA dalam format array JSON: [{ title, provider, url, duration, level, description, reason }]. Jangan tambahkan penjelasan apapun di luar array.`;
    const geminiResults = await getGeminiCourseRecommend(cv, jobs, prompt);
    if (!geminiResults || !Array.isArray(geminiResults) || geminiResults.length === 0) {
      throw new Error('Gemini API tidak mengembalikan rekomendasi course. Coba lagi dengan data CV/job yang lebih lengkap.');
    }
    return NextResponse.json(geminiResults);
  } catch (e: any) {
    console.error('[Gemini API Error]', e);
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
} 