"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth"
import Link from "next/link"

export default function AIAnalysisPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [cvUploaded, setCvUploaded] = useState(false)
  const [aiAnalysis, setAIAnalysis] = useState<any>(null)

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      // Cek status upload CV
      const { data: cvData } = await supabase.from("cv_uploads").select("*").eq("user_id", user.id).single()
      setCvUploaded(!!cvData)
      // Cek profile (MBTI)
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(profileData)
      // Jika belum upload CV, redirect
      if (!cvData) {
        router.replace("/upload-cv")
        return
      }
      // Jika belum tes MBTI, redirect
      if (!profileData?.mbti_type) {
        router.replace("/mbti-test")
        return
      }
      // Simulasi hasil analisis AI (mock)
      setAIAnalysis({
        summary: `Berdasarkan CV dan hasil MBTI (${profileData.mbti_type}), pekerjaan yang cocok untuk Anda adalah ...`,
        recommendations: [
          "Perbarui skill teknis sesuai kebutuhan industri.",
          "Tingkatkan kemampuan komunikasi dan teamwork.",
          "Siapkan portofolio proyek yang relevan.",
        ],
        chatHistory: [],
      })
      setLoading(false)
    }
    fetchData()
  }, [user, router])

  // Fitur chat AI (mock, bisa diintegrasi ke API AI/LLM)
  const [chatInput, setChatInput] = useState("")
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const handleChat = () => {
    if (!chatInput.trim()) return
    setChatHistory([...chatHistory, { role: "user", content: chatInput }, { role: "ai", content: "(AI) Jawaban atas: " + chatInput }])
    setChatInput("")
  }

  if (loading) return <div className="text-center py-20">Memuat analisis AI...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto border-sky-100 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              Hasil Analisis AI Karir Anda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Ringkasan Analisis:</h3>
              <p className="text-gray-700">{aiAnalysis.summary}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Rekomendasi Persiapan:</h3>
              <ul className="list-disc list-inside text-sky-700">
                {aiAnalysis.recommendations.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Tanya AI seputar karir & pekerjaan:</h3>
              <div className="bg-white rounded-lg border border-sky-100 p-4 mb-2 max-h-48 overflow-y-auto">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                    <span className={msg.role === "user" ? "text-sky-700" : "text-emerald-700"}>
                      <b>{msg.role === "user" ? "Anda" : "AI"}:</b> {msg.content}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-sky-200 rounded-lg px-3 py-2"
                  placeholder="Tulis pertanyaan..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleChat()}
                />
                <button
                  className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold"
                  onClick={handleChat}
                >Kirim</button>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link href="/job-matching">
                <span className="inline-block px-8 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold rounded-xl shadow hover:from-sky-600 hover:to-emerald-600 transition-all duration-300 cursor-pointer">
                  Lanjut ke Job Matching
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 