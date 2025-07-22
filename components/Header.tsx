"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Globe, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="border-b border-sky-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Hamburger button for sidebar (only if logged in) */}
          {user && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-2"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          )}
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
        </div>
        {/* Desktop Navigation */}
        {!user && (
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Fitur
            </Link>
            <Link href="#jobs" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Jobs
            </Link>
            <Link href="#courses" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Courses
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
              Cara Kerja
            </Link>
            <Badge className="bg-gradient-to-r from-emerald-100 to-sky-100 text-emerald-700 border-emerald-200">
              <Globe className="w-3 h-3 mr-1" />
              Untuk Indonesia
            </Badge>
          </nav>
        )}
        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          {user ? (
            <Link href="/dashboard">
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
        {!user && (
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
        )}
      </div>
      {/* Mobile Navigation (only if not logged in) */}
      {!user && mobileMenuOpen && (
        <div className="lg:hidden border-t border-sky-100 bg-white/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <Link href="#features" className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Fitur
              </Link>
              <Link href="#jobs" className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Jobs
              </Link>
              <Link href="#courses" className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Courses
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-sky-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Cara Kerja
              </Link>
              <div className="flex items-center space-x-4 pt-4">
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
              </div>
            </nav>
          </div>
        </div>
      )}
      {/* Sidebar Drawer (only if logged in) */}
      {user && sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          {/* Sidebar */}
          <aside className="relative w-72 max-w-full h-full bg-white !bg-white bg-opacity-100 shadow-2xl flex flex-col p-6 animate-slide-in-left text-gray-900" style={{backgroundColor: '#fff', opacity: 1, backdropFilter: 'none'}}>
            {/* Close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            {/* User info */}
            <div className="flex flex-col items-center mb-6 mt-2">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-2xl font-bold text-sky-700 mb-2 shadow-lg">
                {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="font-semibold text-lg text-gray-900">{user?.user_metadata?.full_name || "User"}</div>
              <div className="text-sm text-gray-500">{user?.email}</div>
            </div>
            <hr className="my-4 border-gray-200" />
            {/* Navigation */}
            <nav className="flex flex-col gap-2 mt-2">
              <Link href="/profile" className="py-2 px-3 rounded-lg hover:bg-sky-50 font-semibold transition-colors" onClick={() => setSidebarOpen(false)}>
                Profile
              </Link>
              <Link href="/dashboard" className="py-2 px-3 rounded-lg hover:bg-sky-50 font-semibold transition-colors" onClick={() => setSidebarOpen(false)}>
                Dashboard
              </Link>
              <Link href="/ai-analysis" className="py-2 px-3 rounded-lg hover:bg-sky-50 font-semibold transition-colors" onClick={() => setSidebarOpen(false)}>
                AI Analysis
              </Link>
              <Link href="/job-matching" className="py-2 px-3 rounded-lg hover:bg-sky-50 font-semibold transition-colors" onClick={() => setSidebarOpen(false)}>
                Job Matching
              </Link>
              <Link href="/courses" className="py-2 px-3 rounded-lg hover:bg-sky-50 font-semibold transition-colors" onClick={() => setSidebarOpen(false)}>
                Course
              </Link>
              <Link href="/roadmap" className="py-2 px-3 rounded-lg hover:bg-sky-50 font-semibold transition-colors" onClick={() => setSidebarOpen(false)}>
                Roadmap
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
} 