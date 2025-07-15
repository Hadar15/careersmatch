"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Brain } from "lucide-react";

export default function LandingNavbar() {
  return (
    <header className="border-b border-sky-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
            CareerMatch AI
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/auth/login" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
            Fitur
          </Link>
          <Link href="/auth/login" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
            Jobs
          </Link>
          <Link href="/auth/login" className="text-gray-600 hover:text-sky-600 transition-colors font-medium">
            Cara Kerja
          </Link>
          <Badge className="bg-gradient-to-r from-emerald-100 to-sky-100 text-emerald-700 border-emerald-200">
            <Globe className="w-3 h-3 mr-1" />
            Untuk Indonesia
          </Badge>
        </nav>
        <div className="flex items-center space-x-3">
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
        </div>
      </div>
    </header>
  );
} 