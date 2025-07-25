"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  const { signUp } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation
    if (password !== confirmPassword) {
      setError("Password tidak cocok")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter")
      setLoading(false)
      return
    }

    if (!agreedToTerms) {
      setError("Anda harus menyetujui syarat dan ketentuan")
      setLoading(false)
      return
    }

    try {
      const { error, needsVerification } = await signUp(email, password, fullName)

      if (error) {
        setError(error.message)
        toast({
          title: "Registrasi Gagal",
          description: error.message,
          variant: "destructive",
        })
      } else if (needsVerification) {
        setVerificationSent(true)
        toast({
          title: "Verifikasi Email Dikirim",
          description: "Silakan cek email Anda dan klik link verifikasi untuk mengaktifkan akun.",
        })
      } else {
        toast({
          title: "Registrasi Berhasil",
          description: "Akun Anda telah dibuat. Selamat datang!",
        })
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga")
    } finally {
      setLoading(false)
    }
  }

  // Google OAuth register
  const handleGoogleRegister = async () => {
    setLoading(true)
    setError("")
    try {
      // Debug environment variables
      console.log('Environment check:');
      console.log('process.env.NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
      console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
      console.log('window.location.origin:', typeof window !== 'undefined' ? window.location.origin : 'server-side');
      
      // Determine the correct base URL
      let baseUrl = 'https://careersmatchai.vercel.app'; // Default to production
      
      // Only use localhost if we're definitely in development
      if (typeof window !== 'undefined' && window.location.origin.includes('localhost')) {
        baseUrl = 'http://localhost:3000';
      }
      
      // Override with env var if it exists and is not localhost in production
      if (process.env.NEXT_PUBLIC_BASE_URL && 
          !(typeof window !== 'undefined' && 
            window.location.origin.includes('vercel.app') && 
            process.env.NEXT_PUBLIC_BASE_URL.includes('localhost'))) {
        baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      }
      
      const redirectTo = `${baseUrl}/auth/callback`;
      
      console.log('Final OAuth redirect URL:', redirectTo);
      
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        setError(error.message)
        toast({
          title: "Registrasi Google Gagal",
          description: error.message,
          variant: "destructive",
        })
        setLoading(false)
      }
      // Remove the auth state listener - let the callback page handle everything
    } catch (err) {
      setError("Terjadi kesalahan Google OAuth")
      console.error("OAuth Error:", err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              CareerMatch AI
            </span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Mulai Perjalanan Karir Anda</h1>
          <p className="text-gray-600">Daftar gratis dan temukan pekerjaan impian dengan AI</p>
        </div>

        <Card className="border-sky-100 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Buat Akun Baru</CardTitle>
            <CardDescription className="text-center">Isi informasi di bawah untuk membuat akun</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Demo Notice */}
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Mode Demo:</strong> Isi form dengan data apapun untuk membuat akun demo
              </p>
            </div>

            {verificationSent ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-center mb-4">
                <p>Verifikasi email telah dikirim ke <strong>{email}</strong>.<br />Silakan cek email Anda dan klik link verifikasi untuk mengaktifkan akun.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ulangi password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 mt-1"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    Saya menyetujui{" "}
                    <Link href="/terms" className="text-sky-600 hover:text-sky-700">
                      Syarat & Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link href="/privacy" className="text-sky-600 hover:text-sky-700">
                      Kebijakan Privasi
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Daftar Sekarang"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2 border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                  onClick={handleGoogleRegister}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.64 30.74 0 24 0 14.82 0 6.71 5.8 2.69 14.09l7.98 6.19C12.36 13.19 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.93 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.28c-1.01-2.99-1.01-6.19 0-9.18l-7.98-6.19C.64 16.36 0 20.09 0 24c0 3.91.64 7.64 1.69 11.09l7.98-6.19z"/><path fill="#EA4335" d="M24 48c6.74 0 12.68-2.24 16.98-6.09l-7.19-5.6c-2.01 1.35-4.59 2.14-7.79 2.14-6.26 0-11.64-3.69-13.33-8.59l-7.98 6.19C6.71 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
                  Daftar dengan Google
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Sudah punya akun?{" "}
                <Link href="/auth/login" className="text-sky-600 hover:text-sky-700 font-medium">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Dengan mendaftar, Anda akan mendapatkan akses ke semua fitur premium CareerMatch AI secara gratis.</p>
        </div>
      </div>
    </div>
  )
}
