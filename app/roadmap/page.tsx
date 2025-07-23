"use client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, CheckCircle, Sparkles, Trophy, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const STATIC_ROADMAP = [
  {
    phase: "Phase 1: Dasar & Persiapan",
    description: "Pelajari fundamental dan persiapkan dokumen penting.",
    skills: ["CV Writing", "Self Awareness", "Basic Communication"],
    courses: ["Membuat CV Profesional", "Dasar Komunikasi Efektif"],
    status: "In Progress",
  },
  {
    phase: "Phase 2: Penguasaan Skill Inti",
    description: "Kuasai skill utama sesuai hasil analisis AI.",
    skills: ["React", "TypeScript", "Problem Solving"],
    courses: ["React for Beginners", "TypeScript Essentials", "Problem Solving Mastery"],
    status: "Upcoming",
  },
  {
    phase: "Phase 3: Soft Skills & Interview",
    description: "Tingkatkan soft skills dan persiapkan interview.",
    skills: ["Leadership", "Teamwork", "Interview Skills"],
    courses: ["Soft Skills for Tech Talent", "Simulasi Interview Kerja"],
    status: "Planned",
  },
  {
    phase: "Phase 4: Apply & Networking",
    description: "Mulai apply pekerjaan dan bangun network profesional.",
    skills: ["Job Application", "Networking"],
    courses: ["Strategi Apply Kerja", "Membangun LinkedIn & Network"],
    status: "Planned",
  },
];

export default function RoadmapPage() {
  const { user } = useAuth();
  const [aiRoadmap, setAiRoadmap] = useState<string[] | null>(null);
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const roadmap = localStorage.getItem("roadmapAI");
      if (roadmap) {
        try {
          const parsed = JSON.parse(roadmap);
          setAiRoadmap(parsed);
          // Load checklist state from localStorage
          const savedChecks = localStorage.getItem("roadmapAIChecked");
          if (savedChecks) {
            setChecked(JSON.parse(savedChecks));
          } else {
            setChecked(Array(parsed.length).fill(false));
          }
        } catch {
          setAiRoadmap(null);
        }
      }
    }
  }, []);

  // Save checklist state to localStorage
  useEffect(() => {
    if (aiRoadmap) {
      localStorage.setItem("roadmapAIChecked", JSON.stringify(checked));
    }
  }, [checked, aiRoadmap]);

  const handleCheck = (idx: number) => {
    setChecked(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white py-10 px-2 md:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">Roadmap Karir AI</h1>
          <p className="text-gray-600 text-lg md:text-xl">Langkah-langkah terstruktur untuk mendapatkan pekerjaan impian, disesuaikan dengan hasil analisis AI dari CV & MBTI Anda</p>
        </div>

        {aiRoadmap && aiRoadmap.length > 0 ? (
          <div className="space-y-8">
            <Card className="rounded-3xl shadow-2xl border-2 border-sky-100 bg-gradient-to-br from-white via-sky-50 to-emerald-50 hover:shadow-emerald-200 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex flex-col items-center gap-2 mb-2">
                  <Trophy className="w-10 h-10 text-emerald-500 drop-shadow-lg animate-bounce" />
                  <span className="text-lg font-bold text-emerald-700 bg-emerald-100 rounded-full px-4 py-1 shadow">Ayo Raih Karir Impianmu!</span>
                </div>
                <CardTitle className="text-2xl md:text-2xl font-extrabold text-sky-700 mb-1 bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">Roadmap Pengembangan Skill</CardTitle>
                <CardDescription className="text-gray-600 mb-1">Roadmap ini dihasilkan dari analisis AI berdasarkan CV & MBTI Anda.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Progress Bar */}
                <div className="mb-6 flex items-center gap-3">
                  <Progress value={checked.filter(Boolean).length / aiRoadmap.length * 100} className="h-3 flex-1 bg-sky-100" />
                  <span className={`ml-2 text-xs font-bold px-3 py-1 rounded-full shadow ${checked.filter(Boolean).length === aiRoadmap.length ? 'bg-emerald-500 text-white' : 'bg-sky-100 text-sky-700'}`}>
                    {checked.filter(Boolean).length} / {aiRoadmap.length} langkah selesai
                  </span>
                </div>
                <div className="mb-6 flex items-center gap-2 justify-center">
                  <Sparkles className="w-6 h-6 text-sky-400 animate-pulse" />
                  <span className="text-base md:text-lg font-semibold text-emerald-700">Setiap langkah yang kamu selesaikan, kamu semakin dekat dengan karir impianmu!</span>
                  <Smile className="w-6 h-6 text-emerald-400 animate-pulse" />
                </div>
                <ul className="list-none space-y-4">
                  {aiRoadmap.map((item: string, idx: number) => (
                    <li
                      key={idx}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 shadow-lg transition-all duration-300 relative overflow-hidden
                        ${checked[idx]
                          ? 'bg-gradient-to-r from-emerald-100 to-sky-50 border-emerald-300 scale-[1.01]'
                          : 'bg-white border-sky-100 hover:bg-sky-50 hover:scale-[1.01]'}
                      `}
                    >
                      <button
                        type="button"
                        aria-label={checked[idx] ? 'Uncheck' : 'Check'}
                        onClick={() => handleCheck(idx)}
                        className={`w-7 h-7 flex items-center justify-center rounded-full border-2 transition-all duration-200
                          ${checked[idx] ? 'bg-emerald-500 border-emerald-500 shadow-lg' : 'bg-white border-sky-300'}
                          focus:outline-none focus:ring-2 focus:ring-emerald-400`}
                      >
                        {checked[idx]
                          ? <CheckCircle className="w-5 h-5 text-white animate-bounce" />
                          : <span className="block w-4 h-4 rounded-full border border-sky-300" />}
                      </button>
                      <label
                        htmlFor={`step-${idx}`}
                        className={`flex-1 text-base md:text-lg font-semibold cursor-pointer transition-all duration-200
                          ${checked[idx] ? 'line-through text-emerald-700 opacity-70' : 'text-sky-700'}`}
                        style={{ userSelect: 'none' }}
                      >
                        {item}
                      </label>
                      {checked[idx] && (
                        <span className="ml-2 text-xs bg-gradient-to-r from-emerald-400 to-sky-400 text-white px-3 py-1 rounded-full font-bold shadow animate-fade-in">Selesai!</span>
                      )}
                      {/* Motivational confetti or icon */}
                      {checked[idx] && (
                        <Sparkles className="absolute right-3 top-3 w-5 h-5 text-emerald-400 animate-ping" />
                      )}
                    </li>
                  ))}
                </ul>
                {checked.filter(Boolean).length === aiRoadmap.length && (
                  <div className="mt-8 flex flex-col items-center gap-2 animate-fade-in">
                    <Trophy className="w-12 h-12 text-emerald-500 drop-shadow-lg animate-bounce" />
                    <span className="text-lg font-bold text-emerald-700 bg-emerald-100 rounded-full px-6 py-2 shadow">Selamat! Kamu telah menyelesaikan seluruh roadmap AI 🎉</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {STATIC_ROADMAP.map((phase: any, idx: number) => (
              <Card key={idx} className="rounded-2xl shadow-lg border border-sky-100 bg-white/90 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="flex flex-col items-center justify-center">
                    <Badge className={`text-xs px-3 py-1 mb-2 ${phase.status === "In Progress" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : phase.status === "Upcoming" ? "bg-sky-100 text-sky-700 border-sky-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>{phase.status}</Badge>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg md:text-xl font-bold text-sky-700 mb-1">{phase.phase}</CardTitle>
                    <CardDescription className="text-gray-600 mb-1">{phase.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="mb-2">
                    <div className="font-semibold text-gray-700 mb-1">Skill yang Perlu Dikuasai:</div>
                    <ul className="flex flex-wrap gap-2 mb-2">
                      {phase.skills.map((skill: string) => (
                        <li key={skill} className="flex items-center gap-1 bg-sky-50 border border-sky-200 rounded-full px-3 py-1 text-sky-700 text-xs font-medium">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700 mb-1">Course yang Direkomendasikan:</div>
                    <ul className="flex flex-wrap gap-2">
                      {phase.courses.map((course: string) => (
                        <li key={course} className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 text-emerald-700 text-xs font-medium">
                          <BookOpen className="w-4 h-4 text-sky-500" /> {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 