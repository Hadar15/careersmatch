"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  name: string;
  description: string;
  photoUrl?: string;
  partnerLogo?: string;
  startDate?: string;
  primaryLanguages?: string[];
}

const PAGE_SIZE = 24;
const API_URL = "/api/coursera-courses";

export function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [langFilter, setLangFilter] = useState<string>("");
  const loader = useRef<HTMLDivElement | null>(null);
  const [languages, setLanguages] = useState<string[]>([]);

  // Fetch courses from Coursera API
  const fetchCourses = async (reset = false) => {
    setLoading(true);
    setError("");
    try {
      const params = [
        `start=${reset ? 0 : start}`,
        `limit=${PAGE_SIZE}`,
        "fields=name,description,photoUrl,partnerLogo,startDate,primaryLanguages"
      ];
      const url = `${API_URL}?${params.join("&")}`;
      const res = await fetch(url);
      if (res.status === 404) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      const data = await res.json();
      let newCourses: Course[] = data.elements || [];
      // Filter by language if needed
      if (langFilter) {
        newCourses = newCourses.filter((c) => c.primaryLanguages && c.primaryLanguages.includes(langFilter));
      }
      setCourses((prev) => reset ? newCourses : [...prev, ...newCourses]);
      setHasMore(newCourses.length === PAGE_SIZE);
      // Kumpulkan semua bahasa unik
      if (reset) {
        const langs = new Set<string>();
        (data.elements || []).forEach((c: Course) => {
          if (c.primaryLanguages) c.primaryLanguages.forEach((l: string) => langs.add(l));
        });
        setLanguages(Array.from(langs));
      }
    } catch (e) {
      setError("Gagal memuat data kursus dari Coursera.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch & filter change
  useEffect(() => {
    setCourses([]);
    setStart(0);
    fetchCourses(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langFilter]);

  // Hanya tampilkan bahasa Indonesia dan Inggris di filter
  const allowedLangs = languages.filter(l => l === 'id' || l === 'en');

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStart((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [hasMore, loading]);

  // Fetch next page when start changes (except first load)
  useEffect(() => {
    if (start === 0) return;
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  // Handle filter change
  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLangFilter(e.target.value);
  };

  return (
    <div className="container mx-auto">
      <div className="relative flex justify-center">
        <div
          className="rounded-xl shadow-xl bg-white/80 backdrop-blur-md flex flex-col items-center"
          style={{ maxHeight: 600, minHeight: 300, maxWidth: 900, margin: '0 auto', width: '100%', padding: 24 }}
        >
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 shadow-lg mr-2">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#38bdf8"/><path d="M12 6.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5S10.62 8.5 12 8.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#06b6d4"/></svg>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent drop-shadow">Kursus Online Coursera</h2>
            </div>
            <div>
              <select
                className="border border-sky-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={langFilter}
                onChange={handleFilter}
              >
                <option value="">Bahasa Indonesia & Inggris</option>
                {allowedLangs.map((l) => (
                  <option key={l} value={l}>{l === 'id' ? 'Bahasa Indonesia' : l === 'en' ? 'English' : l}</option>
                ))}
              </select>
            </div>
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto w-full"
            style={{ flex: 1 }}
            onScroll={e => {
              const el = e.currentTarget;
              if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && hasMore && !loading) {
                setStart(prev => prev + PAGE_SIZE);
              }
            }}
          >
            {courses
              .filter(course => {
                // Jika filter kosong, hanya tampilkan kursus dengan id/en
                if (!langFilter) return course.primaryLanguages && (course.primaryLanguages.includes('id') || course.primaryLanguages.includes('en'));
                return course.primaryLanguages && course.primaryLanguages.includes(langFilter);
              })
              .map((course, idx) => (
                <Card key={course.id || idx} className="border-sky-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm group cursor-pointer">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-3">
                      {course.partnerLogo && <img src={course.partnerLogo} alt="logo" className="w-8 h-8 mr-2 rounded bg-white object-contain border" />}
                      <Badge className="bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 border-sky-200 px-3 py-1 text-xs font-medium mr-2">Coursera</Badge>
                      {course.primaryLanguages && course.primaryLanguages.length > 0 && (
                        <span className="text-gray-400 text-xs">{course.primaryLanguages.join(", ")}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{course.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{course.description}</p>
                    {course.photoUrl && (
                      <img src={course.photoUrl} alt={course.name} className="w-full h-32 object-cover rounded mb-3" />
                    )}
                    <Button
                      asChild
                      className="mt-auto bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg text-xs px-4 py-2 h-8"
                    >
                      <a href={`https://www.coursera.org/learn/${course.id}`} target="_blank" rel="noopener noreferrer">Lihat Detail</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
          {loading && <div className="text-center py-6 text-sky-600 font-semibold absolute left-0 right-0 bottom-0 bg-gradient-to-t from-white/80 to-transparent">Memuat...</div>}
          {!hasMore && !loading && (
            <div className="text-center py-6 text-gray-400 absolute left-0 right-0 bottom-0 bg-gradient-to-t from-white/80 to-transparent">Tidak ada lagi kursus.</div>
          )}
        </div>
      </div>
    </div>
  );
} 