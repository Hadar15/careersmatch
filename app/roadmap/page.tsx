"use client";
import { useAuth } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, CheckCircle } from "lucide-react";

// Mock data roadmap AI (bisa diganti dengan hasil analisis AI sebenarnya)
const ROADMAP_PHASES = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white py-10 px-2 md:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">Roadmap Karir AI</h1>
          <p className="text-gray-600 text-lg md:text-xl">Langkah-langkah terstruktur untuk mendapatkan pekerjaan impian, disesuaikan dengan hasil analisis AI dari CV & MBTI Anda</p>
        </div>

        <div className="space-y-8">
          {ROADMAP_PHASES.map((phase, idx) => (
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
                    {phase.skills.map(skill => (
                      <li key={skill} className="flex items-center gap-1 bg-sky-50 border border-sky-200 rounded-full px-3 py-1 text-sky-700 text-xs font-medium">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Course yang Direkomendasikan:</div>
                  <ul className="flex flex-wrap gap-2">
                    {phase.courses.map(course => (
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
      </div>
    </div>
  );
} 