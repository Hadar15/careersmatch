"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

interface AnalysisData {
  recommended_jobs: string[];
  experience_summary: {
    total_experience_years: number;
    key_roles: Array<{
      title: string;
      organization: string;
      duration: string;
      type: string;
    }>;
    technical_skills: string[];
    soft_skills: string[];
    hidden_skills: Array<{
      skill: string;
      explanation: string;
    }>;
  };
  skill_roadmap: Array<{
    recommendation: string;
    reason: string;
    priority: string;
  }>;
}

export default function HasilAnalisisAIPage() {
  const [aiResult, setAiResult] = useState<AnalysisData | null>(null);
  const [feedback, setFeedback] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; message: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const loadAnalysis = async () => {
      if (!user) return;

      setAnalysisLoading(true);
      setError(null);

      try {
        const cvFileName = localStorage.getItem("uploadedCVName") || "resume.pdf";
        
        const response = await fetch("/api/analyze-cv", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            cvFileName: cvFileName,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to analyze CV");
        }

        if (data.success) {
          setAiResult({
            recommended_jobs: data.data.recommended_jobs,
            experience_summary: data.data.experience_summary,
            skill_roadmap: data.data.skill_roadmap,
          });
        }
      } catch (err) {
        console.error("Analysis error:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menganalisis CV");
      } finally {
        setAnalysisLoading(false);
      }
    };

    loadAnalysis();
  }, [user]);

  const handleSend = async () => {
    if (!feedback.trim()) return;
    setChat((prev) => [...prev, { role: "user", message: feedback }]);
    setLoading(true);
    setFeedback("");
    
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        { role: "ai", message: "Terima kasih atas pertanyaannya! Fitur tanya AI akan segera hadir." },
      ]);
      setLoading(false);
    }, 1200);
  };

  if (analysisLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-xl w-full text-center p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
            <CardTitle className="text-xl font-bold">Menganalisis data anda</CardTitle>
            <CardDescription>Mohon tunggu, AI sedang menganalisis CV dan profil Anda...</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-xl w-full text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Analisis Gagal</CardTitle>
            <CardDescription className="mt-2 text-red-600">{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => router.push("/upload-cv")} className="w-full">
              Upload CV Ulang
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!aiResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-xl w-full text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Data Analisis Tidak Ditemukan</CardTitle>
            <CardDescription className="mt-2">
              CV Anda belum dianalisis. Silakan upload CV terlebih dahulu.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => router.push("/upload-cv")} className="w-full">
              Upload CV
            </Button>
            <Button 
              onClick={() => {
                const mockAnalysis = {
                  recommended_jobs: ["Frontend Developer", "Full Stack Developer", "Software Engineer"],
                  experience_summary: {
                    total_experience_years: 3,
                    key_roles: [
                      { title: "Frontend Developer", organization: "Tech Corp", duration: "2 years", type: "Full-time" }
                    ],
                    technical_skills: ["JavaScript", "React", "Node.js"],
                    soft_skills: ["Communication", "Teamwork"],
                    hidden_skills: [
                      { skill: "Leadership", explanation: "Shows leadership potential" }
                    ],
                  },
                  skill_roadmap: [
                    { recommendation: "Learn TypeScript", reason: "Industry demand", priority: "high" }
                  ],
                };
                setAiResult(mockAnalysis);
              }} 
              variant="outline" 
              className="w-full"
            >
              Lihat Demo Hasil Analisis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-3xl font-bold">Hasil Analisis AI</CardTitle>
          <CardDescription>Berikut hasil analisis berdasarkan CV dan profil Anda</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {/* Recommended Jobs */}
          <div className="bg-sky-50 rounded-2xl p-6">
            <div className="font-bold text-lg text-sky-700 mb-2">Pekerjaan yang Cocok</div>
            <ul className="list-disc ml-6 space-y-1">
              {aiResult.recommended_jobs.map((job: string, i: number) => (
                <li key={i}>{job}</li>
              ))}
            </ul>
          </div>

          {/* Experience Summary */}
          <div className="bg-emerald-50 rounded-2xl p-6">
            <div className="font-bold text-lg text-emerald-700 mb-4">Rangkuman Pengalaman & Skill</div>
            
            <div className="mb-4">
              <div className="font-semibold mb-2">
                Pengalaman: {aiResult.experience_summary.total_experience_years} tahun
              </div>
              <div className="space-y-2">
                {aiResult.experience_summary.key_roles.map((role: { title: string; organization: string; duration: string; type: string }, i: number) => (
                  <div key={i} className="bg-white p-3 rounded-lg">
                    <div className="font-medium">{role.title}</div>
                    <div className="text-sm text-gray-600">{role.organization} • {role.duration}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="font-semibold mb-2">Technical Skills:</div>
              <div className="flex flex-wrap gap-2">
                {aiResult.experience_summary.technical_skills.map((skill: string, i: number) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2">Hidden Skills:</div>
              <div className="space-y-2">
                {aiResult.experience_summary.hidden_skills && aiResult.experience_summary.hidden_skills.map((hiddenSkill: { skill: string; explanation: string }, i: number) => (
                  <div key={i} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <div className="font-medium text-yellow-800">{hiddenSkill.skill}</div>
                    <div className="text-sm text-yellow-700">{hiddenSkill.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Roadmap */}
          <div className="bg-purple-50 rounded-2xl p-6">
            <div className="font-bold text-lg text-purple-700 mb-2">Roadmap Pengembangan Skill</div>
            <div className="space-y-3">
              {aiResult.skill_roadmap.map((roadmapItem: { recommendation: string; reason: string; priority: string }, i: number) => (
                <div key={i} className="bg-white p-4 rounded-lg border-l-4 border-purple-400">
                  <div className="font-medium mb-1">{roadmapItem.recommendation}</div>
                  <div className="text-sm text-gray-600 mb-2">{roadmapItem.reason}</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    roadmapItem.priority === 'high' ? 'bg-red-100 text-red-800' :
                    roadmapItem.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    Prioritas {roadmapItem.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-2xl p-6 border">
            <div className="font-bold text-lg mb-4">Tanya AI tentang Hasil Analisis</div>
            
            <div className="mb-4 max-h-64 overflow-y-auto space-y-3">
              {chat.map((msg: { role: "user" | "ai"; message: string }, i: number) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === "user" ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-800"
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tanyakan sesuatu tentang hasil analisis Anda..."
                className="flex-1 min-h-[40px]"
                disabled={loading}
              />
              <Button 
                onClick={handleSend} 
                disabled={loading || !feedback.trim()}
                className="bg-sky-500 hover:bg-sky-600 text-white"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kirim"}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <Button 
              onClick={() => router.push("/job-matching")} 
              className="flex-1"
            >
              Cari Pekerjaan yang Cocok
            </Button>
            <Button 
              onClick={() => router.push("/courses")} 
              variant="outline" 
              className="flex-1"
            >
              Lihat Kursus Rekomendasi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
