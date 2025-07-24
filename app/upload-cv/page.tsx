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
    
    // Safety timeout to reset loading state after 60 seconds
    const safetyTimeout = setTimeout(() => {
      console.warn('Personal info submission timed out, resetting loading state');
      setIsSubmittingPersonalInfo(false);
    }, 60000);
    
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "Anda harus login untuk menyimpan data.",
          variant: "destructive",
        });
        setIsSubmittingPersonalInfo(false);
        return;
      }
      
      // Validate required fields
      if (!personalInfo.name.trim()) {
        toast({
          title: "Error",
          description: "Nama lengkap harus diisi.",
          variant: "destructive",
        });
        setIsSubmittingPersonalInfo(false);
        return;
      }
      
      if (!personalInfo.email.trim()) {
        toast({
          title: "Error", 
          description: "Email harus diisi.",
          variant: "destructive",
        });
        setIsSubmittingPersonalInfo(false);
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
          setIsSubmittingPersonalInfo(false);
          return;
        } catch (localStorageError) {
          console.error("Failed to save to localStorage:", localStorageError);
          toast({
            title: "Error",
            description: "Gagal menyimpan data",
            variant: "destructive",
          });
          setIsSubmittingPersonalInfo(false);
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
        localStorage.setItem("userProfile", JSON.stringify(profile));
      } catch (localStorageError) {
        console.warn("Failed to save to localStorage:", localStorageError);
      }
      // Langsung lanjut ke step berikutnya
      setStep(2);
      // Sync ke Supabase di background (tidak blocking UI)
      (async () => {
        try {
          // Check if user is properly authenticated with Supabase
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (!session || !session.user) {
            throw new Error("Session expired. Data will be saved locally only.");
          }
          // Upsert ke Supabase
          await supabase
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
        } catch (err) {
          toast({
            title: "Sync Cloud Gagal",
            description: "Data Anda tersimpan lokal, tapi gagal sync ke cloud. Coba lagi nanti.",
            variant: "default",
          });
        }
      })();
    } catch (error) {
      console.error("Error updating profile:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Terjadi kesalahan saat menyimpan data: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      clearTimeout(safetyTimeout);
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
      // Simpan nama file ke localStorage untuk analisis AI
      localStorage.setItem('uploadedCVName', e.target.files[0].name);
    }
  };

  // Handle submit with extension error protection
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
    
    // Prevent double submission
    if (isAnalyzing) {
      console.warn('Upload already in progress, ignoring duplicate submission');
      return;
    }
    
    setIsAnalyzing(true);
    setUploadProgress(0);
    
    // Master timeout to ensure loading state is always reset
    const masterTimeout = setTimeout(() => {
      console.warn('Master timeout reached - resetting loading state');
      setIsAnalyzing(false);
      setUploadProgress(0);
      setError("Upload timeout. Silakan coba lagi.");
    }, 150000); // 2.5 minutes master timeout
    
    try {
      // Extension-safe upload with multiple fallback strategies
      const formData = new FormData();
      formData.append('file', cvFile);
      console.log('user.id yang dikirim ke backend:', user.id);
      formData.append('userId', user.id);
      formData.append('location', JSON.stringify(personalInfo.location));
      formData.append('mbtiType', mbtiType);
      formData.append('mbtiParagraph', mbtiParagraph);
      
      let uploadResult;
      let uploadSuccess = false;
      
      // Strategy 1: Try modern fetch first (more extension-resistant)
      try {
        console.log('Attempting upload with fetch API (Strategy 1)');
        setUploadProgress(10);
        
        const controller = new AbortController();
        const fetchTimeout = setTimeout(() => {
          controller.abort();
        }, 90000); // 90 second timeout for fetch
        
        const response = await fetch('/api/upload-cv', {
          method: 'POST',
          body: formData,
          signal: controller.signal
        });
        
        clearTimeout(fetchTimeout);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        setUploadProgress(50);
        uploadResult = await response.text();
        setUploadProgress(90);
        uploadSuccess = true;
        console.log('Fetch upload successful');
        
      } catch (fetchError) {
        console.warn('Fetch upload failed, trying XMLHttpRequest fallback:', fetchError);
        
        // Strategy 2: XMLHttpRequest with enhanced extension protection
        try {
          uploadResult = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            let isCompleted = false;
            let progressInterval: NodeJS.Timeout;
            
            // Enhanced timeout with cleanup
            const timeoutId = setTimeout(() => {
              if (!isCompleted) {
                isCompleted = true;
                if (progressInterval) clearInterval(progressInterval);
                try {
                  xhr.abort();
                } catch (abortError) {
                  console.warn('XHR abort failed:', abortError);
                }
                reject(new Error('Upload timeout after 90 seconds'));
              }
            }, 90000); // 90 seconds timeout
            
            // Fallback progress simulation for when onprogress fails
            progressInterval = setInterval(() => {
              if (!isCompleted && xhr.readyState !== 4) {
                setUploadProgress(prev => Math.min(prev + 2, 80));
              }
            }, 1000);
            
            xhr.open('POST', '/api/upload-cv');
            
            // Wrap progress handler to catch extension errors
            xhr.upload.onprogress = (event) => {
              try {
                if (event.lengthComputable && !isCompleted) {
                  const progress = Math.round((event.loaded / event.total) * 90);
                  setUploadProgress(progress);
                }
              } catch (progressError) {
                console.warn('Progress event error (likely extension interference):', progressError);
                // Continue without progress updates
              }
            };
            
            xhr.onload = () => {
              if (!isCompleted) {
                isCompleted = true;
                clearTimeout(timeoutId);
                if (progressInterval) clearInterval(progressInterval);
                
                if (xhr.status >= 200 && xhr.status < 300) {
                  setUploadProgress(90);
                  resolve(xhr.responseText);
                } else {
                  reject(new Error(xhr.responseText || 'Upload failed'));
                }
              }
            };
            
            const handleError = (errorType: string) => {
              if (!isCompleted) {
                isCompleted = true;
                clearTimeout(timeoutId);
                if (progressInterval) clearInterval(progressInterval);
                reject(new Error(`Upload ${errorType}`));
              }
            };
            
            xhr.onerror = () => handleError('failed');
            xhr.onabort = () => handleError('aborted');
            xhr.ontimeout = () => handleError('timed out');
            
            try {
              xhr.send(formData);
            } catch (sendError) {
              handleError('failed to start');
            }
          });
          
          uploadSuccess = true;
          console.log('XMLHttpRequest upload successful');
          
        } catch (xhrError) {
          console.error('Both fetch and XMLHttpRequest failed:', xhrError);
          throw new Error('Upload failed with all methods. Please try again.');
        }
      }
      
      if (!uploadSuccess) {
        throw new Error('Upload failed - no successful method');
      }
      
      console.log('CV upload successful, creating analysis data...');
      setUploadProgress(95);
      
      // Create mock analysis data for the results page
      const mockAnalysis = await simulateAIAnalysis(cvFile.name);
      
      console.log('Mock analysis created:', mockAnalysis);
      
      // Save analysis result to localStorage with error protection
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem("cvAnalysis", JSON.stringify(mockAnalysis));
          
          // Update profile completion
          const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
          profile.profile_completion = 70;
          localStorage.setItem("userProfile", JSON.stringify(profile));
          
          console.log('Analysis data saved to localStorage');
        }
      } catch (localStorageError) {
        console.warn('localStorage save failed:', localStorageError);
        // Continue without localStorage - not critical
      }
      
      // Update or insert profile (wrapped in try-catch to prevent errors from blocking success)
      try {
        const profileTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile update timeout')), 15000)
        );
        
        const profileUpdate = supabase
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
        
        await Promise.race([profileUpdate, profileTimeout]);
        
      } catch (profileError) {
        console.warn('Profile update error (non-blocking):', profileError);
        // Continue without throwing - profile update is not critical for upload success
      }
      
      setSuccess("CV dan profil berhasil diupload dan dianalisis!");
      setAnalysisComplete(true);
      setUploadProgress(100);
      setStep(3);
      
      // Clear master timeout since we succeeded
      clearTimeout(masterTimeout);
      
      // Add a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Reset loading state before navigation
      setIsAnalyzing(false);
      
      // Protected navigation with fallback
      try {
        router.push("/ai-analysis/hasil");
      } catch (navigationError) {
        console.warn('Router navigation failed:', navigationError);
        // Fallback: use window.location
        window.location.href = "/ai-analysis/hasil";
      }
      
    } catch (err: any) {
      console.error('Upload error:', err);
      clearTimeout(masterTimeout);
      
      // Enhanced error message for extension-related issues
      let errorMessage = 'Terjadi kesalahan saat upload.';
      
      if (err instanceof Error) {
        const message = err.message.toLowerCase();
        if (message.includes('message channel closed') || 
            message.includes('extension') || 
            message.includes('listener indicated')) {
          errorMessage = 'Upload terganggu oleh browser extension. Silakan nonaktifkan extension atau coba browser lain.';
        } else if (message.includes('timeout') || message.includes('aborted')) {
          errorMessage = 'Upload timeout. Silakan periksa koneksi internet dan coba lagi.';
        } else if (message.includes('network') || message.includes('fetch')) {
          errorMessage = 'Masalah koneksi internet. Silakan coba lagi.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      // Always ensure loading state is reset
      clearTimeout(masterTimeout);
      setIsAnalyzing(false);
      setTimeout(() => setUploadProgress(0), 2000); // Reset progress after delay
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
