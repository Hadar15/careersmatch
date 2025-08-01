"use client"
export const dynamic = "force-dynamic";

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
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
import StepperProgress from "@/components/ui/stepper-progress";
import { useRouter } from "next/navigation";

// Add Photon geocoding API for place search
// Remove PHOTON_API and add NOMINATIM_API
const NOMINATIM_API = "https://nominatim.openstreetmap.org/search?format=json&q=";

// Ganti style URL agar peta sangat detail (MapTiler Streets)
// PENTING: Ganti 'YOUR_MAPTILER_KEY' dengan API key MapTiler milikmu dari https://cloud.maptiler.com/
const MAPTILER_KEY = "bgP0e1YaRFwIQydEByEe"; // <-- Diisi dengan API Key yang diberikan.
const MAP_STYLE_URL = `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`;

export default function UploadCVPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter();
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
  // Add state for upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmittingPersonalInfo, setIsSubmittingPersonalInfo] = useState(false);
  // State untuk MBTI
  const [mbtiType, setMbtiType] = useState<string>("");
  const [mbtiParagraph, setMbtiParagraph] = useState<string>("");

  // Ambil MBTI dari localStorage saat mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMbtiType(localStorage.getItem('mbtiType') || "");
      setMbtiParagraph(localStorage.getItem('mbtiParagraph') || "");
    }
  }, []);

  // Debounced version of handlePersonalInfoSubmit to prevent multiple rapid clicks
  const debouncedPersonalInfoSubmit = useCallback(async () => {
    // Prevent multiple submissions
    if (isSubmittingPersonalInfo) return;
    
    setIsSubmittingPersonalInfo(true);
    
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "Anda harus login untuk menyimpan data.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate required fields
      if (!personalInfo.name.trim()) {
        toast({
          title: "Error",
          description: "Nama lengkap harus diisi.",
          variant: "destructive",
        });
        return;
      }
      
      if (!personalInfo.email.trim()) {
        toast({
          title: "Error", 
          description: "Email harus diisi.",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Validation passed, user:', user);
      console.log('User ID:', user.id);
      console.log('User email:', user.email);
      
      // Check if user is properly authenticated with Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Current Supabase session:', session);
      console.log('Session error:', sessionError);
      
      if (!session || !session.user) {
        console.warn('No active Supabase session found');
        toast({
          title: "Warning",
          description: "Session expired. Data will be saved locally only.",
          variant: "default",
        });
        
        // Skip Supabase and go directly to localStorage save
        const profile = {
          full_name: personalInfo.name,
          phone: personalInfo.phone,
          location: personalInfo.location,
          professional_summary: personalInfo.summary,
          experience_years: Number.parseInt(personalInfo.experience_years) || null,
          profile_completion: 40,
          updated_at: new Date().toISOString(),
        }
        
        try {
          localStorage.setItem("userProfile", JSON.stringify(profile))
          setStep(2)
          toast({
            title: "Berhasil",
            description: "Informasi personal tersimpan (mode offline)",
          })
          return;
        } catch (localStorageError) {
          console.error("Failed to save to localStorage:", localStorageError);
          toast({
            title: "Error",
            description: "Gagal menyimpan data",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Add timeout protection for Supabase operations (increased to 30 seconds)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out after 30 seconds')), 30000)
      );
      
      console.log('Starting Supabase upsert for user:', user.id);
      console.log('Personal info:', personalInfo);
      
      // First, try to get existing profile to understand the current state
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      console.log('Existing profile:', existingProfile);
      console.log('Fetch error:', fetchError);
      
      // Retry logic for upsert operation
      let upsertResult = null;
      let upsertError = null;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          console.log(`Upsert attempt ${retryCount + 1}/${maxRetries}`);
          
          const upsertPromise = supabase
            .from("profiles")
            .upsert({
              id: user.id,
              email: personalInfo.email,
              full_name: personalInfo.name,
              phone: personalInfo.phone,
              location: personalInfo.location ? JSON.stringify(personalInfo.location) : null,
              professional_summary: personalInfo.summary || null,
              experience_years: personalInfo.experience_years ? parseInt(personalInfo.experience_years, 10) : null,
              updated_at: new Date().toISOString(),
            }, { onConflict: "id" });
            
          const result = await Promise.race([upsertPromise, timeoutPromise]);
          upsertResult = result;
          upsertError = (result as any)?.error || null;
          
          if (!upsertError) {
            console.log('Upsert successful on attempt', retryCount + 1);
            break;
          }
          
          console.log(`Attempt ${retryCount + 1} failed:`, upsertError);
          retryCount++;
          
          if (retryCount < maxRetries) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        } catch (error) {
          console.log(`Attempt ${retryCount + 1} threw error:`, error);
          upsertError = error;
          retryCount++;
          
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }
      }
        
      if (upsertError) {
        console.error("Supabase upsert error:", upsertError);
        
        // Check for specific error types
        if (upsertError.code === '42501' || upsertError.message?.includes('row-level security')) {
          console.warn("RLS policy blocked the operation, proceeding with localStorage only");
          
          toast({
            title: "Info",
            description: "Data saved locally. You may need to re-authenticate for cloud sync.",
            variant: "default",
          });
        } else if (upsertError.message?.includes('timeout') || upsertError.message?.includes('Operation timed out')) {
          console.warn("Operation timed out, proceeding with localStorage only");
          
          toast({
            title: "Warning", 
            description: "Connection slow. Data saved locally.",
            variant: "default",
          });
        } else {
          console.warn("Supabase failed with error:", upsertError.message);
          
          toast({
            title: "Warning",
            description: "Data saved locally. Database sync may occur later.",
            variant: "default",
          });
        }
        
        // Continue with localStorage save and proceed to next step
      } else {
        console.log("Supabase upsert successful");
        
        toast({
          title: "Berhasil",
          description: "Informasi personal tersimpan dan disinkronkan",
        });
      }
      
      // Save to localStorage for demo (always do this)
      const profile = {
        full_name: personalInfo.name,
        phone: personalInfo.phone,
        location: personalInfo.location,
        professional_summary: personalInfo.summary,
        experience_years: Number.parseInt(personalInfo.experience_years) || null,
        profile_completion: 40,
        updated_at: new Date().toISOString(),
      }
      
      try {
        localStorage.setItem("userProfile", JSON.stringify(profile))
      } catch (localStorageError) {
        console.warn("Failed to save to localStorage:", localStorageError);
        // Continue without localStorage - not critical
      }
      
      // Always proceed to next step
      setStep(2)
    } catch (error) {
      console.error("Error updating profile:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Terjadi kesalahan saat menyimpan data: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmittingPersonalInfo(false);
    }
  }, [user, personalInfo, toast, supabase, isSubmittingPersonalInfo]);

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
              style: MAP_STYLE_URL, // MapTiler Streets
              center: [106.816666, -6.200000], // Jakarta
              zoom: 5,
            });
            mapRef.current.on("load", () => {
              setMapReady(true);
              setMapError("");
              console.log("[MapLibre] Map loaded successfully.");
            });
            mapRef.current.on("error", (e: any) => {
              setMapError("Gagal memuat peta. Pastikan API key MapTiler benar dan koneksi internet lancar. Daftar gratis di https://cloud.maptiler.com/");
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
            setMapError("Gagal memuat peta. Cek API key MapTiler dan koneksi internet Anda.");
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
    setUploadProgress(0);
    try {
      // Use XMLHttpRequest for progress
      const formData = new FormData();
      formData.append('file', cvFile);
      // Tambahkan log untuk memastikan userId benar
      console.log('user.id yang dikirim ke backend:', user.id);
      formData.append('userId', user.id);
      // Kirim location, mbtiType, mbtiParagraph
      formData.append('location', JSON.stringify(personalInfo.location));
      formData.append('mbtiType', mbtiType);
      formData.append('mbtiParagraph', mbtiParagraph);
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload-cv');
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.responseText);
          } else {
            // Tampilkan error detail dari backend
            let msg = 'Terjadi kesalahan saat upload.';
            try {
              const errJson = JSON.parse(xhr.responseText);
              msg = errJson.error + (errJson.details ? `: ${errJson.details}` : '');
            } catch {}
            reject(new Error(msg));
          }
        };
        xhr.onerror = () => reject(new Error('Terjadi kesalahan saat upload.'));
        xhr.send(formData);
      });
      // Update or insert profile (as before)
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
      setUploadProgress(100);
      // Langsung redirect ke halaman hasil analisis AI
      router.push("/ai-analysis/hasil");
      return;
      // setStep(3); // Hapus tampilan step 3
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat upload.");
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setUploadProgress(0), 1500); // Reset progress after short delay
    }
  };

  const handlePersonalInfoSubmit = async () => {
    debouncedPersonalInfoSubmit();
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
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Progress Bar */}
          <StepperProgress
            step={step === 1 ? 1 : step === 2 ? 2 : step === 3 ? 3 : 1}
            steps={["Input/Tes MBTI", "Upload CV", "Hasil Analisis AI"]}
            progress={step === 1 ? 33 : step === 2 ? 66 : step === 3 ? 100 : 33}
          />

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="max-w-2xl mx-auto mb-4 flex items-center">
              <Button
                variant="ghost"
                className="px-3 py-2 text-sky-600 hover:bg-sky-50 flex items-center"
                onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/ai-analysis'}
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Kembali
              </Button>
            </div>
          )}
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
                      placeholder="Clementheo Benaya Raya Silitonga"
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
                  disabled={!personalInfo.name || !personalInfo.email || isSubmittingPersonalInfo}
                >
                  {isSubmittingPersonalInfo ? (
                    <>
                      <span className="mr-2 inline-block align-middle">
                        <span className="w-4 h-4 border-2 border-white border-t-emerald-500 rounded-full animate-spin inline-block"></span>
                      </span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      Lanjutkan ke Upload CV
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
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

                {/* Progress bar for upload */}
                {isAnalyzing && uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full">
                    <Progress value={uploadProgress} className="h-2" />
                    <div className="text-sm text-sky-600 text-center mt-1">Mengupload CV... {uploadProgress}%</div>
                  </div>
                )}

                {cvFile && !isAnalyzing && (
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
                    disabled={isAnalyzing}
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Kembali
                  </Button>
                  <Button
                    onClick={e => handleSubmit(e)}
                    className="flex-1 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 flex items-center justify-center"
                    disabled={!cvFile || isAnalyzing}
                  >
                    {isAnalyzing && (
                      <span className="mr-2 inline-block align-middle">
                        <span className="w-4 h-4 border-2 border-white border-t-emerald-500 rounded-full animate-spin inline-block"></span>
                      </span>
                    )}
                    {isAnalyzing ? 'Menganalisis...' : 'Upload CV'}
                    <Upload className="ml-2 w-4 h-4" />
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
                  Analisis Selesai!
                </CardTitle>
                <CardDescription>
                  CV Anda telah dianalisis. Anda dapat melihat hasil analisis AI di bawah ini.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className="text-lg text-sky-700 font-semibold">Analisis selesai! Silakan lihat hasil AI Anda.</div>
                  <Button
                    className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
                    onClick={() => router.push("/ai-analysis/hasil")}
                  >
                    Lihat Hasil Analisis AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
