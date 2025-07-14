"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth"
import { getUserProfile, mockJobListings, mockCourses, mockSkillGaps, type UserProfile, getCVAnalysis } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, MapPin, DollarSign, User, BookOpen, Clock, ArrowRight, Star, Upload, LogOut, Briefcase, PanelLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

export default function DashboardPage() {
  const { user, signOut }: { user: SupabaseUser | null, signOut: () => Promise<void> } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        if (error) {
          toast({
            title: "Gagal memuat profil",
            description: error.message,
            variant: "destructive",
          })
        }
        setProfile(data)
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat mengambil data profil.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
      toast({
        title: "Logout Berhasil",
        description: "Anda telah keluar dari akun",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal logout",
        variant: "destructive",
      })
    }
  }

  // Get top 3 job matches
  const topJobMatches = mockJobListings.slice(0, 3)

  // Get top 3 courses
  const topCourses = mockCourses.slice(0, 3)

  // Helper: Cek apakah user sudah upload CV dan tes MBTI
  const isCVUploaded = !!getCVAnalysis()
  const isMBTIDone = !!profile?.mbti_type // ganti dengan field yang sesuai di profile

  // Handler tombol Job Matching
  const handleJobMatching = () => {
    if (!isCVUploaded || !isMBTIDone) {
      toast({
        title: "Lengkapi Data Dulu",
        description: !isCVUploaded && !isMBTIDone
          ? "Silakan upload CV dan lakukan tes MBTI terlebih dahulu."
          : !isCVUploaded
          ? "Silakan upload CV terlebih dahulu."
          : "Silakan lakukan tes MBTI terlebih dahulu.",
        variant: "destructive",
      })
      if (!isCVUploaded) router.push("/upload-cv")
      else if (!isMBTIDone) router.push("/mbti-test")
      return
    }
    router.push("/job-matching")
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white flex items-center justify-center">
          <Card className="border-sky-100 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-medium text-gray-700">Memuat dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
        {/* Header */}
        <header className="border-b border-sky-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button onClick={() => setSidebarOpen(true)} className="mr-2 p-2 rounded hover:bg-sky-100">
                <PanelLeft className="w-6 h-6 text-sky-600" />
              </button>
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                  CareerMatch AI
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Username & Avatar, bisa diklik ke /profile */}
              <button onClick={() => router.push("/profile")}
                className="flex items-center space-x-2 focus:outline-none">
                <Avatar>
                  <AvatarFallback>
                    {(profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-700">
                  {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                </span>
              </button>
              <nav className="hidden md:flex items-center space-x-4">
                {/* Hapus tombol Upload CV dan Tes MBTI */}
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                  onClick={handleJobMatching}
                >
                  <Briefcase className="mr-2 w-4 h-4" />
                  Job Matching
                </Button>
                <Link href="/skill-upgrade">
                  <Button
                    variant="outline"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                  >
                    <BookOpen className="mr-2 w-4 h-4" />
                    Skill Upgrade
                  </Button>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <LogOut className="mr-2 w-4 h-4" />
                  Logout
                </Button>
              </nav>
              {/* Mobile logout */}
              <div className="md:hidden">
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          {/* Sidebar Drawer */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Navigasi</SheetTitle>
              <div className="p-6 pb-2">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar>
                    <AvatarFallback>
                      {(profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg text-gray-800">
                      {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                    </div>
                    <div className="text-gray-500 text-sm">{user?.email}</div>
                  </div>
                </div>
                <Separator className="my-4" />
                <nav className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start" onClick={() => {router.push("/profile"); setSidebarOpen(false)}}>
                    Profile
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => {handleJobMatching(); setSidebarOpen(false)}}>
                    Job Matching
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => {router.push("/skill-upgrade"); setSidebarOpen(false)}}>
                    Course
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => {router.push("/roadmap"); setSidebarOpen(false)}}>
                    Roadmap
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Welcome Section */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Selamat Datang, {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}!
            </h1>
            <p className="text-gray-600">Dashboard lengkap untuk mengelola pencarian karir Anda</p>
          </div>

          {/* Profile Completion Alert */}
          {profile && profile.profile_completion < 100 && (
            <Card className="mb-6 md:mb-8 border-yellow-200 bg-yellow-50">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-800 mb-2">Lengkapi Profil Anda</h3>
                    <p className="text-yellow-700 text-sm mb-3">
                      Profil Anda {profile.profile_completion}% lengkap. Lengkapi untuk mendapatkan rekomendasi yang
                      lebih akurat.
                    </p>
                    <Progress value={profile.profile_completion} className="h-2 mb-2" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <Link href="/upload-cv">
                      <Button
                        size="sm"
                        className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
                      >
                        <Upload className="mr-2 w-4 h-4" />
                        Upload CV
                      </Button>
                    </Link>
                    <Link href="/mbti-test">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                      >
                        <Brain className="mr-2 w-4 h-4" />
                        Tes MBTI
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Overview */}
          <Card className="mb-6 md:mb-8 border-sky-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-sky-600" />
                <span>Data Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <strong>Hasil Tes MBTI:</strong> {profile?.mbti_type ? profile.mbti_type : <span className="text-red-500">Belum melakukan tes MBTI</span>}
                </div>
                <div>
                  <strong>Status Upload CV:</strong> {isCVUploaded ? <span className="text-green-600">Sudah upload CV</span> : <span className="text-red-500">Belum upload CV</span>}
                </div>
                <div>
                  <strong>Pengalaman Kerja:</strong> {(() => { const cv = getCVAnalysis(); return cv && cv.experience && cv.experience.totalYears ? `${cv.experience.totalYears} tahun` : "-" })()}
                </div>
                <div>
                  <strong>Skill yang Dikuasai:</strong> {(() => { const cv = getCVAnalysis(); return cv && cv.skills && cv.skills.length ? cv.skills.join(", ") : "-" })()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="jobs" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white border border-sky-100">
              <TabsTrigger
                value="jobs"
                className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
              >
                Job Matches
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
              >
                Courses
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
              >
                Skill Analysis
              </TabsTrigger>
              <TabsTrigger
                value="roadmap"
                className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
              >
                Roadmap
              </TabsTrigger>
            </TabsList>

            {/* Job Matches Tab */}
            <TabsContent value="jobs" className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Rekomendasi Pekerjaan</h2>
                <Link href="/job-matching">
                  <Button className="w-full md:w-auto bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600">
                    Lihat Semua
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4 md:gap-6">
                {topJobMatches.map((job) => (
                  <Card key={job.id} className="border-sky-100 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row items-start justify-between mb-4 space-y-4 md:space-y-0">
                        <div className="flex-1 w-full md:w-auto">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">{job.title}</h3>
                          <p className="text-sky-600 font-medium mb-2">{job.company}</p>
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{job.salary}</span>
                            </div>
                            <Badge variant="outline" className="border-emerald-200 text-emerald-600">
                              {job.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-center md:text-right">
                          <div className="text-xl md:text-2xl font-bold text-emerald-600 mb-1">{job.match}%</div>
                          <p className="text-sm text-gray-600">Match</p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, index) => (
                            <Badge key={index} className="bg-sky-50 text-sky-600 border-sky-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Button className="w-full md:w-auto bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600">
                          Lihat Detail
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Rekomendasi Course</h2>
                <Button className="w-full md:w-auto bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600">
                  Lihat Semua Course
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {topCourses.map((course) => (
                  <Card key={course.id} className="border-sky-100 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="p-4 md:p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          className={`text-xs ${
                            course.relevance === "High"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-sky-50 text-sky-600 border-sky-200"
                          }`}
                        >
                          {course.relevance} Relevance
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-base md:text-lg">{course.title}</CardTitle>
                      <CardDescription className="text-sm">{course.provider}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{course.duration}</span>
                          </div>
                          <span className="font-semibold text-emerald-600">{course.price}</span>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600">
                          Mulai Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Skills Analysis Tab */}
            <TabsContent value="skills" className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Analisis Skill Gap</h2>

              <div className="grid gap-4 md:gap-6">
                {mockSkillGaps.map((skill, index) => (
                  <Card key={index} className="border-sky-100">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 space-y-2 md:space-y-0">
                        <div>
                          <h3 className="text-base md:text-lg font-semibold text-gray-800">{skill.skill}</h3>
                          <Badge
                            className={`mt-1 text-xs ${
                              skill.priority === "High"
                                ? "bg-red-50 text-red-600 border-red-200"
                                : skill.priority === "Medium"
                                  ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                                  : "bg-gray-50 text-gray-600 border-gray-200"
                            }`}
                          >
                            {skill.priority} Priority
                          </Badge>
                        </div>
                        <div className="text-left md:text-right">
                          <div className="text-sm text-gray-600">Current: {skill.current}%</div>
                          <div className="text-sm text-gray-600">Target: {skill.target}%</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {skill.current}% / {skill.target}%
                          </span>
                        </div>
                        <Progress value={(skill.current / skill.target) * 100} className="h-2" />
                        <div className="text-sm text-gray-600">
                          Gap: {skill.target - skill.current}% to reach target
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Roadmap Tab */}
            <TabsContent value="roadmap" className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Learning Roadmap</h2>

              <Card className="border-sky-100">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Roadmap: Menjadi Senior Full Stack Developer</CardTitle>
                  <CardDescription>Rencana pembelajaran 6 bulan untuk mencapai target karir Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        phase: "Phase 1 (Month 1-2)",
                        title: "Frontend Mastery",
                        skills: ["Advanced React", "TypeScript", "State Management"],
                        status: "In Progress",
                      },
                      {
                        phase: "Phase 2 (Month 3-4)",
                        title: "Backend & Database",
                        skills: ["Node.js Advanced", "Database Design", "API Architecture"],
                        status: "Upcoming",
                      },
                      {
                        phase: "Phase 3 (Month 5-6)",
                        title: "System Design & Leadership",
                        skills: ["System Architecture", "Team Leadership", "DevOps Basics"],
                        status: "Planned",
                      },
                    ].map((phase, index) => (
                      <div key={index} className="border-l-4 border-sky-300 pl-4 md:pl-6 py-4">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 space-y-2 md:space-y-0">
                          <h4 className="font-semibold text-gray-800 text-sm md:text-base">{phase.phase}</h4>
                          <Badge
                            className={`text-xs ${
                              phase.status === "In Progress"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : phase.status === "Upcoming"
                                  ? "bg-sky-50 text-sky-600 border-sky-200"
                                  : "bg-gray-50 text-gray-600 border-gray-200"
                            }`}
                          >
                            {phase.status}
                          </Badge>
                        </div>
                        <h5 className="text-base md:text-lg font-medium text-sky-700 mb-2">{phase.title}</h5>
                        <div className="flex flex-wrap gap-2">
                          {phase.skills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="outline" className="border-sky-200 text-sky-600 text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-sky-100">
                    <Button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600">
                      <BookOpen className="mr-2 w-4 h-4" />
                      Mulai Learning Path
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
