"use client"

import type React from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

import { useState, useRef } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Brain, CheckCircle, ArrowRight, ArrowLeft, Briefcase, BookOpen } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import * as pdfjsLib from "pdfjs-dist"
import { useRouter } from "next/navigation"

// Atur workerSrc pdfjs secara global (modern way)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export default function UploadCVPage() {
  const { user }: { user: SupabaseUser | null } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [mbtiFile, setMbtiFile] = useState<File | null>(null)
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    location: "",
    summary: "",
    experience_years: "",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [aiResult, setAiResult] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const cvFileRef = useRef<File | null>(null)
  const mbtiFileRef = useRef<File | null>(null)
  const router = useRouter()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "File tidak didukung",
          description: "Silakan upload file PDF, DOC, atau DOCX",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File terlalu besar",
          description: "Ukuran file maksimal 10MB",
          variant: "destructive",
        })
        return
      }

      setCvFile(file)
    }
  }

  const handlePersonalInfoSubmit = async () => {
    try {
      // Save to localStorage for demo
      const profile = {
        full_name: personalInfo.name,
        phone: personalInfo.phone,
        location: personalInfo.location,
        professional_summary: personalInfo.summary,
        experience_years: Number.parseInt(personalInfo.experience_years) || null,
        profile_completion: 40,
        updated_at: new Date().toISOString(),
      }
      
      localStorage.setItem("userProfile", JSON.stringify(profile))

      setStep(2)
      toast({
        title: "Berhasil",
        description: "Informasi personal tersimpan",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      })
    }
  }

  const handleCVAnalysis = async () => {
    if (!cvFile || !user) return

    setIsAnalyzing(true)

    try {
      // Simulate file upload and analysis for demo
      const mockAnalysis = await simulateAIAnalysis(cvFile.name)

      // Save analysis result to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("cvAnalysis", JSON.stringify(mockAnalysis))

        // Update profile completion
        const profile = JSON.parse(localStorage.getItem("userProfile") || "{}")
        profile.profile_completion = 70
        localStorage.setItem("userProfile", JSON.stringify(profile))
      }

      setAnalysisResult(mockAnalysis)
      setAnalysisComplete(true)
      setStep(3)

      toast({
        title: "Analisis Selesai",
        description: "CV Anda telah berhasil dianalisis",
      })
    } catch (error) {
      console.error("Error analyzing CV:", error)
      toast({
        title: "Error",
        description: "Gagal menganalisis CV",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const simulateAIAnalysis = async (fileName: string) => {
    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock analysis result based on filename or random generation
    return {
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
    }
  }

  const progressValue = (step / 3) * 100

  // Helper: extract text from PDF file
  async function extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    let text = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((item: any) => item.str).join(" ") + "\n"
    }
    return text
  }

  // Handler: after both files uploaded, run AI analysis
  const handleAnalyzeAI = async () => {
    if (!cvFile || !mbtiFile) return
    setAnalyzing(true)
    setAiResult(null)
    try {
      const cvText = await extractTextFromPDF(cvFile)
      const mbtiText = await extractTextFromPDF(mbtiFile)
      const res = await fetch("/api/analyze-cv-mbti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, mbtiText })
      })
      const data = await res.json()
      setAiResult(data.result)
    } catch (err) {
      setAiResult({ error: "Gagal analisis AI" })
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
        {/* Header */}
        <header className="border-b border-sky-100 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                CareerMatch AI
              </span>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Kembali
              </Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-sky-600">Progress</span>
              <span className="text-sm font-medium text-sky-600">{Math.round(progressValue)}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Info Personal</span>
              <span>Upload CV</span>
              <span>Analisis AI</span>
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card className="max-w-2xl mx-auto border-sky-100 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl md:text-2xl bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                  Informasi Personal
                </CardTitle>
                <CardDescription>Masukkan informasi dasar Anda untuk memulai analisis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={personalInfo.name}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      placeholder="john@example.com"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      placeholder="+62 812 3456 7890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Lokasi</Label>
                    <Input
                      id="location"
                      value={personalInfo.location}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                      placeholder="Jakarta, Indonesia"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_years">Pengalaman Kerja (Tahun)</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={personalInfo.experience_years}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, experience_years: e.target.value })}
                    placeholder="3"
                    min="0"
                    max="50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Ringkasan Profesional (Opsional)</Label>
                  <Textarea
                    id="summary"
                    value={personalInfo.summary}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                    placeholder="Ceritakan sedikit tentang pengalaman dan tujuan karir Anda..."
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handlePersonalInfoSubmit}
                  className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
                  disabled={!personalInfo.name || !personalInfo.email}
                >
                  Lanjutkan ke Upload CV
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: CV Upload */}
          {step === 2 && (
            <Card className="max-w-2xl mx-auto border-sky-100 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl md:text-2xl bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                  Upload CV Anda
                </CardTitle>
                <CardDescription>Upload CV dalam format PDF, DOC, atau DOCX untuk analisis AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-sky-200 rounded-lg p-6 md:p-8 text-center hover:border-sky-300 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label htmlFor="cv-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-4">
                      {cvFile ? (
                        <>
                          <FileText className="w-12 h-12 md:w-16 md:h-16 text-emerald-500" />
                          <div>
                            <p className="text-base md:text-lg font-medium text-emerald-600">{cvFile.name}</p>
                            <p className="text-sm text-gray-500">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 md:w-16 md:h-16 text-sky-400" />
                          <div>
                            <p className="text-base md:text-lg font-medium text-gray-700">Klik untuk upload CV</p>
                            <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 10MB)</p>
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {cvFile && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="text-emerald-700 font-medium">CV berhasil diupload!</span>
                    </div>
                    <p className="text-emerald-600 text-sm mt-1">Siap untuk dianalisis oleh AI kami</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Kembali
                  </Button>
                  <Button
                    onClick={handleCVAnalysis}
                    className="flex-1 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
                    disabled={!cvFile}
                  >
                    Mulai Analisis AI
                    <Brain className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: AI Analysis */}
          {step === 3 && (
            <Card className="max-w-2xl mx-auto border-sky-100 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl md:text-2xl bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                  {isAnalyzing ? "Menganalisis CV Anda..." : "Analisis Selesai!"}
                </CardTitle>
                <CardDescription>
                  {isAnalyzing
                    ? "AI sedang membaca dan memahami CV Anda secara mendalam"
                    : "CV Anda telah dianalisis. Lanjutkan ke tes MBTI untuk hasil yang lebih akurat"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isAnalyzing ? (
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Brain className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-base md:text-lg font-medium">Sedang menganalisis...</p>
                      <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>✓ Membaca konten CV</p>
                      <p>✓ Mengidentifikasi skill dan pengalaman</p>
                      <p>✓ Menganalisis skill tersembunyi</p>
                      <p className="text-sky-600">⏳ Menyiapkan rekomendasi...</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>

                    {analysisResult && (
                      <div className="bg-gradient-to-r from-emerald-50 to-sky-50 border border-emerald-200 rounded-lg p-4 md:p-6">
                        <h3 className="font-semibold text-emerald-700 mb-3">Hasil Analisis:</h3>
                        <div className="text-sm space-y-2 text-left">
                          <p>
                            ✓ <strong>Skill Teknis:</strong> {analysisResult.skills.join(", ")}
                          </p>
                          <p>
                            ✓ <strong>Skill Tersembunyi:</strong> {analysisResult.hiddenSkills.join(", ")}
                          </p>
                          <p>
                            ✓ <strong>Industri Cocok:</strong> {analysisResult.industries.join(", ")}
                          </p>
                          <p>
                            ✓ <strong>Level:</strong> {analysisResult.level}
                          </p>
                          <p>
                            ✓ <strong>Pengalaman:</strong> {analysisResult.experience.totalYears} tahun
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <Link href="/mbti-test">
                        <Button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600">
                          Lanjut ke Tes MBTI
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href="/dashboard">
                        <Button
                          variant="outline"
                          className="w-full border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent"
                        >
                          Lihat Dashboard
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Analysis Result */}
          {analyzing && <div className="mt-6 text-center text-blue-600">Analisis AI sedang diproses...</div>}
          {aiResult && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-emerald-700">Hasil Analisis AI</h3>
              {aiResult.error && <div className="text-red-600">{aiResult.error}</div>}
              {aiResult.data && (
                <>
                  <div><strong>TTL:</strong> {aiResult.data.ttl}</div>
                  <div><strong>Pendidikan:</strong> {aiResult.data.pendidikan}</div>
                  <div><strong>Pengalaman:</strong> {aiResult.data.pengalaman}</div>
                  <div><strong>Skills:</strong> {aiResult.data.skills?.join(", ")}</div>
                </>
              )}
              {aiResult.kelengkapan && aiResult.kelengkapan.length > 0 && (
                <div className="mt-2 text-yellow-700"><strong>Data kurang:</strong> {aiResult.kelengkapan.join(", ")}</div>
              )}
              {aiResult.rekomendasi_pekerjaan && (
                <div className="mt-2">
                  <strong>Rekomendasi Pekerjaan:</strong>
                  <ul className="list-disc ml-6">
                    {aiResult.rekomendasi_pekerjaan.map((r: any, i: number) => (
                      <li key={i}>{r.pekerjaan} ({r.persentase}%) - {r.alasan}</li>
                    ))}
                  </ul>
                </div>
              )}
              {aiResult.saran && <div className="mt-2"><strong>Saran:</strong> {aiResult.saran}</div>}
              {aiResult.rekomendasi_skill && aiResult.rekomendasi_skill.length > 0 && (
                <div className="mt-2"><strong>Rekomendasi Skill/Course:</strong> {aiResult.rekomendasi_skill.join(", ")}</div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/job-matching">
                  <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold shadow">
                    <Briefcase className="mr-2 w-4 h-4" />
                    Cari Lowongan Kerja
                  </Button>
                </Link>
                <Link href="/skill-upgrade">
                  <Button className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-semibold shadow">
                    <BookOpen className="mr-2 w-4 h-4" />
                    Upgrade Skill
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
