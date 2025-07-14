import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "API Key OpenAI belum diatur. Tambahkan OPENAI_API_KEY di .env.local" }, { status: 500 })
  }

  const { cvText, mbtiText } = await req.json()
  if (!cvText || !mbtiText) {
    return NextResponse.json({ error: "CV dan MBTI harus diisi" }, { status: 400 })
  }

  // Prompt untuk ChatGPT
  const prompt = `
Kamu adalah asisten karir AI. Berdasarkan data berikut:

CV:
${cvText}

MBTI:
${mbtiText}

1. Ekstrak data penting: TTL, pendidikan, pengalaman kerja, skill utama.
2. Cek kelengkapan data. Jika ada yang kurang, sebutkan apa saja yang kurang.
3. Berdasarkan CV & MBTI, rekomendasikan 3-5 pekerjaan yang cocok (sertakan persentase kecocokan dan alasan singkat).
4. Berikan saran: apakah user sebaiknya langsung cari kerja atau upgrade skill dulu? Jika upgrade, rekomendasikan skill/courses yang relevan.

Format output JSON:
{
  "data": {
    "ttl": string,
    "pendidikan": string,
    "pengalaman": string,
    "skills": string[]
  },
  "kelengkapan": string[], // field yang kurang
  "rekomendasi_pekerjaan": [
    { "pekerjaan": string, "persentase": number, "alasan": string }
  ],
  "saran": string,
  "rekomendasi_skill": string[]
}
`

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Kamu adalah asisten karir AI yang membantu user menemukan pekerjaan dan pengembangan skill." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 800,
      }),
    })
    const data = await response.json()
    // Ambil hasil dari ChatGPT (parsing JSON dari response)
    let result = null
    try {
      // Cari blok JSON di response
      const match = data.choices?.[0]?.message?.content.match(/\{[\s\S]*\}/)
      if (match) {
        result = JSON.parse(match[0])
      }
    } catch (e) {}
    return NextResponse.json({ raw: data, result })
  } catch (error) {
    return NextResponse.json({ error: "Gagal memanggil OpenAI API" }, { status: 500 })
  }
} 