import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { cv } = await req.json();
    const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
    if (!GEMINI_API_URL || !GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API not configured' }, { status: 500 });
    }
    const prompt = `Berdasarkan data CV berikut, buatkan satu paragraf ringkasan yang sangat menjelaskan skill utama, kekuatan, dan keunggulan user secara profesional. Gunakan bahasa Indonesia yang jelas dan profesional.\n\nCV: ${JSON.stringify(cv)}`;
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
    // Clean up text (remove extra newlines)
    text = text.replace(/\n+/g, ' ').trim();
    return NextResponse.json({ summary: text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
} 