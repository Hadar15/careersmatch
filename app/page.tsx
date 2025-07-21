// Random comment: Another test push to GitHub
"use client"
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JobsSection } from "@/components/jobs-section"
import { CoursesSection } from "@/components/courses-section"
import {
  ArrowRight,
  Brain,
  FileText,
  Target,
  TrendingUp,
  MapPin,
  DollarSign,
  Users,
  Shield,
  Zap,
  Star,
  Award,
  Globe,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Removed redirect logic and unused variables
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                CareerMatch
              </span>
              <div className="text-xs font-medium text-emerald-600 hidden sm:block">AI-Powered Career Platform</div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Fitur
            </Link>
            <Link href="#jobs" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Jobs
            </Link>
            <Link href="#courses" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Courses
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Cara Kerja
            </Link>
            <Badge className="bg-gradient-to-r from-emerald-100 to-sky-100 text-emerald-700 border-emerald-200">
              <Globe className="w-3 h-3 mr-1" />
              Untuk Indonesia
            </Badge>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                    Profil saya
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-white/80 backdrop-blur-sm font-medium"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                    Daftar Gratis
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-sky-100 bg-white/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="#features" 
                  className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Fitur
                </Link>
                <Link 
                  href="#jobs" 
                  className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
                <Link 
                  href="#courses" 
                  className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cara Kerja
                </Link>
                <div className="flex items-center space-x-4 pt-4">
                  {user ? (
                    <>
                      <Link href="/dashboard" className="flex-1">
                        <Button
                          className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/profile" className="flex-1">
                        <Button
                          className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Profil saya
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-sky-200 text-sky-600 hover:bg-sky-50 bg-white/80 backdrop-blur-sm font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Masuk
                        </Button>
                      </Link>
                      <Link href="/auth/register" className="flex-1">
                        <Button 
                          className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Daftar
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/5 via-emerald-600/5 to-sky-600/5"></div>
        <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-sky-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-emerald-400/10 to-sky-400/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Badge className="bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 border-sky-200 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium shadow-sm">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Platform AI Terdepan untuk Karir Indonesia
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight px-4">
            <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              Temukan Karir
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
              Impian Anda
            </span>
            <div className="flex flex-col sm:flex-row items-center justify-center mt-4 sm:mt-6 space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-gray-700 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">dengan</span>
              <div className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl shadow-xl">
                <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl py-3">AI</span>
              </div>
            </div>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 font-medium">
            Platform AI yang menganalisis CV, kepribadian MBTI, dan mencocokkan Anda dengan
            <span className="text-sky-600 font-semibold"> peluang karir terbaik di Indonesia</span> dengan akurasi
            tinggi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 mb-12 sm:mb-16">
            <Link
              href={user ? "/dashboard" : "/auth/register"}
              className="w-full sm:w-auto"
              aria-disabled={loading}
              tabIndex={loading ? -1 : 0}
              style={loading ? { pointerEvents: "none", opacity: 0.6 } : {}}
            >
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
                disabled={loading}
              >
                {loading ? "Memuat..." : "Mulai Perjalanan Karir"}
                <ArrowRight className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </Link>
            <Link href="#jobs" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-sky-200 text-sky-600 hover:bg-sky-50 px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-semibold bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Lihat Jobs Terbaru
              </Button>
            </Link>
          </div>

          {/* Elegant Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 px-4">
            <div className="text-center p-4 sm:p-6 md:p-8 bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-sky-100 hover:shadow-2xl transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                50K+
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">Profesional Sukses</p>
            </div>
            <div className="text-center p-4 sm:p-6 md:p-8 bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-emerald-100 hover:shadow-2xl transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                98%
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">Akurasi AI</p>
            </div>
            <div className="text-center p-4 sm:p-6 md:p-8 bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-sky-100 hover:shadow-2xl transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                25K+
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">Lowongan Kerja</p>
            </div>
            <div className="text-center p-4 sm:p-6 md:p-8 bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-emerald-100 hover:shadow-2xl transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                99%
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">Kepuasan User</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section from Remotive API */}
      <section id="jobs" className="py-12 px-4 bg-white/60 backdrop-blur-sm">
        <JobsSection />
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-12 px-4 bg-white/60 backdrop-blur-sm">
        {/* Komponen baru untuk kursus */}
        <CoursesSection />
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 md:py-28 px-4 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <Badge className="mb-6 sm:mb-8 bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 border-sky-200 px-4 sm:px-6 py-2 sm:py-3 font-medium">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Fitur Unggulan
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent leading-tight pb-2">
              Teknologi AI Terdepan
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4 font-medium leading-relaxed">
              Platform lengkap dengan AI canggih untuk mengoptimalkan pencarian karir Anda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            <Card className="border-sky-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm group overflow-hidden">
              <CardHeader className="p-6 sm:p-8 relative">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-sky-100/50 to-emerald-100/50 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sky-700 text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 relative z-10">
                  Analisis CV Cerdas
                </CardTitle>
                <CardDescription className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed relative z-10">
                  AI membaca dan memahami CV Anda secara mendalam, mengidentifikasi skill tersembunyi dan potensi karir
                  dengan akurasi tinggi
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm group overflow-hidden">
              <CardHeader className="p-6 sm:p-8 relative">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-100/50 to-sky-100/50 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10">
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-emerald-700 text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 relative z-10">
                  Tes Kepribadian MBTI
                </CardTitle>
                <CardDescription className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed relative z-10">
                  Analisis kepribadian mendalam untuk mencocokkan budaya kerja dan tipe pekerjaan yang sesuai dengan
                  karakter Anda
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-sky-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm group overflow-hidden">
              <CardHeader className="p-6 sm:p-8 relative">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-sky-100/50 to-emerald-100/50 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sky-700 text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 relative z-10">
                  Smart Job Matching
                </CardTitle>
                <CardDescription className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed relative z-10">
                  Pencocokan pekerjaan dengan akurasi tinggi berdasarkan skill, personality, lokasi, dan preferensi
                  karir Anda
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm group overflow-hidden">
              <CardHeader className="p-6 sm:p-8 relative">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-100/50 to-sky-100/50 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-emerald-700 text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 relative z-10">
                  Rekomendasi Course
                </CardTitle>
                <CardDescription className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed relative z-10">
                  Saran kursus untuk meningkatkan skill dan tracking progress pembelajaran dengan roadmap yang
                  terstruktur
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-sky-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm group overflow-hidden">
              <CardHeader className="p-6 sm:p-8 relative">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-sky-100/50 to-emerald-100/50 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10">
                  <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-sky-700 text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 relative z-10">
                  Lokasi Fleksibel
                </CardTitle>
                <CardDescription className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed relative z-10">
                  Pencarian pekerjaan berdasarkan lokasi, remote work, atau hybrid dengan filter yang fleksibel
                  sesuai kebutuhan Anda
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm group overflow-hidden">
              <CardHeader className="p-6 sm:p-8 relative">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-100/50 to-sky-100/50 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-emerald-700 text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 relative z-10">
                  Keamanan Data
                </CardTitle>
                <CardDescription className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed relative z-10">
                  Data pribadi dan CV Anda dilindungi dengan enkripsi tingkat tinggi dan tidak akan dibagikan
                  tanpa izin
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <Badge className="mb-8 bg-gradient-to-r from-emerald-50 to-sky-50 text-emerald-700 border-emerald-200 px-6 py-3 font-medium">
              <Zap className="w-5 h-5 mr-2" />
              Proses Mudah
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent leading-tight pb-2">
              4 Langkah Menuju Karir Impian
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4 font-medium leading-relaxed">
              Proses yang telah dipercaya oleh ribuan profesional Indonesia
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {[
              {
                step: "1",
                title: "Daftar & Login",
                description: "Buat akun gratis dan akses dashboard personal dengan fitur AI terdepan",
                icon: Users,
                gradient: "from-sky-500 to-emerald-500",
                bgGradient: "from-sky-50 to-emerald-50",
              },
              {
                step: "2",
                title: "Upload CV & Tes MBTI",
                description: "Upload CV dan ikuti tes kepribadian untuk analisis mendalam dengan akurasi tinggi",
                icon: FileText,
                gradient: "from-emerald-500 to-sky-500",
                bgGradient: "from-emerald-50 to-sky-50",
              },
              {
                step: "3",
                title: "AI Analysis",
                description: "AI menganalisis profil Anda dan mencocokkan dengan ribuan lowongan terbaik",
                icon: Brain,
                gradient: "from-sky-500 to-emerald-500",
                bgGradient: "from-sky-50 to-emerald-50",
              },
              {
                step: "4",
                title: "Get Results",
                description: "Dapatkan rekomendasi karir dengan tingkat kecocokan yang tinggi dan akurat",
                icon: Target,
                gradient: "from-emerald-500 to-sky-500",
                bgGradient: "from-emerald-50 to-sky-50",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div
                    className={`w-24 h-24 bg-gradient-to-r ${item.gradient} rounded-3xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}
                  >
                    {item.step}
                  </div>
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${item.bgGradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-sky-100`}
                  >
                    <item.icon className="w-10 h-10 text-sky-600" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">{item.title}</h3>
                <p className="text-base md:text-lg text-gray-600 px-2 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-r from-sky-500 to-emerald-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <Badge className="mb-8 bg-white/20 text-white border-white/30 px-6 py-3 font-medium backdrop-blur-sm">
              <Award className="w-5 h-5 mr-2" />
              Platform Terpercaya
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Mengapa Memilih CareerMatch?</h2>
            <p className="text-xl md:text-2xl text-sky-100 max-w-3xl mx-auto px-4 font-medium leading-relaxed">
              Platform AI terdepan untuk transformasi karir Indonesia yang lebih baik
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                icon: Shield,
                title: "Keamanan Data Terjamin",
                description: "Data pribadi dilindungi dengan enkripsi tingkat enterprise dan standar keamanan tinggi",
              },
              {
                icon: Zap,
                title: "AI Real-time",
                description: "Teknologi AI terdepan dengan pembaruan algoritma real-time untuk hasil yang optimal",
              },
              {
                icon: Users,
                title: "Komunitas Aktif",
                description: "Bergabung dengan ribuan profesional sukses dan network yang berkualitas di Indonesia",
              },
              {
                icon: Globe,
                title: "Fokus Indonesia",
                description: "Didesain khusus untuk pasar kerja Indonesia dengan pemahaman budaya lokal yang mendalam",
              },
              {
                icon: Star,
                title: "Success Rate Tinggi",
                description: "Tingkat keberhasilan tinggi dalam penempatan karir yang sesuai dengan aspirasi Anda",
              },
              {
                icon: Award,
                title: "Support 24/7",
                description: "Tim dukungan yang responsif dan ahli karir tersedia untuk membantu perjalanan karir Anda",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white/15 border-white/20 text-white backdrop-blur-md hover:bg-white/25 transition-all duration-300 group"
              >
                <CardHeader className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-all duration-300">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl mb-4 font-bold">{item.title}</CardTitle>
                  <CardDescription className="text-sky-100 text-base md:text-lg leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-8 bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 border-sky-200 px-6 py-3 text-lg font-medium">
              <Star className="w-5 h-5 mr-2" />
              Transformasi Karir Dimulai Hari Ini
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-8 leading-tight">
              Siap Menemukan
              <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                Karir Impian
              </span>{" "}
              Anda?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto px-4 font-medium leading-relaxed">
              Bergabunglah dengan ribuan profesional yang telah menemukan karir impian mereka dengan CareerMatch AI
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 px-12 py-5 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl"
                >
                  Daftar Gratis Sekarang
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              <Link href="#jobs">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-sky-200 text-sky-600 hover:bg-sky-50 px-12 py-5 text-xl font-semibold bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Lihat Jobs Terbaru
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-3xl font-bold">CareerMatch</span>
              <div className="text-sm font-medium text-emerald-400">AI-Powered Career Platform</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div>
              <h4 className="font-bold mb-4 text-lg">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white transition-colors">
                    Fitur AI
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Harga
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors">
                    API Developer
                  </Link>
                </li>
                <li>
                  <Link href="/enterprise" className="hover:text-white transition-colors">
                    Enterprise
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Perusahaan</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Tentang CareerMatch
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Karir
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Kontak
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white transition-colors">
                    Press Kit
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Dukungan</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-white transition-colors">
                    Dokumentasi
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-white transition-colors">
                    Status Platform
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white transition-colors">
                    Komunitas
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition-colors">
                    Keamanan Data
                  </Link>
                </li>
                <li>
                  <Link href="/compliance" className="hover:text-white transition-colors">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-gray-400 pt-8 border-t border-gray-800">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Proudly Made in Indonesia</span>
            </div>
            <p className="text-lg">&copy; 2024 CareerMatch. Semua hak dilindungi.</p>
            <p className="mt-2 text-gray-500">Platform AI untuk transformasi karir Indonesia yang lebih baik.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
