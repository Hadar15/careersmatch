// Random comment: Dashboard page random comment for push
"use client"
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, MapPin, DollarSign, User, BookOpen, Clock, ArrowRight, Star, Upload, LogOut, Sparkles, Search, Map } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js" // Kept from 'toriq' branch
import { formatJobType } from "@/lib/utils" // Kept from 'main' branch

console.log("DASHBOARD PAGE RENDERED");

const MBTI_DESCRIPTIONS: Record<string, string> = {
  ISTJ: "Praktis, logis, dan bertanggung jawab. Cocok untuk pekerjaan yang membutuhkan ketelitian dan konsistensi.",
  ISFJ: "Setia, teliti, dan peduli. Sering sukses di bidang pelayanan dan administrasi.",
  INFJ: "Visioner, inspiratif, dan empatik. Cocok di bidang konseling, pendidikan, atau kreatif.",
  INTJ: "Strategis, analitis, dan mandiri. Unggul di bidang riset, teknologi, dan perencanaan.",
  ISTP: "Praktis, logis, dan suka tantangan. Cocok di bidang teknik, mekanik, atau analisis.",
  ISFP: "Sensitif, artistik, dan fleksibel. Sering sukses di seni, desain, atau pelayanan.",
  INFP: "Idealistik, kreatif, dan empatik. Cocok di bidang sastra, seni, atau sosial.",
  INTP: "Analitis, ingin tahu, dan mandiri. Unggul di bidang sains, teknologi, atau analisis.",
  ESTP: "Pragmatis, energik, dan suka aksi. Cocok di bidang sales, olahraga, atau kewirausahaan.",
  ESFP: "Ramah, spontan, dan suka membantu. Sering sukses di hiburan, pelayanan, atau event.",
  ENFP: "Antusias, kreatif, dan komunikatif. Cocok di bidang kreatif, pendidikan, atau sosial.",
  ENTP: "Inovatif, argumentatif, dan cepat tanggap. Unggul di bidang teknologi, bisnis, atau konsultasi.",
  ESTJ: "Tegas, terorganisir, dan efisien. Cocok di manajemen, administrasi, atau hukum.",
  ESFJ: "Peduli, terorganisir, dan kooperatif. Sering sukses di pendidikan, kesehatan, atau pelayanan.",
  ENFJ: "Karismatik, suportif, dan inspiratif. Cocok di bidang kepemimpinan, pendidikan, atau sosial.",
  ENTJ: "Pemimpin, strategis, dan tegas. Unggul di bisnis, manajemen, atau organisasi besar."
};

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)

  // Debug user context
  console.log("DASHBOARD: user context", user);

  useEffect(() => {
    console.log("DASHBOARD useEffect: user", user);
    if (user) {
      setLoading(false);
    } else if (user === null) {
      setLoading(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    console.log("Logout button clicked");
    await signOut();
    // Fallback: force reload in case signOut does not reload
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white flex items-center justify-center">
          <Card className="border-sky-100 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-medium text-gray-700">Memuat dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white flex flex-col items-center py-8">
        <div className="w-full max-w-6xl px-4">
          {/* Welcome Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2 drop-shadow-sm">
              Selamat Datang, {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")?.[0] || "User"}!
            </h1>
            <p className="text-gray-600 text-base md:text-lg">Dashboard lengkap untuk mengelola pencarian karir Anda</p>
          </div>
          {/* Profile Overview */}
          <Card className="mb-10 border-sky-100 shadow-2xl rounded-3xl bg-white/95 p-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-t-3xl px-8 py-6 border-b border-sky-100">
              <CardTitle className="flex items-center space-x-3">
                <User className="w-8 h-8 text-sky-600" />
                <span className="text-xl md:text-2xl font-bold">Profile Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-8 px-4 md:px-12 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
              {/* MBTI Section */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                {profile?.mbti_type ? (
                  <>
                    <span className="text-2xl font-bold text-sky-700 mb-1">{profile.mbti_type}</span>
                    <span className="inline-block bg-sky-100 text-sky-700 rounded-full px-4 py-1 text-sm font-semibold mb-2">Hasil Tes MBTI</span>
                    <p className="text-gray-600 text-center text-sm max-w-xs mb-2">Selamat! Anda telah menyelesaikan tes MBTI. Tipe kepribadian Anda adalah <span className="font-semibold text-sky-700">{profile.mbti_type}</span>.</p>
                    <p className="text-gray-500 text-center text-xs max-w-xs italic">{MBTI_DESCRIPTIONS[profile.mbti_type] || "Tipe MBTI tidak ditemukan."}</p>
                  </>
                ) : (
                  <>
                    <span className="text-xl font-semibold text-gray-400 mb-2">Belum Tes MBTI</span>
                    <p className="text-gray-500 text-center text-sm mb-3 max-w-xs">Anda belum melakukan tes MBTI. Lakukan tes untuk mendapatkan rekomendasi karir yang lebih akurat.</p>
                    <Link href="/ai-analysis">
                      <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition">
                        Tes MBTI Sekarang
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              {/* Info Section */}
              <div className="flex-1 grid grid-cols-2 gap-6 w-full max-w-md">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-sky-600 mb-1">
                    {profile ? profile.experience_years || 0 : 0} th
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">Pengalaman</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-1">5</div>
                  <p className="text-xs md:text-sm text-gray-600">Skills</p>
                </div>
                <div className="col-span-2 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-sky-600 mb-1">
                    {profile ? profile.profile_completion || 0 : 0}%
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">Profile Complete</p>
                  <Progress value={profile ? profile.profile_completion || 0 : 0} className="mt-2 h-2 md:h-3 bg-sky-100" />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Quick Navigation Buttons (moved below profile overview) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <Link href="/ai-analysis">
              <div className="group cursor-pointer bg-gradient-to-br from-sky-100 via-emerald-50 to-white rounded-3xl shadow-xl p-12 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-all border border-sky-100">
                <Sparkles className="w-16 h-16 text-sky-500 group-hover:text-emerald-600 mb-4 transition" />
                <span className="font-bold text-sky-800 text-2xl mb-2 tracking-wide">AI Analysis</span>
                <span className="text-base text-gray-500 text-center">Analisis CV & Karir dengan AI</span>
              </div>
            </Link>
            <Link href="/job-matching">
              <div className="group cursor-pointer bg-gradient-to-br from-emerald-100 via-sky-50 to-white rounded-3xl shadow-xl p-12 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-all border border-emerald-100">
                <Search className="w-16 h-16 text-emerald-500 group-hover:text-sky-600 mb-4 transition" />
                <span className="font-bold text-emerald-800 text-2xl mb-2 tracking-wide">Job Match</span>
                <span className="text-base text-gray-500 text-center">Cari & Temukan Pekerjaan</span>
              </div>
            </Link>
            <Link href="/courses">
              <div className="group cursor-pointer bg-gradient-to-br from-sky-100 via-emerald-50 to-white rounded-3xl shadow-xl p-12 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-all border border-sky-100">
                <BookOpen className="w-16 h-16 text-sky-500 group-hover:text-emerald-600 mb-4 transition" />
                <span className="font-bold text-sky-800 text-2xl mb-2 tracking-wide">Courses</span>
                <span className="text-base text-gray-500 text-center">Belajar & Upgrade Skill</span>
              </div>
            </Link>
            <Link href="/roadmap">
              <div className="group cursor-pointer bg-gradient-to-br from-emerald-100 via-sky-50 to-white rounded-3xl shadow-xl p-12 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-all border border-emerald-100">
                <Map className="w-16 h-16 text-emerald-500 group-hover:text-sky-600 mb-4 transition" />
                <span className="font-bold text-emerald-800 text-2xl mb-2 tracking-wide">Roadmap</span>
                <span className="text-base text-gray-500 text-center">Rencana Belajar & Karir</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}