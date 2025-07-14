"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Brain, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRef } from "react";
// Add this for TypeScript if maplibre-gl types are missing
// @ts-ignore
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Add Photon geocoding API for place search
// Remove PHOTON_API and add NOMINATIM_API
const NOMINATIM_API = "https://nominatim.openstreetmap.org/search?format=json&q=";

const MAP_STYLE_URL = "https://tiles.stadiamaps.com/styles/osm_bright.json";

export default function UploadCVPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    location: null as null | { address: string; lat: number; lng: number },
    summary: "",
    experience_years: "",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");

  // Initialize MapLibre map
  useEffect(() => {
    if (step === 1 && mapContainer.current && !mapRef.current) {
      setTimeout(() => {
        if (mapContainer.current && !mapRef.current) {
          const rect = mapContainer.current.getBoundingClientRect();
          console.log(`[MapLibre] Map container dimensions: width=${rect.width}, height=${rect.height}`);
          try {
            console.log("[MapLibre] Initializing map...");
            mapRef.current = new maplibregl.Map({
              container: mapContainer.current,
              style: MAP_STYLE_URL, // Use Stadia Maps OSM Bright style
              center: [106.816666, -6.200000], // Jakarta
              zoom: 5,
            });
            mapRef.current.on("load", () => {
              setMapReady(true);
              console.log("[MapLibre] Map loaded successfully.");
            });
            mapRef.current.on("error", (e: any) => {
              setMapError("Gagal memuat peta. Coba refresh halaman atau periksa koneksi internet Anda.");
              console.error("MapLibre GL JS error:", e);
            });
            mapRef.current.on("click", (e: any) => {
              const lng = e.lngLat.lng;
              const lat = e.lngLat.lat;
              if (markerRef.current) markerRef.current.remove();
              markerRef.current = new maplibregl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
              setPersonalInfo((info) => ({
                ...info,
                location: {
                  address: `Lat: ${lat}, Lng: ${lng}`,
                  lat,
                  lng,
                },
              }));
            });
          } catch (err) {
            setMapError("Gagal memuat peta. Coba refresh halaman atau periksa koneksi internet Anda.");
            console.error("Map initialization error:", err);
          }
        }
      }, 0);
    }
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        console.log("[MapLibre] Map destroyed on cleanup.");
      }
    };
  }, [step, mapContainer.current]);

  // Handle place search with Photon
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    const res = await fetch(NOMINATIM_API + encodeURIComponent(search));
    const data = await res.json();
    setSearchResults(data || []);
  };

  // Handle selecting a search result
  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = new maplibregl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
    }
    setPersonalInfo((info) => ({
      ...info,
      location: {
        address: result.display_name || search,
        lat,
        lng,
      },
    }));
    setSearchResults([]);
    setSearch("");
  };

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((info) => ({ ...info, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!user) {
      setError("Anda harus login untuk mengupload CV.");
      return;
    }
    if (!cvFile) {
      setError("Silakan upload file CV.");
      return;
    }
    if (!personalInfo.location) {
      setError("Silakan pilih lokasi di peta.");
      return;
    }
    setIsAnalyzing(true);
    try {
      // Upload CV and userId to the API route for processing
      const formData = new FormData();
      formData.append('file', cvFile);
      formData.append('userId', user.id);
      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Terjadi kesalahan saat upload.');
      }
      // Update or insert profile (as before)
      console.log('[DEBUG] Upserting profile with location:', personalInfo.location);
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: personalInfo.email,
          full_name: personalInfo.name,
          phone: personalInfo.phone,
          location: JSON.stringify(personalInfo.location),
          professional_summary: personalInfo.summary,
          experience_years: parseInt(personalInfo.experience_years, 10),
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });
      if (upsertError) throw upsertError;
      setSuccess("CV dan profil berhasil diupload dan dianalisis!");
      setAnalysisComplete(true);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat upload.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePersonalInfoSubmit = async () => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "Anda harus login untuk menyimpan data.",
          variant: "destructive",
        });
        return;
      }
      // Upsert profile to Supabase as soon as personal info is submitted
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: personalInfo.email,
          full_name: personalInfo.name,
          phone: personalInfo.phone,
          location: JSON.stringify(personalInfo.location),
          professional_summary: personalInfo.summary,
          experience_years: parseInt(personalInfo.experience_years, 10),
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });
      if (upsertError) {
        toast({
          title: "Error",
          description: "Gagal menyimpan data ke server.",
          variant: "destructive",
        });
        return;
      }
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
                      name="name"
                      value={personalInfo.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={handleChange}
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
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handleChange}
                      placeholder="+62 812 3456 7890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Lokasi</Label>
                    <form onSubmit={handleSearch} className="flex gap-2 mb-2">
                      <Input
                        id="location-search"
                        type="text"
                        placeholder="Cari lokasi..."
                        autoComplete="off"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" className="bg-sky-500 text-white">Cari</Button>
                    </form>
                    {searchResults.length > 0 && (
                      <ul className="bg-white border rounded shadow max-h-48 overflow-auto mb-2">
                        {searchResults.map((result, idx) => (
                          <li
                            key={idx}
                            className="p-2 hover:bg-sky-50 cursor-pointer"
                            onClick={() => handleSelectResult(result)}
                          >
                            {result.display_name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div ref={mapContainer} style={{ width: "100%", height: 300, borderRadius: 8, border: "1px solid #e0e7ef" }} />
                    {mapError && (
                      <div className="text-red-600 text-sm mt-2">{mapError}</div>
                    )}
                    {personalInfo.location && (
                      <div className="text-sm text-gray-600 mt-2">
                        Lokasi dipilih: {personalInfo.location.address} (Lat: {personalInfo.location.lat}, Lng: {personalInfo.location.lng})
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">*Cari lokasi atau klik pada peta untuk memilih lokasi</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_years">Pengalaman Kerja (Tahun)</Label>
                  <Input
                    id="experience_years"
                    name="experience_years"
                    type="number"
                    value={personalInfo.experience_years}
                    onChange={handleChange}
                    placeholder="3"
                    min="0"
                    max="50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Ringkasan Profesional (Opsional)</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={personalInfo.summary}
                    onChange={handleChange}
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
                    onChange={handleFileChange}
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
                    onClick={e => handleSubmit(e)}
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

                    {/* Removed analysisResult display */}

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
        </div>
      </div>
    </AuthGuard>
  )
}
