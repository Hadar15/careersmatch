import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JobsSection } from "@/components/jobs-section"
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
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
      {/* Header */}
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                CareerMatch
              </span>
              <div className="text-xs font-medium text-emerald-600">AI-Powered Career Platform</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/auth/login" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Fitur
            </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Jobs
            </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Cara Kerja
            </Link>
            <Badge className="bg-gradient-to-r from-emerald-100 to-sky-100 text-emerald-700 border-emerald-200">
              <Globe className="w-3 h-3 mr-1" />
              Untuk Indonesia
            </Badge>
          </nav>
          <div className="flex items-center space-x-3">
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/5 via-emerald-600/5 to-sky-600/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-sky-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-sky-400/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-8">
            <Badge className="bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 border-sky-200 px-6 py-3 text-sm font-medium shadow-sm">
              <Award className="w-4 h-4 mr-2" />
              Platform AI Terdepan untuk Karir Indonesia
            </Badge>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              Temukan Karir
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
              Impian Anda
            </span>
            <div className="flex items-center justify-center mt-6">
              <span className="text-gray-700 text-3xl md:text-4xl lg:text-5xl mr-4">dengan</span>
              <div className="px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl shadow-xl">
                <span className="text-white font-bold text-3xl md:text-4xl lg:text-5xl">AI</span>
              </div>
            </div>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed px-4 font-medium">
            Platform AI yang menganalisis CV, kepribadian MBTI, dan mencocokkan Anda dengan
            <span className="text-sky-600 font-semibold"> peluang karir terbaik di Indonesia</span> dengan akurasi
            tinggi.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4 mb-16">
            {/* Semua tombol di landing page dihilangkan sesuai permintaan */}
          </div>

          {/* Elegant Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 px-4">
            <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-sky-100 hover:shadow-2xl transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                50K+
              </div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Profesional Sukses</p>
            </div>
            <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100 hover:shadow-2xl transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-3">
                98%
              </div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Akurasi AI</p>
            </div>
            <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-sky-100 hover:shadow-2xl transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                25K+
              </div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Lowongan Kerja</p>
            </div>
            <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100 hover:shadow-2xl transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-3">
                99%
              </div>
              <p className="text-base md:text-lg text-gray-600 font-medium">Kepuasan User</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 px-4 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <Badge className="mb-8 bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 border-sky-200 px-6 py-3 font-medium">
              <Star className="w-5 h-5 mr-2" />
              Fitur Unggulan
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              Teknologi AI Terdepan
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4 font-medium leading-relaxed">
              Platform lengkap dengan AI canggih untuk mengoptimalkan pencarian karir Anda
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <Card className="border-sky-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm group overflow-hidden">
              <CardHeader className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100/50 to-emerald-100/50 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-sky-700 text-xl md:text-2xl font-bold mb-4 relative z-10">
                  Analisis CV Cerdas
                </CardTitle>
                <CardDescription className="text-base md:text-lg text-gray-600 leading-relaxed relative z-10">
                  AI membaca dan memahami CV Anda secara mendalam, mengidentifikasi skill tersembunyi dan potensi karir
                  dengan akurasi tinggi
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm group overflow-hidden">
              <CardHeader className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-sky-100/50 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-emerald-700 text-xl md:text-2xl font-bold mb-4 relative z-10">
                  Tes Kepribadian MBTI
                </CardTitle>
                <CardDescription className="text-base md:text-lg text-gray-600 leading-relaxed relative z-10">
                  Analisis kepribadian mendalam untuk mencocokkan budaya kerja dan tipe pekerjaan yang sesuai dengan
                  karakter Anda
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-sky-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm group overflow-hidden">
              <CardHeader className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100/50 to-emerald-100/50 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-sky-700 text-xl md:text-2xl font-bold mb-4 relative z-10">
                  Smart Job Matching
                </CardTitle>
                <CardDescription className="text-base md:text-lg text-gray-600 leading-relaxed relative z-10">
                  Pencocokan pekerjaan dengan akurasi tinggi berdasarkan skill, personality, lokasi, dan preferensi
                  karir Anda
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm group overflow-hidden">
              <CardHeader className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-sky-100/50 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-emerald-700 text-xl md:text-2xl font-bold mb-4 relative z-10">
                  Rekomendasi Course
                </CardTitle>
                <CardDescription className="text-base md:text-lg text-gray-600 leading-relaxed relative z-10">
                  Saran kursus untuk meningkatkan skill dan tracking progress pembelajaran dengan roadmap yang
                  terstruktur
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-sky-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm group overflow-hidden">
              <CardHeader className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100/50 to-emerald-100/50 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-sky-700 text-xl md:text-2xl font-bold mb-4 relative z-10">
                  Filter Lokasi Indonesia
                </CardTitle>
                <CardDescription className="text-base md:text-lg text-gray-600 leading-relaxed relative z-10">
                  Temukan pekerjaan berdasarkan lokasi preferensi di seluruh Indonesia dengan data yang akurat dan
                  terkini
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm group overflow-hidden">
              <CardHeader className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-sky-100/50 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 relative z-10">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-emerald-700 text-xl md:text-2xl font-bold mb-4 relative z-10">
                  Info Gaji & Kontak
                </CardTitle>
                <CardDescription className="text-base md:text-lg text-gray-600 leading-relaxed relative z-10">
                  Dapatkan estimasi gaji yang akurat dan informasi kontak langsung untuk melamar pekerjaan impian Anda
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
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
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
