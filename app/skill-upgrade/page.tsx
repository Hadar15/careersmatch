"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  BookOpen,
  Clock,
  Star,
  Users,
  TrendingUp,
  Target,
  Award,
  Play,
  ExternalLink,
  Filter,
  Search,
  ArrowRight,
  CheckCircle,
  Bookmark,
  Calendar,
  DollarSign,
  Globe,
  Shield,
  Zap,
  User,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { getCVAnalysis, getMBTIResult } from "@/lib/mock-data"

// Mock data for courses and skills
const mockCourses = [
  {
    id: 1,
    title: "React.js Masterclass 2024",
    instructor: "Sarah Johnson",
    platform: "Udemy",
    duration: "12 hours",
    level: "Intermediate",
    rating: 4.8,
    students: 15420,
    price: "Rp 299.000",
    originalPrice: "Rp 599.000",
    discount: 50,
    category: "Frontend Development",
    skills: ["React", "JavaScript", "TypeScript", "Redux"],
    description: "Learn React.js from scratch to advanced concepts with real-world projects",
    certificate: true,
    language: "English",
    lastUpdated: "2 weeks ago",
    featured: true,
    match: 95,
  },
  {
    id: 2,
    title: "Python for Data Science",
    instructor: "Dr. Michael Chen",
    platform: "Coursera",
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.9,
    students: 8920,
    price: "Free",
    originalPrice: "Rp 1.200.000",
    discount: 100,
    category: "Data Science",
    skills: ["Python", "Pandas", "NumPy", "Matplotlib"],
    description: "Comprehensive introduction to Python programming for data analysis",
    certificate: true,
    language: "English",
    lastUpdated: "1 month ago",
    featured: false,
    match: 88,
  },
  {
    id: 3,
    title: "AWS Cloud Practitioner",
    instructor: "Alex Rodriguez",
    platform: "AWS Training",
    duration: "6 hours",
    level: "Beginner",
    rating: 4.7,
    students: 23450,
    price: "Free",
    originalPrice: "Rp 800.000",
    discount: 100,
    category: "Cloud Computing",
    skills: ["AWS", "Cloud Computing", "DevOps", "Infrastructure"],
    description: "Official AWS certification preparation course",
    certificate: true,
    language: "English",
    lastUpdated: "3 weeks ago",
    featured: true,
    match: 82,
  },
  {
    id: 4,
    title: "UI/UX Design Fundamentals",
    instructor: "Emma Wilson",
    platform: "Skillshare",
    duration: "4 hours",
    level: "Beginner",
    rating: 4.6,
    students: 6780,
    price: "Rp 150.000",
    originalPrice: "Rp 300.000",
    discount: 50,
    category: "Design",
    skills: ["Figma", "UI Design", "UX Design", "Prototyping"],
    description: "Master the fundamentals of modern UI/UX design",
    certificate: false,
    language: "English",
    lastUpdated: "1 week ago",
    featured: false,
    match: 75,
  },
  {
    id: 5,
    title: "Node.js Backend Development",
    instructor: "David Kim",
    platform: "Udemy",
    duration: "15 hours",
    level: "Advanced",
    rating: 4.8,
    students: 12340,
    price: "Rp 399.000",
    originalPrice: "Rp 799.000",
    discount: 50,
    category: "Backend Development",
    skills: ["Node.js", "Express", "MongoDB", "REST API"],
    description: "Build scalable backend applications with Node.js",
    certificate: true,
    language: "English",
    lastUpdated: "1 month ago",
    featured: false,
    match: 90,
  },
  {
    id: 6,
    title: "Machine Learning Basics",
    instructor: "Prof. Lisa Zhang",
    platform: "edX",
    duration: "10 weeks",
    level: "Intermediate",
    rating: 4.9,
    students: 15670,
    price: "Rp 500.000",
    originalPrice: "Rp 1.000.000",
    discount: 50,
    category: "Artificial Intelligence",
    skills: ["Machine Learning", "Python", "Scikit-learn", "TensorFlow"],
    description: "Introduction to machine learning algorithms and applications",
    certificate: true,
    language: "English",
    lastUpdated: "2 months ago",
    featured: true,
    match: 92,
  },
]

const mockSkillGaps = [
  {
    skill: "React.js",
    currentLevel: "Beginner",
    targetLevel: "Advanced",
    importance: "High",
    marketDemand: "Very High",
    salaryImpact: "+25%",
    courses: [1, 5],
  },
  {
    skill: "Python",
    currentLevel: "None",
    targetLevel: "Intermediate",
    importance: "Medium",
    marketDemand: "High",
    salaryImpact: "+20%",
    courses: [2, 6],
  },
  {
    skill: "AWS",
    currentLevel: "None",
    targetLevel: "Intermediate",
    importance: "High",
    marketDemand: "Very High",
    salaryImpact: "+30%",
    courses: [3],
  },
  {
    skill: "UI/UX Design",
    currentLevel: "None",
    targetLevel: "Beginner",
    importance: "Medium",
    marketDemand: "Medium",
    salaryImpact: "+15%",
    courses: [4],
  },
]

export default function SkillUpgradePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [levelFilter, setLevelFilter] = useState("All")
  const [priceFilter, setPriceFilter] = useState("All")
  const [savedCourses, setSavedCourses] = useState<number[]>([])
  const [aiSkills, setAiSkills] = useState<string[]>([])
  const [aiSkillGaps, setAiSkillGaps] = useState<string[]>([])
  const [aiError, setAiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ambil hasil analisis AI dari localStorage
    const cv = getCVAnalysis()
    const mbti = getMBTIResult()
    if (!cv || !mbti) {
      setAiError("Silakan upload CV dan selesaikan tes MBTI untuk rekomendasi skill upgrade yang akurat.")
      setLoading(false)
      return
    }
    setAiSkills(cv.skills || [])
    // Skill gap = skill yang direkomendasikan AI tapi belum dikuasai user
    // Untuk demo, gunakan cv.recommendations atau cv.hiddenSkills jika ada
    setAiSkillGaps(cv.recommendations || cv.hiddenSkills || [])
    setLoading(false)
  }, [])

  const toggleSaveCourse = (courseId: number) => {
    setSavedCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
    toast({
      title: savedCourses.includes(courseId) ? "Course Removed" : "Course Saved",
      description: savedCourses.includes(courseId) ? "Course removed from saved list" : "Course added to saved list",
    })
  }

  // Filter courses by AI skill gap if available
  const aiFilteredCourses = aiSkillGaps.length > 0
    ? mockCourses.filter((course) => course.skills.some((s) => aiSkillGaps.includes(s)))
    : mockCourses

  // Apply user filters on top of AI filter
  const filteredCourses = aiFilteredCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "All" || course.category === categoryFilter
    const matchesLevel = levelFilter === "All" || course.level === levelFilter
    const matchesPrice =
      priceFilter === "All" ||
      (priceFilter === "Free" && course.price === "Free") ||
      (priceFilter === "Paid" && course.price !== "Free")
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice
  })

  // Sort by match percentage and featured status
  const sortedCourses = filteredCourses.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return b.match - a.match
  })

  const getSkillGapProgress = (skill: string) => {
    const skillGap = mockSkillGaps.find((gap) => gap.skill === skill)
    if (!skillGap) return 0
    return 30 // Mock progress - in real app this would be calculated based on user's actual progress
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
        <Card className="border-sky-100 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <User className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg font-medium text-gray-700">Memuat rekomendasi skill upgrade...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
      {/* Header */}
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                CareerMatch
              </span>
              <div className="text-xs font-medium text-emerald-600">AI-Powered Career Platform</div>
            </div>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-white/80 backdrop-blur-sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/job-matching">
              <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm">
                Job Matching
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Badge className="bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 border-sky-200 px-4 py-2 font-medium">
              <Brain className="w-4 h-4 mr-1" />
              AI-Powered Learning
            </Badge>
            <Badge className="bg-gradient-to-r from-emerald-50 to-sky-50 text-emerald-700 border-emerald-200 px-4 py-2 font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              Personalized Path
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            Skill Upgrade Center
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Tingkatkan skill Anda dengan rekomendasi AI yang disesuaikan dengan analisis CV dan MBTI
          </p>
          {aiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">
              {aiError}
            </div>
          )}
          {aiSkillGaps.length > 0 && (
            <div className="mb-2 text-sm text-gray-600">
              <span className="font-semibold text-emerald-700">Skill Gap AI:</span> {aiSkillGaps.join(", ")}
            </div>
          )}
        </div>

        {/* AI Analysis Summary */}
        {aiSkills.length > 0 && (
          <Card className="mb-8 border-sky-100 bg-gradient-to-r from-sky-50/50 to-emerald-50/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Zap className="w-6 h-6 text-sky-600" />
                <span>Analisis AI Anda</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Rekomendasi Karir:</h4>
                  <p className="text-gray-600">{aiSkills.join(", ")}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Skill yang Perlu Ditingkatkan:</h4>
                  <p className="text-gray-600">{aiSkillGaps.join(", ")}</p>
                </div>
              </div>
              {aiSkills.length > 0 && (
                <div className="p-4 bg-white/80 rounded-lg border border-sky-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Saran AI:</h4>
                  <p className="text-gray-600">Rekomendasi skill upgrade berdasarkan analisis CV dan MBTI</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="courses" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm border border-sky-100">
            <TabsTrigger value="courses" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Kursus
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Skill Gaps
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
              <Bookmark className="w-4 h-4 mr-2" />
              Tersimpan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {/* Filters */}
            <Card className="border-sky-100 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Cari Kursus</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Judul, instruktur, atau skill..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-sky-200 focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Kategori</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="border-sky-200 focus:border-sky-400">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">Semua Kategori</SelectItem>
                        <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                        <SelectItem value="Backend Development">Backend Development</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Artificial Intelligence">AI/ML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Level</label>
                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                      <SelectTrigger className="border-sky-200 focus:border-sky-400">
                        <SelectValue placeholder="Pilih level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">Semua Level</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Harga</label>
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger className="border-sky-200 focus:border-sky-400">
                        <SelectValue placeholder="Pilih harga" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">Semua Harga</SelectItem>
                        <SelectItem value="Free">Gratis</SelectItem>
                        <SelectItem value="Paid">Berbayar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Listings */}
            <div className="space-y-6">
              {sortedCourses.map((course) => (
                <Card
                  key={course.id}
                  className={`border-sky-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-white/90 backdrop-blur-sm ${
                    course.featured ? "ring-2 ring-sky-200 bg-gradient-to-r from-sky-50/50 to-emerald-50/50" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                          {course.featured && (
                            <Badge className="bg-gradient-to-r from-sky-100 to-emerald-100 text-sky-700 border-sky-200">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 mb-4">
                          <span className="text-sky-700 font-semibold">{course.instructor}</span>
                          <Badge variant="outline" className="border-sky-200 text-sky-600">
                            {course.platform}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4" />
                            <span className="font-medium">{course.level}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{course.rating}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">{course.students.toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4" />
                            <span className="font-medium">{course.language}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{course.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {course.skills.map((skill, index) => (
                            <Badge key={index} className="bg-sky-50 text-sky-700 border-sky-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 border-sky-200">
                              {course.category}
                            </Badge>
                            {course.certificate && (
                              <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                                <Award className="w-3 h-3 mr-1" />
                                Certificate
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              {course.discount > 0 && (
                                <div className="text-sm text-gray-500 line-through">{course.originalPrice}</div>
                              )}
                              <div className="text-lg font-bold text-gray-800">{course.price}</div>
                              {course.discount > 0 && (
                                <Badge className="bg-red-100 text-red-700 border-red-200">
                                  {course.discount}% OFF
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-4 ml-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-1">
                            {course.match}%
                          </div>
                          <Badge className="bg-gradient-to-r from-emerald-50 to-sky-50 text-emerald-700 border-emerald-200">
                            AI Match
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSaveCourse(course.id)}
                          className={`${
                            savedCourses.includes(course.id)
                              ? "text-emerald-500 hover:text-emerald-600"
                              : "text-gray-400 hover:text-emerald-500"
                          } hover:bg-emerald-50`}
                        >
                          <Bookmark className={`w-6 h-6 ${savedCourses.includes(course.id) ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-sky-100">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="border-gray-200 text-gray-600">
                          <Calendar className="w-3 h-3 mr-1" />
                          Updated {course.lastUpdated}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-white/90"
                        >
                          Preview
                          <ExternalLink className="ml-2 w-4 h-4" />
                        </Button>
                        <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg">
                          Enroll Now
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sortedCourses.length === 0 && (
                <Card className="border-sky-100 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-16 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Tidak ada kursus ditemukan</h3>
                    <p className="text-gray-600 mb-6 text-lg">Coba ubah filter pencarian atau kata kunci Anda</p>
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setCategoryFilter("All")
                        setLevelFilter("All")
                        setPriceFilter("All")
                      }}
                      className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg"
                    >
                      Reset Filter
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {mockSkillGaps.map((skillGap, index) => (
                <Card key={index} className="border-sky-100 bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-xl">{skillGap.skill}</span>
                      <Badge className="bg-gradient-to-r from-emerald-50 to-sky-50 text-emerald-700 border-emerald-200">
                        {skillGap.importance} Priority
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Current Level</label>
                        <p className="text-gray-600">{skillGap.currentLevel}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Target Level</label>
                        <p className="text-gray-600">{skillGap.targetLevel}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{getSkillGapProgress(skillGap.skill)}%</span>
                      </div>
                      <Progress value={getSkillGapProgress(skillGap.skill)} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm text-gray-600">Market Demand</div>
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                          {skillGap.marketDemand}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Salary Impact</div>
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          {skillGap.salaryImpact}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Courses</div>
                        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                          {skillGap.courses.length}
                        </Badge>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg">
                      View Courses
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <div className="space-y-6">
              {savedCourses.length === 0 ? (
                <Card className="border-sky-100 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-16 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Bookmark className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Belum ada kursus tersimpan</h3>
                    <p className="text-gray-600 mb-6 text-lg">Simpan kursus yang menarik untuk dilihat nanti</p>
                    <Link href="/skill-upgrade">
                      <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg">
                        Jelajahi Kursus
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                mockCourses
                  .filter((course) => savedCourses.includes(course.id))
                  .map((course) => (
                    <Card key={course.id} className="border-sky-100 bg-white/90 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                            <p className="text-gray-600 mb-4">{course.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{course.instructor}</span>
                              <span>{course.duration}</span>
                              <span>{course.level}</span>
                              <span>{course.price}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 ml-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleSaveCourse(course.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Bookmark className="w-5 h-5 fill-current" />
                            </Button>
                            <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg">
                              Enroll
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 