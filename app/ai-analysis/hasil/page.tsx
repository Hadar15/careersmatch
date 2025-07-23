"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function HasilAnalisisAIPage() {
  const [aiResult, setAiResult] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; message: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Ambil hasil analisis dari localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cvAnalysis");
      if (saved) {
        const parsed = JSON.parse(saved);
        setAiResult(parsed);
        // Simpan roadmap ke localStorage untuk /roadmap
        if (parsed.recommendations) {
          localStorage.setItem("roadmapAI", JSON.stringify(parsed.recommendations));
        }
      }
    }
  }, []);

  const handleSend = async () => {
    if (!feedback.trim()) return;
    setChat((prev) => [...prev, { role: "user", message: feedback }]);
    setLoading(true);
    setFeedback("");
    // Mock AI response (replace with real API call)
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        { role: "ai", message: "Terima kasih atas pertanyaannya! Fitur tanya AI akan segera hadir. (Integrasi API AI di sini)" },
      ]);
      setLoading(false);
    }, 1200);
  };

  if (!aiResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
        <Card className="max-w-xl w-full text-center p-8 shadow-xl border-sky-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">Hasil Analisis Tidak Ditemukan</CardTitle>
            <CardDescription className="mt-2">Silakan upload CV terlebih dahulu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => router.push("/upload-cv")} className="mt-4 w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold">Upload CV</Button>
            <Button 
              onClick={() => {
                // Create mock data for demo purposes
                const mockAnalysis = {
                  skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git"],
                  hiddenSkills: ["Leadership", "Project Management", "Problem Solving"],
                  experience: {
                    totalYears: 3,
                    roles: [
                      { title: "Frontend Developer", company: "Tech Corp", duration: "2 years" },
                      { title: "Junior Developer", company: "StartupXYZ", duration: "1 year" },
                    ],
                  },
                  industries: ["Technology", "Software Development"],
                  level: "Mid-Level",
                  recommendations: [
                    "Consider learning TypeScript for better code quality",
                    "Explore cloud technologies like AWS or Azure",
                    "Develop leadership skills for senior roles",
                  ],
                };
                localStorage.setItem("cvAnalysis", JSON.stringify(mockAnalysis));
                window.location.reload();
              }} 
              variant="outline" 
              className="w-full border-sky-200 text-sky-600 hover:bg-sky-50"
            >
              Lihat Demo Hasil Analisis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
      <Card className="max-w-3xl w-full p-8 shadow-2xl border-sky-100">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">Hasil Analisis AI</CardTitle>
          <CardDescription className="text-gray-600">Berikut hasil analisis berdasarkan CV dan MBTI Anda</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
          {/* Jenis pekerjaan yang cocok */}
          <div className="bg-gradient-to-r from-sky-100 to-emerald-50 rounded-2xl p-6 shadow">
            <div className="font-bold text-lg text-sky-700 mb-2">Pekerjaan yang Cocok</div>
            <ul className="list-disc ml-6 text-gray-800 space-y-1">
              {aiResult?.industries?.map((job: string, i: number) => (
                <li key={i}>{job} <span className="text-xs text-gray-500">(rekomendasi AI)</span></li>
              ))}
            </ul>
            <div className="text-sm text-gray-500 mt-2">AI memilih pekerjaan ini berdasarkan skill dan pengalaman Anda.</div>
          </div>
          {/* Rangkuman pengalaman dan skill */}
          <div className="bg-gradient-to-r from-emerald-100 to-sky-50 rounded-2xl p-6 shadow">
            <div className="font-bold text-lg text-emerald-700 mb-2">Rangkuman Pengalaman & Skill</div>
            <div className="mb-2">
              <span className="font-semibold">Total Pengalaman:</span> {aiResult?.experience?.totalYears || 0} tahun
            </div>
            <div className="mb-2">
              <span className="font-semibold">Peran:</span>
              <ul className="list-disc ml-6 text-gray-800">
                {aiResult?.experience?.roles?.map((role: any, i: number) => (
                  <li key={i}>{role.title} di {role.company} ({role.duration})</li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Skill Utama:</span>
              <ul className="flex flex-wrap gap-2 mt-1">
                {aiResult?.skills?.map((skill: string, i: number) => (
                  <li key={i} className="bg-sky-200 text-sky-800 rounded-full px-3 py-1 text-sm font-semibold shadow-sm">{skill}</li>
                ))}
              </ul>
            </div>
            {aiResult?.hiddenSkills?.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Skill Tersembunyi:</span>
                <ul className="flex flex-wrap gap-2 mt-1">
                  {aiResult?.hiddenSkills?.map((skill: string, i: number) => (
                    <li key={i} className="bg-emerald-200 text-emerald-800 rounded-full px-3 py-1 text-sm font-semibold shadow-sm">{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Saran dan Roadmap */}
          {aiResult?.recommendations?.length > 0 && (
            <div className="bg-gradient-to-r from-sky-50 to-emerald-100 rounded-2xl p-6 shadow">
              <div className="font-bold text-lg text-emerald-700 mb-2">Saran & Roadmap Pengembangan Skill</div>
              <ul className="list-disc ml-6 text-gray-800 space-y-1">
                {aiResult.recommendations.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
              <div className="text-sm text-gray-500 mt-2">AI menyarankan roadmap ini agar Anda bisa meningkatkan peluang karir.</div>
            </div>
          )}
          {/* Chat/pertanyaan ke AI */}
          <div className="bg-white/80 border border-sky-100 rounded-2xl p-6 shadow flex flex-col gap-3">
            <div className="font-bold text-lg text-sky-700 mb-2">Tanya AI</div>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mb-2">
              {chat.map((c, i) => (
                <div key={i} className={c.role === "user" ? "text-right" : "text-left"}>
                  <span className={c.role === "user" ? "inline-block bg-sky-200 text-sky-800 rounded-xl px-4 py-2 my-1" : "inline-block bg-emerald-200 text-emerald-800 rounded-xl px-4 py-2 my-1"}>
                    {c.role === "user" ? "Anda: " : "AI: "}{c.message}
                  </span>
                </div>
              ))}
              {loading && <div className="text-left"><span className="inline-block bg-emerald-100 text-emerald-700 rounded-xl px-4 py-2 my-1 animate-pulse">AI sedang mengetik...</span></div>}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Tulis pertanyaan atau konsultasi karir Anda di sini..."
                rows={2}
                className="rounded-xl border-emerald-200 shadow flex-1"
                disabled={loading}
              />
              <Button onClick={handleSend} disabled={loading || !feedback.trim()} className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold px-6 py-2 rounded-xl shadow transition">Kirim</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 