"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

const mbtiQuestions = [
  {
    id: 1,
    question: "Dalam situasi sosial, Anda lebih suka:",
    options: [
      { value: "E", text: "Berinteraksi dengan banyak orang dan menjadi pusat perhatian" },
      { value: "I", text: "Berbicara dengan beberapa orang yang sudah Anda kenal baik" },
    ],
  },
  {
    id: 2,
    question: "Ketika membuat keputusan, Anda lebih mengandalkan:",
    options: [
      { value: "S", text: "Fakta konkret dan pengalaman praktis" },
      { value: "N", text: "Intuisi dan kemungkinan masa depan" },
    ],
  },
  {
    id: 3,
    question: "Dalam menyelesaikan masalah, Anda lebih suka:",
    options: [
      { value: "T", text: "Menganalisis secara logis dan objektif" },
      { value: "F", text: "Mempertimbangkan dampak pada orang lain dan nilai-nilai" },
    ],
  },
  {
    id: 4,
    question: "Dalam mengatur hidup, Anda lebih suka:",
    options: [
      { value: "J", text: "Membuat rencana dan mengikuti jadwal yang terstruktur" },
      { value: "P", text: "Tetap fleksibel dan terbuka terhadap perubahan" },
    ],
  },
  {
    id: 5,
    question: "Ketika bekerja dalam tim, Anda lebih suka:",
    options: [
      { value: "E", text: "Brainstorming dengan diskusi terbuka dan energik" },
      { value: "I", text: "Merefleksikan ide secara mendalam sebelum berbagi" },
    ],
  },
  {
    id: 6,
    question: "Dalam mempelajari hal baru, Anda lebih suka:",
    options: [
      { value: "S", text: "Mempelajari detail dan langkah-langkah praktis" },
      { value: "N", text: "Memahami konsep besar dan pola keseluruhan" },
    ],
  },
  {
    id: 7,
    question: "Ketika memberikan feedback, Anda lebih fokus pada:",
    options: [
      { value: "T", text: "Analisis objektif tentang apa yang bisa diperbaiki" },
      { value: "F", text: "Cara menyampaikan yang tidak menyakiti perasaan" },
    ],
  },
  {
    id: 8,
    question: "Dalam mengelola proyek, Anda lebih suka:",
    options: [
      { value: "J", text: "Membuat timeline yang jelas dan mengikuti deadline" },
      { value: "P", text: "Menyesuaikan pendekatan berdasarkan situasi yang berkembang" },
    ],
  },
]

export default function MBTITestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [mbtiResult, setMbtiResult] = useState("")

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

  const calculateMBTI = () => {
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
