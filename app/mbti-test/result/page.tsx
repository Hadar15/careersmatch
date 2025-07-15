"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Brain } from "lucide-react"
import Link from "next/link"

// --- Deskripsi lengkap MBTI (kelebihan, kekurangan, dsb) ---
const getMBTIDescription = (type: string) => {
  const descriptions: Record<string, {
    name: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    traits: string[];
    tips: string[];
  }> = {
    ISTJ: {
      name: "The Inspector",
      description:
        "ISTJ adalah pribadi yang bertanggung jawab, teliti, dan sangat menghargai tradisi. Mereka suka keteraturan, dapat diandalkan, dan selalu berusaha menyelesaikan tugas dengan baik. ISTJ cenderung logis, realistis, dan lebih suka bekerja di balik layar daripada menjadi pusat perhatian.",
      strengths: ["Teliti dan terorganisir", "Bertanggung jawab", "Konsisten dan dapat diandalkan", "Berpikir logis dan objektif"],
      weaknesses: ["Kurang fleksibel terhadap perubahan", "Cenderung kaku pada aturan", "Kurang ekspresif secara emosional"],
      traits: ["Teliti", "Bertanggung jawab", "Konsisten", "Realistis"],
      tips: ["Cobalah lebih terbuka pada ide baru", "Latih fleksibilitas dalam menghadapi perubahan", "Berikan waktu untuk mengekspresikan perasaan"],
    },
    ISFJ: {
      name: "The Protector",
      description:
        "ISFJ dikenal sebagai sosok yang peduli, setia, dan suka membantu orang lain. Mereka sangat memperhatikan kebutuhan orang di sekitarnya, suka menjaga harmoni, dan rela berkorban demi orang yang mereka sayangi. ISFJ juga sangat teliti dan suka bekerja dengan detail.",
      strengths: ["Peduli dan perhatian pada orang lain", "Setia dan bertanggung jawab", "Teliti dan terorganisir"],
      weaknesses: ["Sulit berkata tidak", "Cenderung mengabaikan kebutuhan diri sendiri", "Kurang nyaman dengan konflik"],
      traits: ["Peduli", "Setia", "Teliti", "Ramah"],
      tips: ["Belajar menetapkan batasan", "Jangan ragu meminta bantuan", "Berani mengungkapkan pendapat"],
    },
    INFJ: {
      name: "The Advocate",
      description:
        "INFJ adalah tipe yang idealis, penuh empati, dan memiliki visi jangka panjang. Mereka suka membantu orang lain menemukan potensi terbaiknya, sangat intuitif, dan seringkali punya nilai hidup yang kuat. INFJ cenderung pendiam namun sangat peduli pada sesama.",
      strengths: ["Empati tinggi", "Visioner dan inspiratif", "Pendengar yang baik", "Setia pada nilai"],
      weaknesses: ["Terlalu perfeksionis", "Mudah lelah secara emosional", "Sulit mempercayai orang baru"],
      traits: ["Empati", "Visioner", "Pendengar baik", "Inspiratif"],
      tips: ["Jaga keseimbangan antara membantu orang lain dan diri sendiri", "Latih keterbukaan pada pengalaman baru", "Kelola ekspektasi diri"],
    },
    INTJ: {
      name: "The Architect",
      description:
        "INTJ adalah pemikir strategis yang mandiri, logis, dan visioner. Mereka suka merancang rencana jangka panjang, sangat analitis, dan selalu mencari cara paling efisien untuk mencapai tujuan. INTJ cenderung perfeksionis dan suka tantangan intelektual.",
      strengths: ["Strategis dan visioner", "Mandiri dan percaya diri", "Analitis dan logis"],
      weaknesses: ["Kurang peka terhadap perasaan orang lain", "Cenderung keras kepala", "Terlalu kritis pada diri sendiri dan orang lain"],
      traits: ["Strategis", "Mandiri", "Analitis", "Visioner"],
      tips: ["Latih empati dan komunikasi", "Terbuka pada masukan orang lain", "Jangan terlalu keras pada diri sendiri"],
    },
    ISTP: {
      name: "The Virtuoso",
      description:
        "ISTP adalah problem solver yang praktis, suka tantangan, dan sangat fleksibel. Mereka senang memahami cara kerja sesuatu, suka bereksperimen, dan mampu bertindak cepat dalam situasi darurat. ISTP cenderung tenang, logis, dan suka kebebasan.",
      strengths: ["Praktis dan logis", "Fleksibel dan adaptif", "Tenang dalam tekanan", "Cepat belajar keterampilan baru"],
      weaknesses: ["Kurang suka rutinitas", "Kurang ekspresif secara emosional", "Cenderung impulsif"],
      traits: ["Praktis", "Fleksibel", "Logis", "Mandiri"],
      tips: ["Latih komunikasi emosi", "Cobalah lebih konsisten dalam rutinitas", "Pertimbangkan risiko sebelum bertindak"],
    },
    ISFP: {
      name: "The Composer",
      description:
        "ISFP adalah pribadi yang artistik, sensitif, dan suka kedamaian. Mereka menghargai keindahan, suka mengekspresikan diri melalui karya seni, dan cenderung menghindari konflik. ISFP lebih suka bekerja di balik layar dan menikmati momen-momen kecil dalam hidup.",
      strengths: ["Artistik dan kreatif", "Sensitif dan empati", "Ramah dan damai", "Fleksibel"],
      weaknesses: ["Sulit mengambil keputusan besar", "Cenderung menghindari konflik", "Kurang tegas"],
      traits: ["Artistik", "Sensitif", "Ramah", "Damai"],
      tips: ["Berani keluar dari zona nyaman", "Latih ketegasan", "Jangan ragu mengekspresikan pendapat"],
    },
    INFP: {
      name: "The Mediator",
      description:
        "INFP adalah tipe yang idealis, penuh imajinasi, dan sangat peduli pada nilai-nilai pribadi. Mereka suka membantu orang lain, kreatif, dan seringkali menjadi inspirasi bagi sekitarnya. INFP cenderung pendiam, namun sangat setia pada prinsip hidupnya.",
      strengths: ["Idealis dan setia pada nilai", "Kreatif dan imajinatif", "Empati tinggi", "Inspiratif"],
      weaknesses: ["Terlalu sensitif", "Sulit menerima kritik", "Cenderung menunda keputusan"],
      traits: ["Idealis", "Kreatif", "Empati", "Setia"],
      tips: ["Latih penerimaan terhadap kritik", "Kelola ekspektasi diri", "Berani mengambil keputusan"],
    },
    INTP: {
      name: "The Thinker",
      description:
        "INTP adalah pemikir logis, analitis, dan sangat suka mengeksplorasi ide-ide baru. Mereka senang memecahkan masalah kompleks, suka diskusi intelektual, dan cenderung independen. INTP seringkali kreatif dan inovatif dalam menemukan solusi.",
      strengths: ["Logis dan analitis", "Kreatif dan inovatif", "Mandiri", "Cepat belajar"],
      weaknesses: ["Kurang peka terhadap perasaan orang lain", "Cenderung menunda pekerjaan", "Kurang suka rutinitas"],
      traits: ["Logis", "Analitis", "Kreatif", "Mandiri"],
      tips: ["Latih komunikasi interpersonal", "Kelola waktu dengan baik", "Jangan ragu meminta bantuan"],
    },
    ESTP: {
      name: "The Dynamo",
      description:
        "ESTP adalah pribadi yang energik, spontan, dan suka tantangan. Mereka suka bertindak cepat, senang berinteraksi dengan banyak orang, dan sangat adaptif. ESTP cenderung berani mengambil risiko dan suka pengalaman baru.",
      strengths: ["Energik dan spontan", "Adaptif dan fleksibel", "Berani mengambil risiko", "Komunikatif"],
      weaknesses: ["Kurang suka perencanaan jangka panjang", "Cenderung impulsif", "Kurang sabar"],
      traits: ["Energik", "Spontan", "Adaptif", "Berani"],
      tips: ["Latih perencanaan", "Kelola impulsivitas", "Pertimbangkan konsekuensi sebelum bertindak"],
    },
    ESFP: {
      name: "The Entertainer",
      description:
        "ESFP adalah sosok yang ramah, suka bersenang-senang, dan sangat menikmati hidup. Mereka suka menjadi pusat perhatian, mudah bergaul, dan selalu membawa energi positif ke sekitarnya. ESFP juga sangat peduli pada orang lain dan suka membantu.",
      strengths: ["Ramah dan optimis", "Sosial dan komunikatif", "Adaptif", "Peduli pada orang lain"],
      weaknesses: ["Kurang suka rutinitas", "Cenderung boros", "Sulit fokus pada tugas jangka panjang"],
      traits: ["Ramah", "Optimis", "Sosial", "Peduli"],
      tips: ["Latih disiplin dan perencanaan", "Kelola keuangan dengan bijak", "Fokus pada tujuan jangka panjang"],
    },
    ENFP: {
      name: "The Campaigner",
      description:
        "ENFP adalah pribadi yang antusias, kreatif, dan sangat imajinatif. Mereka suka mengeksplorasi ide-ide baru, mudah beradaptasi, dan sangat peduli pada orang lain. ENFP cenderung spontan, suka tantangan, dan selalu mencari makna dalam hidup.",
      strengths: ["Antusias dan kreatif", "Empati tinggi", "Fleksibel dan adaptif", "Komunikatif"],
      weaknesses: ["Mudah bosan", "Cenderung menunda pekerjaan", "Terlalu emosional"],
      traits: ["Antusias", "Kreatif", "Empati", "Fleksibel"],
      tips: ["Latih konsistensi", "Kelola emosi dengan baik", "Fokus pada prioritas"],
    },
    ENTP: {
      name: "The Debater",
      description:
        "ENTP adalah pemikir inovatif, suka berdebat, dan sangat suka tantangan intelektual. Mereka cepat belajar, suka diskusi, dan selalu mencari cara baru untuk memecahkan masalah. ENTP cenderung fleksibel dan suka perubahan.",
      strengths: ["Inovatif dan kritis", "Fleksibel", "Percaya diri", "Komunikatif"],
      weaknesses: ["Kurang suka rutinitas", "Cenderung argumentatif", "Kurang sabar"],
      traits: ["Inovatif", "Kritis", "Fleksibel", "Percaya Diri"],
      tips: ["Latih empati dalam diskusi", "Kelola waktu dengan baik", "Fokus pada penyelesaian tugas"],
    },
    ESTJ: {
      name: "The Supervisor",
      description:
        "ESTJ adalah pribadi yang tegas, terorganisir, dan suka keteraturan. Mereka suka memimpin, sangat logis, dan selalu berusaha mencapai target. ESTJ cenderung praktis, suka aturan, dan dapat diandalkan dalam situasi apapun.",
      strengths: ["Tegas dan terorganisir", "Praktis dan logis", "Bertanggung jawab", "Pemimpin yang baik"],
      weaknesses: ["Kurang fleksibel", "Cenderung kaku pada aturan", "Kurang peka terhadap perasaan orang lain"],
      traits: ["Tegas", "Terorganisir", "Praktis", "Logis"],
      tips: ["Latih fleksibilitas", "Perhatikan perasaan orang lain", "Terbuka pada ide baru"],
    },
    ESFJ: {
      name: "The Consul",
      description:
        "ESFJ adalah sosok yang hangat, suka membantu, dan sangat peduli pada orang lain. Mereka suka menjaga harmoni, mudah bergaul, dan sangat bertanggung jawab. ESFJ cenderung suka bekerja sama dan selalu berusaha membuat lingkungan nyaman.",
      strengths: ["Hangat dan peduli", "Bertanggung jawab", "Sosial dan komunikatif", "Teliti"],
      weaknesses: ["Terlalu memikirkan pendapat orang lain", "Sulit berkata tidak", "Cenderung menghindari konflik"],
      traits: ["Hangat", "Peduli", "Bertanggung Jawab", "Sosial"],
      tips: ["Belajar menetapkan batasan", "Jangan ragu mengungkapkan pendapat", "Kelola ekspektasi sosial"],
    },
    ENFJ: {
      name: "The Protagonist",
      description:
        "ENFJ adalah pemimpin yang inspiratif, penuh empati, dan sangat peduli pada perkembangan orang lain. Mereka suka memotivasi, mudah memahami perasaan orang lain, dan sangat komunikatif. ENFJ cenderung suka bekerja dalam tim dan menjadi penggerak perubahan.",
      strengths: ["Inspiratif dan empati tinggi", "Komunikatif", "Motivator", "Suka bekerja sama"],
      weaknesses: ["Terlalu memikirkan orang lain", "Mudah lelah secara emosional", "Sulit menerima kritik"],
      traits: ["Inspiratif", "Empati", "Komunikatif", "Motivator"],
      tips: ["Jaga keseimbangan antara membantu dan kebutuhan diri sendiri", "Latih penerimaan terhadap kritik", "Kelola energi emosional"],
    },
    ENTJ: {
      name: "The Commander",
      description:
        "ENTJ adalah pemimpin alami yang tegas, visioner, dan sangat logis. Mereka suka merancang strategi, cepat mengambil keputusan, dan selalu fokus pada tujuan. ENTJ cenderung percaya diri, suka tantangan, dan sangat kompetitif.",
      strengths: ["Tegas dan visioner", "Logis dan strategis", "Kompetitif", "Pemimpin yang baik"],
      weaknesses: ["Kurang peka terhadap perasaan orang lain", "Cenderung dominan", "Kurang sabar"],
      traits: ["Tegas", "Visioner", "Logis", "Kompetitif"],
      tips: ["Latih empati dan komunikasi", "Terbuka pada masukan orang lain", "Kelola ambisi dengan bijak"],
    },
  }
  return (
    descriptions[type] || {
      name: "Tipe Kepribadian",
      description: "Deskripsi belum tersedia.",
      strengths: ["-"],
      weaknesses: ["-"],
      traits: ["-"],
      tips: ["-"],
    }
  )
}

export default function MBTIResultPage() {
  const [mbtiResult, setMbtiResult] = useState("")

  useEffect(() => {
    // Ambil hasil dari localStorage
    const result = localStorage.getItem("mbti_result")
    if (result) setMbtiResult(result)
  }, [])

  const desc = getMBTIDescription(mbtiResult)

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
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
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{desc.name}</h3>
              <p className="text-gray-600 text-base max-w-xl mx-auto mb-4">{desc.description}</p>
            </div>
            <div className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-sky-700 mb-2">Kelebihan:</h4>
                <ul className="list-disc list-inside text-sky-700">
                  {desc.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-rose-700 mb-2">Kekurangan:</h4>
                <ul className="list-disc list-inside text-rose-700">
                  {desc.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-700 mb-2">Karakteristik Utama:</h4>
                <div className="flex flex-wrap gap-2">
                  {desc.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white rounded-full text-sm text-emerald-600 border border-emerald-200"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sky-700 mb-2">Tips Pengembangan Diri:</h4>
                <ul className="list-disc list-inside text-sky-700">
                  {desc.tips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link href="/ai-analysis">
                <span className="inline-block px-8 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold rounded-xl shadow hover:from-sky-600 hover:to-emerald-600 transition-all duration-300 cursor-pointer">
                  Lanjut ke Analysis AI
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 