"use client";
import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Star } from "lucide-react";

// Mock data course
const ALL_COURSES = [
  {
    id: 1,
    title: "React for Beginners",
    description: "Belajar React dari dasar hingga mahir dengan studi kasus nyata.",
    category: "Frontend",
    skills: ["React", "JavaScript", "Web Development"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Node.js & Express Masterclass",
    description: "Bangun backend API modern dengan Node.js dan Express.",
    category: "Backend",
    skills: ["Node.js", "Express", "API"],
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    description: "Pelajari dasar-dasar desain UI/UX untuk aplikasi modern.",
    category: "Design",
    skills: ["UI/UX", "Design", "Figma"],
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
  },
  {
    id: 4,
    title: "Soft Skills for Tech Talent",
    description: "Tingkatkan komunikasi, leadership, dan problem solving.",
    category: "Soft Skills",
    skills: ["Communication", "Leadership", "Problem Solving"],
    image: "https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
  },
  {
    id: 5,
    title: "TypeScript Essentials",
    description: "Kuasai TypeScript untuk pengembangan aplikasi modern.",
    category: "Frontend",
    skills: ["TypeScript", "JavaScript"],
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
  },
];

export default function CoursePage() {
  const { user } = useAuth();
  // Simulasi hasil analisis AI (skill user)
  const aiSkills = ["React", "Communication", "TypeScript"];
  const [search, setSearch] = useState("");

  // Filter course berdasarkan pencarian dan rekomendasi AI
  const filteredCourses = useMemo(() => {
    let courses = ALL_COURSES;
    if (search.trim() !== "") {
      courses = courses.filter(
        c =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.category.toLowerCase().includes(search.toLowerCase()) ||
          c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
      );
    }
    return courses;
  }, [search]);

  // Rekomendasi course berdasarkan skill AI
  const recommendedCourses = useMemo(() => {
    return ALL_COURSES.filter(course =>
      course.skills.some(skill => aiSkills.includes(skill))
    );
  }, [aiSkills]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white py-10 px-2 md:px-0">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">Course & Learning Path</h1>
          <p className="text-gray-600 text-lg md:text-xl">Temukan course terbaik sesuai minat dan hasil analisis AI Anda</p>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 mb-8 max-w-lg mx-auto">
          <Input
            type="text"
            placeholder="Cari course, skill, atau kategori..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="rounded-xl border-emerald-200 py-3 text-lg shadow"
          />
          <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl px-4 py-2 shadow">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Rekomendasi AI */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-sky-700 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-emerald-500" /> Rekomendasi untuk Anda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedCourses.map(course => (
              <Card key={course.id} className="rounded-2xl shadow-lg border border-sky-100 bg-white/90 hover:shadow-2xl transition-all duration-300">
                <div className="flex gap-4 p-4">
                  <img src={course.image} alt={course.title} className="w-20 h-20 object-cover rounded-xl border border-emerald-100" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-sky-700 mb-1">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex flex-wrap gap-2 mb-1">
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">{course.category}</Badge>
                        {course.skills.map(skill => (
                          <Badge key={skill} className="bg-sky-50 text-sky-600 border-sky-200 text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-gray-500">Rating: {course.rating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Semua Course */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-sky-700 mb-4">Semua Course</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map(course => (
              <Card key={course.id} className="rounded-2xl shadow-lg border border-sky-100 bg-white/90 hover:shadow-2xl transition-all duration-300">
                <div className="flex gap-4 p-4">
                  <img src={course.image} alt={course.title} className="w-20 h-20 object-cover rounded-xl border border-emerald-100" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-sky-700 mb-1">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex flex-wrap gap-2 mb-1">
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">{course.category}</Badge>
                        {course.skills.map(skill => (
                          <Badge key={skill} className="bg-sky-50 text-sky-600 border-sky-200 text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-gray-500">Rating: {course.rating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {filteredCourses.length === 0 && (
              <div className="col-span-2 text-center text-gray-500 py-8">Tidak ada course yang ditemukan.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 