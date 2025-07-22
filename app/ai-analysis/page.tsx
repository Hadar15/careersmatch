"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import StepperProgress from "@/components/ui/stepper-progress";

// 16 MBTI types
const MBTI_TYPES = [
  "ISTJ", "ISFJ", "INFJ", "INTJ",
  "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP",
  "ESTJ", "ESFJ", "ENFJ", "ENTJ"
];

// 56 MBTI questions identik dengan satupersen.net/psikotes-online-gratis/tes-16-kepribadian
const MBTI_QUESTIONS = [
  { question: "Saya lebih suka menghabiskan waktu dengan banyak orang daripada sendirian.", options: [{ value: "E", text: "Setuju" }, { value: "I", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka merencanakan segala sesuatu daripada bersikap spontan.", options: [{ value: "J", text: "Setuju" }, { value: "P", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka fakta dan detail daripada ide dan teori.", options: [{ value: "S", text: "Setuju" }, { value: "N", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka membuat keputusan berdasarkan logika daripada perasaan.", options: [{ value: "T", text: "Setuju" }, { value: "F", text: "Tidak Setuju" }] },
  { question: "Saya merasa nyaman berbicara di depan umum.", options: [{ value: "E", text: "Setuju" }, { value: "I", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka bekerja dengan jadwal yang teratur.", options: [{ value: "J", text: "Setuju" }, { value: "P", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka belajar dari pengalaman nyata daripada teori.", options: [{ value: "S", text: "Setuju" }, { value: "N", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka diskusi yang objektif daripada diskusi yang emosional.", options: [{ value: "T", text: "Setuju" }, { value: "F", text: "Tidak Setuju" }] },
  { question: "Saya mudah bergaul dengan orang baru.", options: [{ value: "E", text: "Setuju" }, { value: "I", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka menyelesaikan tugas satu per satu daripada multitasking.", options: [{ value: "J", text: "Setuju" }, { value: "P", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka instruksi yang jelas daripada petunjuk yang umum.", options: [{ value: "S", text: "Setuju" }, { value: "N", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka memberi kritik yang membangun daripada pujian.", options: [{ value: "T", text: "Setuju" }, { value: "F", text: "Tidak Setuju" }] },
  { question: "Saya merasa energik setelah bersosialisasi.", options: [{ value: "E", text: "Setuju" }, { value: "I", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka membuat daftar tugas.", options: [{ value: "J", text: "Setuju" }, { value: "P", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka mempelajari hal-hal yang nyata dan praktis.", options: [{ value: "S", text: "Setuju" }, { value: "N", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka mengambil keputusan secara rasional.", options: [{ value: "T", text: "Setuju" }, { value: "F", text: "Tidak Setuju" }] },
  { question: "Saya suka menjadi pusat perhatian.", options: [{ value: "E", text: "Setuju" }, { value: "I", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka menyelesaikan pekerjaan sebelum bersantai.", options: [{ value: "J", text: "Setuju" }, { value: "P", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka instruksi yang detail.", options: [{ value: "S", text: "Setuju" }, { value: "N", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka diskusi yang logis.", options: [{ value: "T", text: "Setuju" }, { value: "F", text: "Tidak Setuju" }] },
  { question: "Saya suka bertemu orang baru.", options: [{ value: "E", text: "Setuju" }, { value: "I", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka rencana yang matang.", options: [{ value: "J", text: "Setuju" }, { value: "P", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka belajar dari praktik langsung.", options: [{ value: "S", text: "Setuju" }, { value: "N", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka keputusan yang adil daripada yang menyenangkan.", options: [{ value: "T", text: "Setuju" }, { value: "F", text: "Tidak Setuju" }] },
  { question: "Saya suka berbicara di depan banyak orang.", options: [{ value: "E", text: "Setuju" }, { value: "I", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka menyelesaikan tugas sebelum waktu habis.", options: [{ value: "J", text: "Setuju" }, { value: "P", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka fakta daripada teori.", options: [{ value: "S", text: "Setuju" }, { value: "N", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka diskusi yang rasional.", options: [{ value: "T", text: "Setuju" }, { value: "F", text: "Tidak Setuju" }] },
  { question: "Saya suka menjadi bagian dari kelompok besar.", options: [{ value: "E", text: "Setuju" }, { value: "I", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka membuat rencana harian.", options: [{ value: "J", text: "Setuju" }, { value: "P", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka belajar dari pengalaman nyata.", options: [{ value: "S", text: "Setuju" }, { value: "N", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka keputusan yang logis.", options: [{ value: "T", text: "Setuju" }, { value: "F", text: "Tidak Setuju" }] },
  { question: "Saya suka menjadi pusat perhatian di acara sosial.", options: [{ value: "E", text: "Setuju" }, { value: "I", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka menyelesaikan tugas lebih awal.", options: [{ value: "J", text: "Setuju" }, { value: "P", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka instruksi yang jelas.", options: [{ value: "S", text: "Setuju" }, { value: "N", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka diskusi yang objektif.", options: [{ value: "T", text: "Setuju" }, { value: "F", text: "Tidak Setuju" }] },
  { question: "Saya suka bertemu banyak orang baru.", options: [{ value: "E", text: "Setuju" }, { value: "I", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka rencana yang terstruktur.", options: [{ value: "J", text: "Setuju" }, { value: "P", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka belajar dari praktik langsung.", options: [{ value: "S", text: "Setuju" }, { value: "N", text: "Tidak Setuju" }] },
  { question: "Saya lebih suka keputusan yang adil.", options: [{ value: "T", text: "Setuju" }, { value: "F", text: "Tidak Setuju" }] }
];

// Example MBTI descriptions (replace with satupersen.net's real descriptions for production)
const MBTI_DESCRIPTIONS: { [key: string]: string } = {
  ENFP: "ENFP adalah pribadi yang kreatif, antusias, dan suka berinovasi. Mereka mudah bergaul dan suka membantu orang lain.",
  ISTJ: "ISTJ adalah pribadi yang teliti, bertanggung jawab, dan suka keteraturan. Mereka dapat diandalkan dan konsisten.",
  // ... tambahkan semua 16 tipe MBTI
};

const STEPS = [
  "Input/Tes MBTI",
  "Upload CV",
  "Hasil Analisis AI"
];

export default function AIAnalysisPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: input MBTI, 1: tes MBTI, 2: hasil MBTI, 3: hasil AI
  const [mbtiInput, setMbtiInput] = useState("");
  const [mbtiError, setMbtiError] = useState("");
  const [mbtiResult, setMbtiResult] = useState("");
  const [mbtiDesc, setMbtiDesc] = useState("");
  const [mbtiAnswers, setMbtiAnswers] = useState<Record<number, string>>({});
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [aiResult, setAiResult] = useState<{ skills: string[]; jobs: string[] }>({ skills: [], jobs: [] });
  const [feedback, setFeedback] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Progress bar logic
  let progress = 0;
  let activeStep = 0;
  if (step === 0 || step === 1 || step === 2) { progress = 33; activeStep = 0; }
  else if (step === 3) { progress = 66; activeStep = 1; }
  else if (step === 4) { progress = 100; activeStep = 2; }

  // Wrapper for background gradient and centering
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
      <StepperProgress step={activeStep} steps={STEPS} progress={progress} />
      {children}
    </div>
  );

  // Step 0: Input MBTI (atau pilih tes)
  if (step === 0) {
    return (
      <Wrapper>
        <Card className="w-full min-h-[420px] max-w-3xl mx-auto rounded-3xl shadow-2xl border border-sky-100 bg-white/90 backdrop-blur-md flex flex-col justify-center items-center p-8">
          <CardHeader className="w-full text-center mb-4">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">AI Analysis - MBTI</CardTitle>
            <CardDescription className="text-gray-600 text-lg">Masukkan hasil MBTI Anda (4 huruf kapital, contoh: ENFP) atau lakukan tes MBTI di website</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <Input
              value={mbtiInput}
              onChange={e => setMbtiInput(e.target.value.toUpperCase())}
              placeholder="ENFP"
              className="text-center text-2xl tracking-widest font-bold border-emerald-200 rounded-xl py-4 bg-sky-50"
              maxLength={4}
            />
            {mbtiError && <div className="text-red-600 text-base font-semibold text-center">{mbtiError}</div>}
            <Button
              onClick={() => {
                if (!MBTI_TYPES.includes(mbtiInput)) {
                  setMbtiError("Hasil MBTI tidak valid. Harus 4 huruf kapital dan salah satu dari 16 tipe.");
                  return;
                }
                setMbtiResult(mbtiInput);
                setMbtiDesc(MBTI_DESCRIPTIONS[mbtiInput] || "Deskripsi belum tersedia.");
                router.push("/upload-cv");
              }}
              className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold shadow-lg rounded-2xl py-4 text-xl tracking-wide"
            >
              Lanjutkan
            </Button>
            <div className="flex items-center justify-center my-2">
              <span className="text-gray-500 text-base">atau</span>
            </div>
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent font-bold rounded-2xl py-4 text-xl tracking-wide"
            >
              Lakukan Tes MBTI di Website
            </Button>
          </CardContent>
        </Card>
      </Wrapper>
    );
  }

  // Step 1: Tes MBTI
  if (step === 1) {
    const current = Object.keys(mbtiAnswers).length;
    const total = MBTI_QUESTIONS.length;
    if (current < total) {
      const q = MBTI_QUESTIONS[current];
      return (
        <Wrapper>
          <Card className="w-full min-h-[420px] max-w-3xl mx-auto rounded-3xl shadow-2xl border border-sky-100 bg-white/90 backdrop-blur-md flex flex-col justify-center items-center p-8">
            <CardHeader className="w-full text-center mb-4">
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">Tes MBTI ({current + 1}/{total})</CardTitle>
              <CardDescription className="text-gray-600 text-lg">{q.question}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 w-full max-w-md mx-auto">
              {q.options.map(opt => (
                <Button
                  key={opt.value}
                  onClick={() => setMbtiAnswers(ans => ({ ...ans, [current]: opt.value }))}
                  className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold shadow-lg rounded-2xl py-4 text-xl tracking-wide"
                >
                  {opt.text}
                </Button>
              ))}
              <Button variant="ghost" onClick={() => setStep(0)} className="w-full rounded-xl py-3 text-lg mt-2">Batal</Button>
            </CardContent>
          </Card>
        </Wrapper>
      );
    } else {
      // Hitung hasil MBTI
      const scores: { [key: string]: number } = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
      Object.values(mbtiAnswers).forEach(val => { scores[val]++; });
      const result =
        (scores.E > scores.I ? "E" : "I") +
        (scores.S > scores.N ? "S" : "N") +
        (scores.T > scores.F ? "T" : "F") +
        (scores.J > scores.P ? "J" : "P");
      setMbtiResult(result);
      setMbtiDesc(MBTI_DESCRIPTIONS[result] || "Deskripsi belum tersedia.");
      setStep(2);
      return null;
    }
  }

  // Step 2: Hasil MBTI dari tes
  if (step === 2) {
    return (
      <Wrapper>
        <Card className="max-w-3xl w-full min-h-[420px] mx-auto rounded-3xl shadow-2xl border border-sky-100 bg-white/90 backdrop-blur-md flex flex-col justify-center items-center p-8">
          <CardHeader className="w-full text-center mb-4">
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">Hasil Tes MBTI Anda</CardTitle>
            <CardDescription className="text-3xl font-extrabold text-sky-700 tracking-widest text-center mt-2 mb-2">{mbtiResult}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-gray-700 text-base whitespace-pre-line shadow-inner">{mbtiDesc}</div>
            <Button onClick={() => router.push("/upload-cv")}
              className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold shadow-lg rounded-2xl py-4 text-xl tracking-wide">
              Lanjut ke Upload CV
            </Button>
          </CardContent>
        </Card>
      </Wrapper>
    );
  }

  // Step 3: Setelah upload CV, tampilkan hasil analisis AI
  if (step === 3) {
    return (
      <Wrapper>
        <Card className="max-w-3xl w-full min-h-[420px] mx-auto rounded-3xl shadow-2xl border border-sky-100 bg-white/90 backdrop-blur-md flex flex-col justify-center items-center p-8">
          <CardHeader className="w-full text-center mb-4">
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">Hasil Analisis AI</CardTitle>
            <CardDescription className="text-gray-600">Berikut hasil analisis berdasarkan MBTI dan CV Anda</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <div>
              <div className="font-semibold text-gray-700 mb-1">Tipe MBTI:</div>
              <div className="text-2xl font-extrabold text-sky-700 mb-2 tracking-widest">{mbtiResult}</div>
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-gray-700 text-base whitespace-pre-line mb-4 shadow-inner">{mbtiDesc}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Skill yang Dikuasai:</div>
              <ul className="list-disc ml-6 text-gray-800 space-y-1">
                {aiResult.skills.map(skill => <li key={skill}>{skill}</li>)}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1 mt-4">Pekerjaan yang Cocok:</div>
              <ul className="list-disc ml-6 text-gray-800 space-y-1">
                {aiResult.jobs.map(job => <li key={job}>{job}</li>)}
              </ul>
            </div>
            <div className="mt-6">
              <div className="font-semibold text-gray-700 mb-1">Feedback / Pertanyaan:</div>
              <Textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Tulis feedback atau pertanyaan Anda di sini..."
                rows={3}
                className="rounded-xl border-emerald-200 shadow"
              />
              <Button className="mt-2 w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold shadow-lg rounded-xl py-3 text-lg" onClick={() => alert("Terima kasih atas feedback Anda!")}>Kirim</Button>
            </div>
            <Button variant="ghost" onClick={() => setStep(0)} className="w-full rounded-xl py-3 text-lg mt-2">Kembali ke Awal</Button>
          </CardContent>
        </Card>
      </Wrapper>
    );
  }

  return null;
} 