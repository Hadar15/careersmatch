"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Globe, Menu, X, Brain } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    console.log("Logout button clicked");
    await signOut();
    // Fallback: force reload in case signOut does not reload
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                CareerMatch
              </span>
              <div className="text-xs font-medium text-emerald-600 hidden sm:block">AI-Powered Career Platform</div>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Fitur
            </Link>
            <Link href="/#jobs" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Jobs
            </Link>
            <Link href="/#courses" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Courses
            </Link>
            <Link href="/#how-it-works" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Cara Kerja
            </Link>
            <Badge className="bg-gradient-to-r from-emerald-100 to-sky-100 text-emerald-700 border-emerald-200">
              <Globe className="w-3 h-3 mr-1" />
              Untuk Indonesia
            </Badge>
          </nav>
          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <Link href="/profile">
                <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                  Profil saya
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-white/80 backdrop-blur-sm font-medium"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                    Daftar Gratis
                  </Button>
                </Link>
              </>
            )}
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-sky-100 bg-white/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/#features" 
                  className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Fitur
                </Link>
                <Link 
                  href="/#jobs" 
                  className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
                <Link 
                  href="/#courses" 
                  className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link 
                  href="/#how-it-works" 
                  className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cara Kerja
                </Link>
                <div className="flex items-center space-x-4 pt-4">
                  {user ? (
                    <Link href="/profile" className="flex-1">
                      <Button
                        className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profil saya
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/auth/login" className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-sky-200 text-sky-600 hover:bg-sky-50 bg-white/80 backdrop-blur-sm font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Masuk
                        </Button>
                      </Link>
                      <Link href="/auth/register" className="flex-1">
                        <Button 
                          className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Daftar
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
      {/* Profile Content */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>
      ) : !user ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <Card className="max-w-md w-full border-sky-100 shadow-xl">
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Anda belum login.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/login">
                <Button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white mt-4">Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Profil Saya</h1>
          <div className="mb-8">
            <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold">
              Logout
            </Button>
          </div>
          <Card className="max-w-md w-full border-sky-100 shadow-xl mb-6">
            <CardHeader>
              <CardTitle>Profil Saya</CardTitle>
              <CardDescription>Informasi akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-semibold text-gray-700">Nama Lengkap:</div>
                <div className="text-lg">{user.user_metadata?.full_name || user.email}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Email:</div>
                <div className="text-lg">{user.email}</div>
              </div>
            </CardContent>
          </Card>
        </main>
      )}
    </div>
  );
} 