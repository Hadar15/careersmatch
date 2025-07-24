"use client";
import { useState } from "react";
import { CoursesSection } from "@/components/courses-section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function CoursePage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white py-10 px-2 md:px-0">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2 drop-shadow">Course & Learning Path</h1>
          <p className="text-gray-600 text-lg md:text-xl mb-6">Temukan course terbaik sesuai minat dan hasil analisis AI Anda</p>
          <div className="flex items-center justify-center gap-2 max-w-xl mx-auto">
            <Input
              type="text"
              placeholder="Cari course, skill, atau kategori..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded-xl border-emerald-200 py-4 px-5 text-lg shadow-lg bg-white/90 focus:border-sky-400 w-full"
            />
            <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl px-5 py-4 shadow-lg">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <CoursesSection searchTerm={search} noContainer={true} />
      </div>
    </div>
  );
} 