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
import { Brain, Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
        toast({
          title: "Login Gagal",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang kembali!",
        })
        router.push("/")
      }
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga")
    } finally {
      setLoading(false)
    }
  }

  // Demo credentials helper
  const fillDemoCredentials = () => {
    setEmail("demo@careermatch.ai")
    setPassword("demo123")
  }

  // Google OAuth login
  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      // Dynamic URL handling for different environments
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
        (typeof window !== 'undefined' ? window.location.origin : 'https://careersmatchai.vercel.app');
      const redirectTo = `${baseUrl}/auth/callback`;
      
      console.log('OAuth redirect URL:', redirectTo); // Debug log
      
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
          title: "Login Google Gagal",
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Selamat Datang Kembali</h1>
          <p className="text-gray-600">Masuk ke akun Anda untuk melanjutkan pencarian karir</p>
        </div>

        <Card className="border-sky-100 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Masuk ke Akun</CardTitle>
            <CardDescription className="text-center">Masukkan email dan password Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Demo Notice */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 mb-2">
                <strong>Supabase Auth:</strong> Gunakan email dan password yang valid
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillDemoCredentials}
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                Isi Kredensial Demo
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                    placeholder="Masukkan password"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Ingat saya
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-sky-600 hover:text-sky-700">
                  Lupa password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="my-6 flex items-center justify-center gap-2">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-gray-400 text-sm">atau</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.64 30.74 0 24 0 14.82 0 6.71 5.8 2.69 14.09l7.98 6.19C12.36 13.19 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.93 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.28c-1.01-2.99-1.01-6.19 0-9.18l-7.98-6.19C.64 16.36 0 20.09 0 24c0 3.91.64 7.64 1.69 11.09l7.98-6.19z"/><path fill="#EA4335" d="M24 48c6.74 0 12.68-2.24 16.98-6.09l-7.19-5.6c-2.01 1.35-4.59 2.14-7.79 2.14-6.26 0-11.64-3.69-13.33-8.59l-7.98 6.19C6.71 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
              Masuk dengan Google
            </Button>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Belum punya akun?{" "}
                <Link href="/auth/register" className="text-sky-600 hover:text-sky-700 font-medium">
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Dengan masuk, Anda menyetujui{" "}
            <Link href="/terms" className="text-sky-600 hover:text-sky-700">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="/privacy" className="text-sky-600 hover:text-sky-700">
              Kebijakan Privasi
            </Link>{" "}
            kami.
          </p>
        </div>
      </div>
    </div>
  )
}
