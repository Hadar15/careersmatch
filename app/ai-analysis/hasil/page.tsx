"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { remotiveAPI } from "@/lib/remotive-api";
import { useAuth } from "@/lib/auth-context";

function stripHtmlTags(str: string) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// Tambahan: Komponen Card untuk Job Match
function JobMatchCard({ job, percent, pros, cons }: { job: any; percent: number; pros?: string[]; cons?: string[] }) {
  return (
    <div className="bg-white border border-emerald-100 rounded-xl p-3 shadow flex flex-col gap-1 text-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="font-bold text-sky-700 truncate max-w-[60%]">{job.title}</div>
        <span className="text-emerald-700 font-bold">{percent}% match</span>
      </div>
      <div className="text-gray-600 font-medium truncate">{job.company_name}</div>
      <div className="text-xs text-gray-500 mb-1 truncate">{job.candidate_required_location} • {job.job_type}</div>
      <div className="line-clamp-2 text-gray-700 text-xs mb-1">{stripHtmlTags(job.description?.slice(0, 120))}...</div>
      {pros && pros.length > 0 && (
        <div className="text-xs text-green-700 mt-1"><b>Pros:</b> {pros.join(", ")}</div>
      )}
      {cons && cons.length > 0 && (
        <div className="text-xs text-red-700 mt-1"><b>Cons:</b> {cons.join(", ")}</div>
      )}
      <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline text-xs font-semibold mt-1">Lihat Detail</a>
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <div className="bg-white border border-sky-100 rounded-xl p-3 shadow flex flex-col gap-1 text-sm">
      <div className="font-bold text-emerald-700 truncate">{course.title}</div>
      <div className="text-gray-600 text-xs truncate">{course.provider}</div>
      <div className="text-xs text-gray-500 mb-1">{course.duration} • {course.level}</div>
      <div className="line-clamp-2 text-gray-700 text-xs mb-1">{course.description?.slice(0, 120)}...</div>
      {course.reason && <div className="text-xs text-sky-700 mt-1"><b>Relevansi:</b> {course.reason}</div>}
      <a href={course.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline text-xs font-semibold mt-1">Lihat Course</a>
    </div>
  );
}

// Tambahkan polling fetch JSON
async function fetchWithPolling(publicUrl: string, setErrorMsg: (msg: string) => void, setPollingStatus: (msg: string) => void, maxTries = 15, interval = 2000) {
  for (let i = 0; i < maxTries; i++) {
    setPollingStatus(`Mencari file hasil analisis... percobaan ke-${i + 1}`);
    try {
      const resp = await fetch(publicUrl);
      if (resp.ok) {
        const text = await resp.text();
        try {
          const json = JSON.parse(text);
          setPollingStatus("");
          return json;
        } catch (parseErr) {
          const msg = parseErr instanceof Error ? parseErr.message : String(parseErr);
          setErrorMsg(`Gagal parsing JSON dari public URL: ${msg}. Data: ${text.slice(0, 500)}`);
          setPollingStatus("");
          return null;
        }
      }
    } catch (e) {
      // ignore, will retry
    }
    await new Promise(res => setTimeout(res, interval));
  }
  setPollingStatus("");
  setErrorMsg(`File JSON tidak ditemukan setelah menunggu ${(maxTries * interval) / 1000} detik.`);
  return null;
}

// Dummy data fallback
const dummyCV = {
  skills: ["React", "Node.js", "SQL", "Communication"],
  experience: { totalYears: 2 },
  industries: ["IT", "Education"],
  level: "Junior",
  recommendations: ["Tingkatkan skill backend", "Ambil sertifikasi cloud"]
};
const dummyJobs = [
  { id: 1, title: "Frontend Developer", company_name: "TechCorp", candidate_required_location: "Remote", job_type: "Full-time", description: "Membangun UI modern dengan React.", url: "#", publication_date: "2024-01-01" },
  { id: 2, title: "Backend Engineer", company_name: "DataSoft", candidate_required_location: "Jakarta", job_type: "Full-time", description: "API development dengan Node.js.", url: "#", publication_date: "2024-01-01" }
];
const dummyJobMatches = [
  { job: dummyJobs[0], percent: 85, pros: ["Skill React sesuai", "Remote"], cons: ["Pengalaman < 3 tahun"] },
  { job: dummyJobs[1], percent: 70, pros: ["Skill backend sesuai"], cons: ["Lokasi tidak remote"] }
];
const dummyCourses = [
  { title: "React for Beginners", provider: "Coursera", url: "#", duration: "4 weeks", level: "Beginner", description: "Belajar React dari dasar.", reason: "React skill gap" },
  { title: "Node.js Masterclass", provider: "Udemy", url: "#", duration: "6 weeks", level: "Intermediate", description: "Node.js untuk backend.", reason: "Backend skill gap" }
];

export default function HasilAnalisisAIPage() {
  const [aiResult, setAiResult] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; message: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobMatches, setJobMatches] = useState<any[]>([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [pollingStatus, setPollingStatus] = useState("");
  const [courseRecs, setCourseRecs] = useState<any[]>([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);
  const [skillSummary, setSkillSummary] = useState<string>("");
  const { user } = useAuth();
  const router = useRouter();

  // Ambil profile user (untuk experience_years)
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      // Coba ambil dari Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('experience_years')
        .eq('id', user.id)
        .single();
      if (data && typeof data.experience_years === 'number') {
        setProfile(data);
      } else if (typeof window !== 'undefined') {
        // Fallback: localStorage
        const local = localStorage.getItem('userProfile');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (typeof parsed.experience_years === 'number') {
              setProfile({ experience_years: parsed.experience_years });
            }
          } catch {}
        }
      }
    }
    fetchProfile();
  }, [user]);

  // Ambil rangkuman skill utama dari Gemini API
  useEffect(() => {
    async function fetchSkillSummary() {
      if (!aiResult) return;
      try {
        const resp = await fetch('/api/skill-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cv: aiResult })
        });
        if (resp.ok) {
          const data = await resp.json();
          setSkillSummary(data.summary || "");
        } else {
          setSkillSummary("");
        }
      } catch {
        setSkillSummary("");
      }
    }
    fetchSkillSummary();
  }, [aiResult]);

  async function fetchLatestCVJson() {
    if (!user) return null;
    const { data, error } = await supabase
      .from("cv_uploads")
      .select("file_name")
      .eq("user_id", user.id)
      .order("uploaded_at", { ascending: false })
      .limit(1);
    if (error || !data || data.length === 0) {
      setErrorMsg(`Gagal mengambil nama file upload dari database: ${error?.message || "Tidak ada file ditemukan"}`);
      return null;
    }
    const fileName = data[0].file_name;
    const baseName = fileName.replace(/\.[^.]+$/, "");
    const jsonFileName = `${baseName}-json.json`;
    const publicUrl = `https://obdjdufpascluwlgypup.supabase.co/storage/v1/object/public/resumes/resumes/${user.id}/${jsonFileName}`;
    if (typeof window !== 'undefined') {
      console.log('[DEBUG] Polling JSON from:', publicUrl);
    }
    return await fetchWithPolling(publicUrl, setErrorMsg, setPollingStatus);
  }

  async function fetchJobs() {
    const jobs = await remotiveAPI.getJobs();
    return jobs.jobs || [];
  }

  async function fetchJobMatches(cvJson: any, jobs: any[]) {
    const GEMINI_API_URL = "/api/job-match";
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cv: cvJson,
          jobs: jobs,
          prompt: `Cocokkan data CV berikut dengan seluruh job. Untuk setiap job, berikan skor kecocokan (0-100), pros, dan cons. Kembalikan array 10 job teratas dengan format: [{ job, percent, pros, cons }]. Pros dan cons harus relevan dengan skill/experience user dan deskripsi job.`
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`JobMatch API error. Status: ${response.status}. Response: ${text}`);
      }
      const result = await response.json();
      return result;
    } catch (e: any) {
      if (typeof window !== 'undefined') console.error('[DEBUG] Error fetchJobMatches:', e);
      throw new Error(e.message || "Failed to fetch job match");
    }
  }

  async function fetchCourseRecs(cvJson: any, topJobs: any[]) {
    setCourseLoading(true);
    setCourseError("");
    try {
      const GEMINI_API_URL = "/api/course-recommend";
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cv: cvJson,
          jobs: topJobs,
          prompt: `Berdasarkan skill gap antara CV user dan 10 job match berikut, rekomendasikan 10 course online (judul, provider, url, durasi, level, deskripsi, reason relevansi). Format: [{ title, provider, url, duration, level, description, reason }].` 
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Course API error. Status: ${response.status}. Response: ${text}`);
      }
      const result = await response.json();
      if (typeof window !== 'undefined') console.log('[DEBUG] Course result:', result);
      setCourseRecs(result);
    } catch (e: any) {
      setCourseError(e.message || "Failed to fetch course recommendations");
      if (typeof window !== 'undefined') console.error('[DEBUG] Error fetch course:', e);
    } finally {
      setCourseLoading(false);
    }
  }

  useEffect(() => {
    async function loadAll() {
      setJobLoading(true);
      setErrorMsg("");
      setPollingStatus("");
      // 1. Ambil file JSON CV terbaru user dengan polling
      let cvJson = await fetchLatestCVJson();
      if (!cvJson) {
        // Fallback ke dummy CV
        cvJson = dummyCV;
        setErrorMsg("Gagal mengambil data CV JSON. Menggunakan data demo. Silakan upload ulang CV untuk hasil lebih akurat.");
      }
      if (typeof window !== 'undefined') console.log('[DEBUG] CV JSON:', cvJson);
      // 2. Set hasil analisis AI dari JSON
      setAiResult({
        skills: cvJson.skills || [],
        hiddenSkills: cvJson.hiddenSkills || [],
        experience: cvJson.experience || {},
        industries: cvJson.industries || [],
        level: cvJson.level || "",
        recommendations: cvJson.recommendations || [],
      });
      // 3. Ambil seluruh job dari Remotive
      let jobs = await fetchJobs();
      if (!jobs.length) {
        // Fallback ke dummy jobs
        jobs = dummyJobs;
        setErrorMsg("Tidak ada data job dari Remotive API. Menggunakan data demo.");
      }
      if (typeof window !== 'undefined') console.log('[DEBUG] Jobs:', jobs);
      // 4. Kirim ke Gemini API untuk pencocokan
      try {
        let matches = [];
        try {
          matches = await fetchJobMatches(cvJson, jobs);
        } catch {
          // Fallback ke dummy job match
          matches = dummyJobMatches;
          setErrorMsg("Job match kosong. Menggunakan data demo.");
        }
        if (!matches || !Array.isArray(matches) || matches.length === 0) {
          matches = dummyJobMatches;
          setErrorMsg("Job match kosong. Menggunakan data demo.");
        }
        if (typeof window !== 'undefined') console.log('[DEBUG] Job match result:', matches);
        const sorted = matches.sort((a: any, b: any) => b.percent - a.percent).slice(0, 10);
        setJobMatches(sorted);
        setJobLoading(false);
        // 5. Setelah dapat 10 job teratas, fetch course recs
        try {
          await fetchCourseRecs(cvJson, sorted.map((m: any) => m.job));
        } catch {
          setCourseRecs(dummyCourses);
          setCourseError("Course recommendation kosong. Menggunakan data demo.");
        }
      } catch (e: any) {
        setJobMatches(dummyJobMatches);
        setJobLoading(false);
        setCourseRecs(dummyCourses);
        setCourseError("Gagal fetch job match dari Gemini API. Menggunakan data demo.");
        if (typeof window !== 'undefined') console.error('[DEBUG] Error fetch job match:', e);
      }
    }
    if (user) {
      loadAll();
    }
  }, [user]);

  const handleSend = async () => {
    if (!feedback.trim()) return;
    setChat((prev) => [...prev, { role: "user", message: feedback }]);
    setLoading(true);
    setFeedback("");
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        { role: "ai", message: "Terima kasih atas pertanyaannya! Fitur tanya AI akan segera hadir. (Integrasi API AI di sini)" },
      ]);
      setLoading(false);
    }, 1200);
  };

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
        <Card className="max-w-xl w-full text-center p-8 shadow-xl border-sky-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">{errorMsg}</CardTitle>
            <CardDescription className="mt-2">Silakan upload CV kembali jika belum ada file JSON di storage.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/upload-cv")} className="mt-4 w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold">Upload CV</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!aiResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
        <Card className="max-w-xl w-full text-center p-8 shadow-xl border-sky-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">Memuat hasil analisis...</CardTitle>
            <CardDescription className="mt-2">Mohon tunggu, sedang mengambil data dari storage dan AI.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
      <Card className="max-w-3xl w-full p-8 shadow-2xl border-sky-100">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">Hasil Analisis AI</CardTitle>
          <CardDescription className="text-gray-600">Berikut hasil analisis berdasarkan CV dan MBTI Anda</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
          {/* JOB MATCHING DARI GEMINI API */}
          <div className="bg-gradient-to-r from-emerald-50 to-sky-100 rounded-2xl p-6 shadow">
            <div className="font-bold text-lg text-emerald-700 mb-4">Job Match Terbaik untuk Anda</div>
            {jobLoading ? (
              <div className="text-center text-sky-600 font-semibold animate-pulse">Mencari job match terbaik untuk Anda...</div>
            ) : jobMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {jobMatches.map((jm, i) => (
                  <JobMatchCard key={i} job={jm.job} percent={jm.percent} pros={jm.pros} cons={jm.cons} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">Tidak ditemukan job match yang cocok.</div>
            )}
          </div>

          {/* COURSE RECOMMENDATION DARI GEMINI API */}
          <div className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-2xl p-6 shadow">
            <div className="font-bold text-lg text-sky-700 mb-4">Rekomendasi Course & Skill Gap</div>
            {courseLoading ? (
              <div className="text-center text-emerald-600 font-semibold animate-pulse">Mencari course terbaik untuk Anda...</div>
            ) : courseError ? (
              <div className="text-center text-red-600 font-semibold">{courseError}</div>
            ) : courseRecs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courseRecs.map((course, i) => (
                  <CourseCard key={i} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">Tidak ditemukan rekomendasi course yang cocok.</div>
            )}
          </div>

          {/* Rangkuman pengalaman dan skill */}
          <div className="bg-gradient-to-r from-emerald-100 to-sky-50 rounded-2xl p-6 shadow">
            <div className="font-bold text-lg text-emerald-700 mb-2">Rangkuman Pengalaman & Skill</div>
            <div className="mb-2">
              <span className="font-semibold">Total Pengalaman:</span> {profile?.experience_years ?? aiResult?.experience?.totalYears ?? 0} tahun
            </div>
            <div className="mb-2">
              <span className="font-semibold">Skill Utama:</span>
              <div className="mt-1 text-gray-800 text-sm">
                {skillSummary ? skillSummary : <span className="italic text-gray-400">Memuat rangkuman skill utama...</span>}
              </div>
            </div>
            {aiResult?.hiddenSkills?.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Skill Tersembunyi:</span>
                <ul className="flex flex-wrap gap-2 mt-1">
                  {aiResult?.hiddenSkills?.map((skill: string, i: number) => (
                    <li key={i} className="bg-emerald-200 text-emerald-800 rounded-full px-3 py-1 text-sm font-semibold shadow-sm">{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Saran dan Roadmap */}
          {aiResult?.recommendations?.length > 0 && (
            <div className="bg-gradient-to-r from-sky-50 to-emerald-100 rounded-2xl p-6 shadow">
              <div className="font-bold text-lg text-emerald-700 mb-2">Saran & Roadmap Pengembangan Skill</div>
              <ul className="list-disc ml-6 text-gray-800 space-y-1">
                {aiResult.recommendations.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
              <div className="text-sm text-gray-500 mt-2">AI menyarankan roadmap ini agar Anda bisa meningkatkan peluang karir.</div>
            </div>
          )}
          {/* Chat/pertanyaan ke AI */}
          <div className="bg-white/80 border border-sky-100 rounded-2xl p-6 shadow flex flex-col gap-3">
            <div className="font-bold text-lg text-sky-700 mb-2">Tanya AI</div>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mb-2">
              {chat.map((c, i) => (
                <div key={i} className={c.role === "user" ? "text-right" : "text-left"}>
                  <span className={c.role === "user" ? "inline-block bg-sky-200 text-sky-800 rounded-xl px-4 py-2 my-1" : "inline-block bg-emerald-200 text-emerald-800 rounded-xl px-4 py-2 my-1"}>
                    {c.role === "user" ? "Anda: " : "AI: "}{c.message}
                  </span>
                </div>
              ))}
              {loading && <div className="text-left"><span className="inline-block bg-emerald-100 text-emerald-700 rounded-xl px-4 py-2 my-1 animate-pulse">AI sedang mengetik...</span></div>}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Tulis pertanyaan atau konsultasi karir Anda di sini..."
                rows={2}
                className="rounded-xl border-emerald-200 shadow flex-1"
                disabled={loading}
              />
              <Button onClick={handleSend} disabled={loading || !feedback.trim()} className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold px-6 py-2 rounded-xl shadow transition">Kirim</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {pollingStatus && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-2 mb-2 rounded text-center">
          {pollingStatus}
        </div>
      )}
    </div>
  );
} 