"use client"

import { useState } from "react"
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

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
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
  }

  const getMBTIDescription = (type: string) => {
    const descriptions: Record<string, { name: string; traits: string[]; careers: string[] }> = {
      INTJ: {
        name: "The Architect",
        traits: ["Strategis", "Inovatif", "Independen", "Visioner"],
        careers: ["Software Architect", "Data Scientist", "Research Analyst", "Strategic Planner"],
      },
      INTP: {
        name: "The Thinker",
        traits: ["Analitis", "Kreatif", "Fleksibel", "Objektif"],
        careers: ["Software Developer", "Research Scientist", "Systems Analyst", "Technical Writer"],
      },
      ENTJ: {
        name: "The Commander",
        traits: ["Leadership", "Strategis", "Efisien", "Ambisius"],
        careers: ["CEO", "Project Manager", "Business Analyst", "Management Consultant"],
      },
      ENTP: {
        name: "The Debater",
        traits: ["Inovatif", "Energik", "Kreatif", "Adaptif"],
        careers: ["Product Manager", "Marketing Manager", "Entrepreneur", "Business Development"],
      },
    }

    return (
      descriptions[type] || {
        name: "Personality Type",
        traits: ["Unik", "Berbakat", "Potensial", "Berkembang"],
        careers: ["Various Career Options", "Leadership Roles", "Creative Positions", "Technical Roles"],
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
        ) : (
          /* Results */
          <Card className="max-w-2xl mx-auto border-sky-100 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                Hasil Tes MBTI Anda
              </CardTitle>
              <CardDescription>Tipe kepribadian Anda telah diidentifikasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">{mbtiResult}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{getMBTIDescription(mbtiResult).name}</h3>
              </div>

              <div className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-lg p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-sky-700 mb-2">Karakteristik Utama:</h4>
                  <div className="flex flex-wrap gap-2">
                    {getMBTIDescription(mbtiResult).traits.map((trait, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white rounded-full text-sm text-sky-600 border border-sky-200"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-700 mb-2">Karir yang Cocok:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {getMBTIDescription(mbtiResult).careers.map((career, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-white rounded-lg text-sm text-emerald-600 border border-emerald-200"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600">
                    Lihat Rekomendasi Pekerjaan
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/job-matching">
                  <Button
                    variant="outline"
                    className="w-full border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent"
                  >
                    Mulai Job Matching
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
