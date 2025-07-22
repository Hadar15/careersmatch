// Random comment: Dashboard page random comment for push
"use client"
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { getUserProfile, mockJobListings, mockCourses, mockSkillGaps, type UserProfile } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, MapPin, DollarSign, User, BookOpen, Clock, ArrowRight, Star, Upload, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js" // Kept from 'toriq' branch
import { formatJobType } from "@/lib/utils" // Kept from 'main' branch

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      // Check if the cached profile matches the current user
      let userProfile = null;
      try {
        userProfile = getUserProfile();
      } catch {}
      if (
        userProfile &&
        (userProfile.id !== user.id || userProfile.email !== user.email)
      ) {
        // Clear local profile if it doesn't match the logged-in user
        localStorage.removeItem("userProfile");
        userProfile = null;
      }
      // Set profile with fallback to local profile for extra fields
      setProfile({
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || user.email?.split("@")?.[0] || "User",
        phone: userProfile?.phone || null,
        location: userProfile?.location || null,
        professional_summary: userProfile?.professional_summary || null,
        experience_years: userProfile?.experience_years || null,
        mbti_type: userProfile?.mbti_type || null,
        profile_completion: userProfile?.profile_completion || 20,
      });
      setLoading(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    console.log("Logout button clicked");
    await signOut();
    // Fallback: force reload in case signOut does not reload
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    }
  }

  // Get top 3 job matches
  const topJobMatches = mockJobListings.slice(0, 3)

  // Get top 3 courses
  const topCourses = mockCourses.slice(0, 3)

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
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                CareerMatch AI
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/upload-cv">
                <Button variant="outline" className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent">
                  <Upload className="mr-2 w-4 h-4" />
                  Upload CV
                </Button>
              </Link>
              <Link href="/mbti-test">
                <Button
                  variant="outline"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                >
                  <Brain className="mr-2 w-4 h-4" />
                  Tes MBTI
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

            {/* Mobile Menu */}
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
        </header>

        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Welcome Section */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Selamat Datang, {user?.user_metadata?.full_name || user?.email?.split("@")?.[0] || "User"}!
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

          {/* Profile Overview */}
          <Card className="mb-6 md:mb-8 border-sky-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-sky-600" />
                <span>Profile Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm md:text-lg">{profile?.mbti_type || "N/A"}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">Personality Type</p>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold text-sky-600 mb-1">
                    {profile?.experience_years || 0} th
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">Pengalaman</p>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold text-emerald-600 mb-1">5</div>
                  <p className="text-xs md:text-sm text-gray-600">Skills</p>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold text-sky-600 mb-1">
                    {profile?.profile_completion || 0}%
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">Profile Complete</p>
                  <Progress value={profile?.profile_completion || 0} className="mt-2 h-1 md:h-2" />
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
                              {formatJobType(job.type)}
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
                          {job.skills.map((skill: string, index: number) => (
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