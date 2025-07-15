"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

const mbtiQuestions = [
  // E/I
  { id: 1, question: "Saya lebih suka...", options: [{ value: "E", text: "Berada di tengah keramaian" }, { value: "I", text: "Berada di tempat tenang" }] },
  { id: 2, question: "Saya lebih nyaman...", options: [{ value: "E", text: "Bersosialisasi dengan banyak orang" }, { value: "I", text: "Bersama beberapa teman dekat" }] },
  { id: 3, question: "Saya lebih sering...", options: [{ value: "E", text: "Berbicara daripada mendengarkan" }, { value: "I", text: "Mendengarkan daripada berbicara" }] },
  { id: 4, question: "Saya merasa energik setelah...", options: [{ value: "E", text: "Bertemu banyak orang" }, { value: "I", text: "Menghabiskan waktu sendiri" }] },
  { id: 5, question: "Saya lebih suka...", options: [{ value: "E", text: "Kegiatan kelompok" }, { value: "I", text: "Kegiatan individu" }] },
  { id: 6, question: "Saya lebih mudah...", options: [{ value: "E", text: "Beradaptasi di lingkungan baru" }, { value: "I", text: "Membutuhkan waktu untuk menyesuaikan diri" }] },
  { id: 7, question: "Saya lebih suka...", options: [{ value: "E", text: "Bicara langsung" }, { value: "I", text: "Menulis atau berpikir dulu" }] },
  { id: 8, question: "Saya lebih sering...", options: [{ value: "E", text: "Mengambil inisiatif" }, { value: "I", text: "Menunggu kesempatan" }] },
  { id: 9, question: "Saya lebih suka...", options: [{ value: "E", text: "Bertemu orang baru" }, { value: "I", text: "Bersama orang yang sudah dikenal" }] },
  { id: 10, question: "Saya lebih nyaman...", options: [{ value: "E", text: "Berbicara di depan umum" }, { value: "I", text: "Berbicara dalam kelompok kecil" }] },
  { id: 11, question: "Saya lebih suka...", options: [{ value: "E", text: "Aktivitas spontan" }, { value: "I", text: "Aktivitas terencana" }] },
  { id: 12, question: "Saya lebih sering...", options: [{ value: "E", text: "Berbagi ide" }, { value: "I", text: "Menyimpan ide sendiri" }] },
  { id: 13, question: "Saya lebih suka...", options: [{ value: "E", text: "Diskusi kelompok" }, { value: "I", text: "Refleksi pribadi" }] },
  { id: 14, question: "Saya lebih suka...", options: [{ value: "E", text: "Lingkungan ramai" }, { value: "I", text: "Lingkungan tenang" }] },
  { id: 15, question: "Saya lebih suka...", options: [{ value: "E", text: "Banyak aktivitas" }, { value: "I", text: "Sedikit aktivitas" }] },
  // S/N
  { id: 16, question: "Saya lebih percaya pada...", options: [{ value: "S", text: "Fakta dan pengalaman nyata" }, { value: "N", text: "Intuisi dan kemungkinan" }] },
  { id: 17, question: "Saya lebih suka...", options: [{ value: "S", text: "Detail" }, { value: "N", text: "Gambaran besar" }] },
  { id: 18, question: "Saya lebih suka...", options: [{ value: "S", text: "Langkah demi langkah" }, { value: "N", text: "Lompatan ide" }] },
  { id: 19, question: "Saya lebih suka...", options: [{ value: "S", text: "Hal konkret" }, { value: "N", text: "Hal abstrak" }] },
  { id: 20, question: "Saya lebih suka...", options: [{ value: "S", text: "Pengalaman nyata" }, { value: "N", text: "Imajinasi" }] },
  { id: 21, question: "Saya lebih suka...", options: [{ value: "S", text: "Praktis" }, { value: "N", text: "Teoritis" }] },
  { id: 22, question: "Saya lebih suka...", options: [{ value: "S", text: "Mengikuti instruksi" }, { value: "N", text: "Mencari cara sendiri" }] },
  { id: 23, question: "Saya lebih suka...", options: [{ value: "S", text: "Hal yang sudah terbukti" }, { value: "N", text: "Hal baru dan berbeda" }] },
  { id: 24, question: "Saya lebih suka...", options: [{ value: "S", text: "Realita" }, { value: "N", text: "Kemungkinan" }] },
  { id: 25, question: "Saya lebih suka...", options: [{ value: "S", text: "Hal yang nyata" }, { value: "N", text: "Hal yang dibayangkan" }] },
  { id: 26, question: "Saya lebih suka...", options: [{ value: "S", text: "Mengamati" }, { value: "N", text: "Membayangkan" }] },
  { id: 27, question: "Saya lebih suka...", options: [{ value: "S", text: "Mengikuti pola" }, { value: "N", text: "Menciptakan pola baru" }] },
  { id: 28, question: "Saya lebih suka...", options: [{ value: "S", text: "Hal yang sudah ada" }, { value: "N", text: "Hal yang mungkin terjadi" }] },
  { id: 29, question: "Saya lebih suka...", options: [{ value: "S", text: "Fakta" }, { value: "N", text: "Ide" }] },
  { id: 30, question: "Saya lebih suka...", options: [{ value: "S", text: "Hal yang jelas" }, { value: "N", text: "Hal yang ambigu" }] },
  // T/F
  { id: 31, question: "Saya lebih suka...", options: [{ value: "T", text: "Keputusan logis" }, { value: "F", text: "Keputusan berdasarkan perasaan" }] },
  { id: 32, question: "Saya lebih suka...", options: [{ value: "T", text: "Keadilan" }, { value: "F", text: "Kebaikan hati" }] },
  { id: 33, question: "Saya lebih suka...", options: [{ value: "T", text: "Objektivitas" }, { value: "F", text: "Empati" }] },
  { id: 34, question: "Saya lebih suka...", options: [{ value: "T", text: "Analisis" }, { value: "F", text: "Perasaan" }] },
  { id: 35, question: "Saya lebih suka...", options: [{ value: "T", text: "Kritik membangun" }, { value: "F", text: "Dukungan emosional" }] },
  { id: 36, question: "Saya lebih suka...", options: [{ value: "T", text: "Menyelesaikan masalah" }, { value: "F", text: "Membantu orang lain" }] },
  { id: 37, question: "Saya lebih suka...", options: [{ value: "T", text: "Konsistensi" }, { value: "F", text: "Kompromi" }] },
  { id: 38, question: "Saya lebih suka...", options: [{ value: "T", text: "Menyampaikan kebenaran" }, { value: "F", text: "Menjaga perasaan orang lain" }] },
  { id: 39, question: "Saya lebih suka...", options: [{ value: "T", text: "Membuat keputusan sendiri" }, { value: "F", text: "Berdiskusi dengan orang lain" }] },
  { id: 40, question: "Saya lebih suka...", options: [{ value: "T", text: "Aturan" }, { value: "F", text: "Kebutuhan individu" }] },
  { id: 41, question: "Saya lebih suka...", options: [{ value: "T", text: "Kebenaran" }, { value: "F", text: "Kedamaian" }] },
  { id: 42, question: "Saya lebih suka...", options: [{ value: "T", text: "Debat" }, { value: "F", text: "Kompromi" }] },
  { id: 43, question: "Saya lebih suka...", options: [{ value: "T", text: "Logika" }, { value: "F", text: "Perasaan" }] },
  { id: 44, question: "Saya lebih suka...", options: [{ value: "T", text: "Kritik" }, { value: "F", text: "Pujian" }] },
  { id: 45, question: "Saya lebih suka...", options: [{ value: "T", text: "Menyelesaikan tugas" }, { value: "F", text: "Membantu teman" }] },
  // J/P
  { id: 46, question: "Saya lebih suka...", options: [{ value: "J", text: "Rencana terstruktur" }, { value: "P", text: "Fleksibilitas" }] },
  { id: 47, question: "Saya lebih suka...", options: [{ value: "J", text: "Jadwal tetap" }, { value: "P", text: "Jadwal fleksibel" }] },
  { id: 48, question: "Saya lebih suka...", options: [{ value: "J", text: "Keputusan cepat" }, { value: "P", text: "Keputusan lambat" }] },
  { id: 49, question: "Saya lebih suka...", options: [{ value: "J", text: "Tugas selesai lebih awal" }, { value: "P", text: "Tugas selesai mendekati deadline" }] },
  { id: 50, question: "Saya lebih suka...", options: [{ value: "J", text: "Kepastian" }, { value: "P", text: "Kemungkinan" }] },
  { id: 51, question: "Saya lebih suka...", options: [{ value: "J", text: "Perencanaan" }, { value: "P", text: "Improvisasi" }] },
  { id: 52, question: "Saya lebih suka...", options: [{ value: "J", text: "Mengikuti aturan" }, { value: "P", text: "Menciptakan aturan sendiri" }] },
  { id: 53, question: "Saya lebih suka...", options: [{ value: "J", text: "Tugas terorganisir" }, { value: "P", text: "Tugas spontan" }] },
  { id: 54, question: "Saya lebih suka...", options: [{ value: "J", text: "Rencana matang" }, { value: "P", text: "Rencana fleksibel" }] },
  { id: 55, question: "Saya lebih suka...", options: [{ value: "J", text: "Tujuan jelas" }, { value: "P", text: "Tujuan berubah-ubah" }] },
  { id: 56, question: "Saya lebih suka...", options: [{ value: "J", text: "Tugas selesai satu per satu" }, { value: "P", text: "Tugas paralel" }] },
  { id: 57, question: "Saya lebih suka...", options: [{ value: "J", text: "Mengikuti rencana" }, { value: "P", text: "Mengikuti alur" }] },
  { id: 58, question: "Saya lebih suka...", options: [{ value: "J", text: "Keputusan pasti" }, { value: "P", text: "Keputusan terbuka" }] },
  { id: 59, question: "Saya lebih suka...", options: [{ value: "J", text: "Lingkungan teratur" }, { value: "P", text: "Lingkungan dinamis" }] },
  { id: 60, question: "Saya lebih suka...", options: [{ value: "J", text: "Rencana jangka panjang" }, { value: "P", text: "Rencana spontan" }] },
]

export default function MBTITestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [mbtiResult, setMbtiResult] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const savedAnswers = localStorage.getItem("mbti_answers")
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
      // Jika sudah lengkap, redirect ke hasil
      if (Object.keys(JSON.parse(savedAnswers)).length === mbtiQuestions.length) {
        window.location.href = "/mbti-test/result"
      }
    }
  }, [])

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: value }
      localStorage.setItem("mbti_answers", JSON.stringify(updated))
      return updated
    })
  }

  const nextQuestion = () => {
    if (currentQuestion < mbtiQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      calculateMBTI()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const calculateMBTI = async () => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    Object.values(answers).forEach((answer) => {
      scores[answer as keyof typeof scores]++
    })
    const result =
      (scores.E > scores.I ? "E" : "I") +
      (scores.S > scores.N ? "S" : "N") +
      (scores.T > scores.F ? "T" : "F") +
      (scores.J > scores.P ? "J" : "P")
    setMbtiResult(result)
    setIsComplete(true)
    // Simpan ke localStorage
    localStorage.setItem("mbti_result", result)
    // Update ke Supabase
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ mbti_type: result })
        .eq("id", user.id)
      if (!error) {
        toast({ title: "Hasil MBTI disimpan ke profil!" })
      } else {
        toast({ title: "Gagal update MBTI ke profil", description: error.message, variant: "destructive" })
      }
    }
    // Redirect ke halaman hasil
    window.location.href = "/mbti-test/result"
  }

  const getMBTIDescription = (type: string) => {
    const descriptions: Record<string, {
      name: string;
      description: string;
      traits: string[];
      careers: string[];
    }> = {
      ISTJ: {
        name: "The Inspector",
        description:
          "ISTJ adalah pribadi yang bertanggung jawab, teliti, dan sangat menghargai tradisi. Mereka suka keteraturan, dapat diandalkan, dan selalu berusaha menyelesaikan tugas dengan baik. ISTJ cenderung logis, realistis, dan lebih suka bekerja di balik layar daripada menjadi pusat perhatian.",
        traits: ["Teliti", "Bertanggung jawab", "Konsisten", "Realistis"],
        careers: ["Akuntan", "Auditor", "Administrator", "Insinyur"],
      },
      ISFJ: {
        name: "The Protector",
        description:
          "ISFJ dikenal sebagai sosok yang peduli, setia, dan suka membantu orang lain. Mereka sangat memperhatikan kebutuhan orang di sekitarnya, suka menjaga harmoni, dan rela berkorban demi orang yang mereka sayangi. ISFJ juga sangat teliti dan suka bekerja dengan detail.",
        traits: ["Peduli", "Setia", "Teliti", "Ramah"],
        careers: ["Perawat", "Guru", "Administrasi", "Pekerja Sosial"],
      },
      INFJ: {
        name: "The Advocate",
        description:
          "INFJ adalah tipe yang idealis, penuh empati, dan memiliki visi jangka panjang. Mereka suka membantu orang lain menemukan potensi terbaiknya, sangat intuitif, dan seringkali punya nilai hidup yang kuat. INFJ cenderung pendiam namun sangat peduli pada sesama.",
        traits: ["Empati", "Visioner", "Pendengar baik", "Inspiratif"],
        careers: ["Psikolog", "Konselor", "Penulis", "Guru"],
      },
      INTJ: {
        name: "The Architect",
        description:
          "INTJ adalah pemikir strategis yang mandiri, logis, dan visioner. Mereka suka merancang rencana jangka panjang, sangat analitis, dan selalu mencari cara paling efisien untuk mencapai tujuan. INTJ cenderung perfeksionis dan suka tantangan intelektual.",
        traits: ["Strategis", "Mandiri", "Analitis", "Visioner"],
        careers: ["Ilmuwan Data", "Software Architect", "Peneliti", "Perencana Strategis"],
      },
      ISTP: {
        name: "The Virtuoso",
        description:
          "ISTP adalah problem solver yang praktis, suka tantangan, dan sangat fleksibel. Mereka senang memahami cara kerja sesuatu, suka bereksperimen, dan mampu bertindak cepat dalam situasi darurat. ISTP cenderung tenang, logis, dan suka kebebasan.",
        traits: ["Praktis", "Fleksibel", "Logis", "Mandiri"],
        careers: ["Teknisi", "Insinyur", "Pilot", "Ahli Otomotif"],
      },
      ISFP: {
        name: "The Composer",
        description:
          "ISFP adalah pribadi yang artistik, sensitif, dan suka kedamaian. Mereka menghargai keindahan, suka mengekspresikan diri melalui karya seni, dan cenderung menghindari konflik. ISFP lebih suka bekerja di balik layar dan menikmati momen-momen kecil dalam hidup.",
        traits: ["Artistik", "Sensitif", "Ramah", "Damai"],
        careers: ["Desainer", "Seniman", "Fotografer", "Perawat"],
      },
      INFP: {
        name: "The Mediator",
        description:
          "INFP adalah tipe yang idealis, penuh imajinasi, dan sangat peduli pada nilai-nilai pribadi. Mereka suka membantu orang lain, kreatif, dan seringkali menjadi inspirasi bagi sekitarnya. INFP cenderung pendiam, namun sangat setia pada prinsip hidupnya.",
        traits: ["Idealis", "Kreatif", "Empati", "Setia"],
        careers: ["Penulis", "Psikolog", "Seniman", "Guru"],
      },
      INTP: {
        name: "The Thinker",
        description:
          "INTP adalah pemikir logis, analitis, dan sangat suka mengeksplorasi ide-ide baru. Mereka senang memecahkan masalah kompleks, suka diskusi intelektual, dan cenderung independen. INTP seringkali kreatif dan inovatif dalam menemukan solusi.",
        traits: ["Logis", "Analitis", "Kreatif", "Mandiri"],
        careers: ["Programmer", "Peneliti", "Analis Sistem", "Penulis Teknis"],
      },
      ESTP: {
        name: "The Dynamo",
        description:
          "ESTP adalah pribadi yang energik, spontan, dan suka tantangan. Mereka suka bertindak cepat, senang berinteraksi dengan banyak orang, dan sangat adaptif. ESTP cenderung berani mengambil risiko dan suka pengalaman baru.",
        traits: ["Energik", "Spontan", "Adaptif", "Berani"],
        careers: ["Sales", "Entrepreneur", "Atlet", "Polisi"],
      },
      ESFP: {
        name: "The Entertainer",
        description:
          "ESFP adalah sosok yang ramah, suka bersenang-senang, dan sangat menikmati hidup. Mereka suka menjadi pusat perhatian, mudah bergaul, dan selalu membawa energi positif ke sekitarnya. ESFP juga sangat peduli pada orang lain dan suka membantu.",
        traits: ["Ramah", "Optimis", "Sosial", "Peduli"],
        careers: ["Aktor", "MC", "Guru TK", "Pekerja Sosial"],
      },
      ENFP: {
        name: "The Campaigner",
        description:
          "ENFP adalah pribadi yang antusias, kreatif, dan sangat imajinatif. Mereka suka mengeksplorasi ide-ide baru, mudah beradaptasi, dan sangat peduli pada orang lain. ENFP cenderung spontan, suka tantangan, dan selalu mencari makna dalam hidup.",
        traits: ["Antusias", "Kreatif", "Empati", "Fleksibel"],
        careers: ["Jurnalis", "Konselor", "Public Relations", "Penulis"],
      },
      ENTP: {
        name: "The Debater",
        description:
          "ENTP adalah pemikir inovatif, suka berdebat, dan sangat suka tantangan intelektual. Mereka cepat belajar, suka diskusi, dan selalu mencari cara baru untuk memecahkan masalah. ENTP cenderung fleksibel dan suka perubahan.",
        traits: ["Inovatif", "Kritis", "Fleksibel", "Percaya Diri"],
        careers: ["Pengacara", "Entrepreneur", "Konsultan Bisnis", "Marketing"],
      },
      ESTJ: {
        name: "The Supervisor",
        description:
          "ESTJ adalah pribadi yang tegas, terorganisir, dan suka keteraturan. Mereka suka memimpin, sangat logis, dan selalu berusaha mencapai target. ESTJ cenderung praktis, suka aturan, dan dapat diandalkan dalam situasi apapun.",
        traits: ["Tegas", "Terorganisir", "Praktis", "Logis"],
        careers: ["Manajer", "Administrator", "Polisi", "Tentara"],
      },
      ESFJ: {
        name: "The Consul",
        description:
          "ESFJ adalah sosok yang hangat, suka membantu, dan sangat peduli pada orang lain. Mereka suka menjaga harmoni, mudah bergaul, dan sangat bertanggung jawab. ESFJ cenderung suka bekerja sama dan selalu berusaha membuat lingkungan nyaman.",
        traits: ["Hangat", "Peduli", "Bertanggung Jawab", "Sosial"],
        careers: ["Guru", "Perawat", "Event Organizer", "HRD"],
      },
      ENFJ: {
        name: "The Protagonist",
        description:
          "ENFJ adalah pemimpin yang inspiratif, penuh empati, dan sangat peduli pada perkembangan orang lain. Mereka suka memotivasi, mudah memahami perasaan orang lain, dan sangat komunikatif. ENFJ cenderung suka bekerja dalam tim dan menjadi penggerak perubahan.",
        traits: ["Inspiratif", "Empati", "Komunikatif", "Motivator"],
        careers: ["Guru", "Psikolog", "Public Speaker", "Manajer SDM"],
      },
      ENTJ: {
        name: "The Commander",
        description:
          "ENTJ adalah pemimpin alami yang tegas, visioner, dan sangat logis. Mereka suka merancang strategi, cepat mengambil keputusan, dan selalu fokus pada tujuan. ENTJ cenderung percaya diri, suka tantangan, dan sangat kompetitif.",
        traits: ["Tegas", "Visioner", "Logis", "Kompetitif"],
        careers: ["CEO", "Manajer Proyek", "Konsultan Bisnis", "Pengacara"],
      },
    }
    return (
      descriptions[type] || {
        name: "Tipe Kepribadian",
        description: "Deskripsi belum tersedia.",
        traits: ["Unik", "Berbakat", "Potensial", "Berkembang"],
        careers: ["Beragam Karir", "Peran Kepemimpinan", "Posisi Kreatif", "Teknis"],
      }
    )
  }

  const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
      {/* Header */}
      <header className="border-b border-sky-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              CareerMatch AI
            </span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {!isComplete ? (
          <>
            {/* Progress */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-sky-600">
                  Pertanyaan {currentQuestion + 1} dari {mbtiQuestions.length}
                </span>
                <span className="text-sm font-medium text-sky-600">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question Card */}
            <Card className="max-w-2xl mx-auto border-sky-100 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                  Tes Kepribadian MBTI
                </CardTitle>
                <CardDescription>Pilih jawaban yang paling menggambarkan diri Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    {mbtiQuestions[currentQuestion].question}
                  </h3>

                  <RadioGroup
                    value={answers[mbtiQuestions[currentQuestion].id] || ""}
                    onValueChange={(value) => handleAnswer(mbtiQuestions[currentQuestion].id, value)}
                    className="space-y-3"
                  >
                    {mbtiQuestions[currentQuestion].options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-4 rounded-lg border border-sky-200 hover:bg-white/50 transition-colors"
                      >
                        <RadioGroupItem value={option.value} id={`option-${index}`} className="mt-1" />
                        <Label
                          htmlFor={`option-${index}`}
                          className="text-gray-700 leading-relaxed cursor-pointer flex-1"
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Sebelumnya
                  </Button>

                  <Button
                    onClick={nextQuestion}
                    disabled={!answers[mbtiQuestions[currentQuestion].id]}
                    className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
                  >
                    {currentQuestion === mbtiQuestions.length - 1 ? "Selesai" : "Selanjutnya"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  )
}
