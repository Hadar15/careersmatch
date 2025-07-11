"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Brain,
  MapPin,
  DollarSign,
  Clock,
  Building,
  Users,
  Filter,
  Search,
  Heart,
  ExternalLink,
  Briefcase,
  Star,
  TrendingUp,
  Shield,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const jobListings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Indonesia",
    location: "Jakarta",
    type: "Full-time",
    experience: "3-5 years",
    salary: "Rp 15-25 juta",
    match: 95,
    description: "Join our development team building next-generation fintech solutions for Indonesian market...",
    skills: ["React", "JavaScript", "TypeScript", "Next.js", "Tailwind CSS"],
    benefits: ["Health Insurance", "Remote Work", "Learning Budget", "Stock Options"],
    posted: "2 days ago",
    applicants: 45,
    companySize: "100-500",
    industry: "Technology",
    featured: true,
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Bandung",
    type: "Remote",
    experience: "2-4 years",
    salary: "Rp 12-20 juta",
    match: 88,
    description:
      "Build revolutionary products that impact millions of Indonesian users with cutting-edge technology...",
    skills: ["Node.js", "React", "MongoDB", "Express", "AWS"],
    benefits: ["Equity Package", "Flexible Hours", "Health Insurance", "Startup Culture"],
    posted: "1 week ago",
    applicants: 32,
    companySize: "10-50",
    industry: "Fintech",
    featured: false,
  },
  {
    id: 3,
    title: "Technical Lead",
    company: "Digital Solutions",
    location: "Surabaya",
    type: "Hybrid",
    experience: "5-7 years",
    salary: "Rp 20-30 juta",
    match: 82,
    description:
      "Lead a team of talented developers in creating innovative enterprise solutions for Indonesian businesses...",
    skills: ["Leadership", "JavaScript", "System Design", "Team Management"],
    benefits: ["Leadership Training", "Health Insurance", "Performance Bonus", "Career Growth"],
    posted: "3 days ago",
    applicants: 28,
    companySize: "500+",
    industry: "Consulting",
    featured: true,
  },
  {
    id: 4,
    title: "React Developer",
    company: "E-commerce Giant",
    location: "Jakarta",
    type: "Full-time",
    experience: "1-3 years",
    salary: "Rp 10-18 juta",
    match: 78,
    description:
      "Create amazing user experiences for millions of customers across Indonesia's largest e-commerce platform...",
    skills: ["React", "Redux", "JavaScript", "CSS", "Testing"],
    benefits: ["Employee Discount", "Health Insurance", "Career Growth", "Training Programs"],
    posted: "5 days ago",
    applicants: 67,
    companySize: "1000+",
    industry: "E-commerce",
    featured: false,
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "Cloud Services Inc",
    location: "Remote",
    type: "Full-time",
    experience: "2-5 years",
    salary: "Rp 14-22 juta",
    match: 75,
    description:
      "Build scalable backend systems for cloud infrastructure serving enterprise clients across Southeast Asia...",
    skills: ["Python", "Django", "PostgreSQL", "Docker", "Kubernetes"],
    benefits: ["Remote Work", "Learning Budget", "Health Insurance", "Tech Allowance"],
    posted: "1 day ago",
    applicants: 23,
    companySize: "200-500",
    industry: "Cloud Computing",
    featured: false,
  },
  {
    id: 6,
    title: "AI/ML Engineer",
    company: "InnovateAI",
    location: "Jakarta",
    type: "Full-time",
    experience: "3-6 years",
    salary: "Rp 18-28 juta",
    match: 92,
    description:
      "Develop cutting-edge AI solutions for Indonesian businesses and contribute to the future of technology...",
    skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning"],
    benefits: ["Research Budget", "Conference Attendance", "Health Insurance", "Innovation Time"],
    posted: "4 days ago",
    applicants: 19,
    companySize: "50-100",
    industry: "Artificial Intelligence",
    featured: true,
  },
]

export default function JobMatchingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [industryFilter, setIndustryFilter] = useState("All")
  const [salaryRange, setSalaryRange] = useState([10])
  const [savedJobs, setSavedJobs] = useState<number[]>([])

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLocation = locationFilter === "All" || job.location === locationFilter
    const matchesType = typeFilter === "All" || job.type === typeFilter
    const matchesIndustry = industryFilter === "All" || job.industry === industryFilter

    return matchesSearch && matchesLocation && matchesType && matchesIndustry
  })

  // Sort by match percentage and featured status
  const sortedJobs = filteredJobs.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return b.match - a.match
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
      {/* Header */}
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
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
              <Button
                variant="outline"
                className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-white/80 backdrop-blur-sm font-medium"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/profile">
              <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg font-medium">
                Profile
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
              <Star className="w-4 h-4 mr-1" />
              AI Smart Matching
            </Badge>
            <Badge className="bg-gradient-to-r from-emerald-50 to-sky-50 text-emerald-700 border-emerald-200 px-4 py-2 font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              98% Akurasi
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            Job Matching Results
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            {filteredJobs.length} pekerjaan ditemukan berdasarkan analisis AI mendalam profil Anda
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-sky-100 sticky top-24 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Filter className="w-6 h-6 text-sky-600" />
                  <span>Filter Pekerjaan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Cari Pekerjaan</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Posisi, perusahaan, atau skill..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-sky-200 focus:border-sky-400 bg-white/90"
                    />
                  </div>
                </div>

                {/* Location Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Lokasi</label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="border-sky-200 focus:border-sky-400 bg-white/90">
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Semua Lokasi</SelectItem>
                      <SelectItem value="Jakarta">Jakarta</SelectItem>
                      <SelectItem value="Bandung">Bandung</SelectItem>
                      <SelectItem value="Surabaya">Surabaya</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Job Type Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Tipe Pekerjaan</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="border-sky-200 focus:border-sky-400 bg-white/90">
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Semua Tipe</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Industry Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Industri</label>
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger className="border-sky-200 focus:border-sky-400 bg-white/90">
                      <SelectValue placeholder="Pilih industri" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Semua Industri</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Fintech">Fintech</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Consulting">Consulting</SelectItem>
                      <SelectItem value="Artificial Intelligence">AI/ML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Salary Range */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Gaji Minimum (Juta Rupiah)</label>
                  <Slider
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    max={50}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600 font-medium">Minimal Rp {salaryRange[0]} juta</div>
                </div>

                <Button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg font-medium">
                  <Filter className="mr-2 w-4 h-4" />
                  Terapkan Filter
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-lg">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Hasil Matching AI</h2>
                <p className="text-gray-600">Diurutkan berdasarkan tingkat kecocokan dengan profil Anda</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-gradient-to-r from-emerald-50 to-sky-50 text-emerald-700 border-emerald-200 px-3 py-1 font-medium">
                  <Shield className="w-4 h-4 mr-1" />
                  Verified Jobs
                </Badge>
              </div>
            </div>

            {sortedJobs.map((job) => (
              <Card
                key={job.id}
                className={`border-sky-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-white/90 backdrop-blur-sm ${job.featured ? "ring-2 ring-sky-200 bg-gradient-to-r from-sky-50/50 to-emerald-50/50" : ""}`}
              >
                <CardContent className="p-8">
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-2xl font-bold text-gray-800">{job.title}</h3>
                        {job.featured && (
                          <Badge className="bg-gradient-to-r from-sky-100 to-emerald-100 text-sky-700 border-sky-200 px-2 py-1 font-medium">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 mb-4">
                        <Building className="w-5 h-5 text-sky-600" />
                        <span className="text-sky-700 font-semibold text-lg">{job.company}</span>
                        <Badge variant="outline" className="border-sky-200 text-sky-600 font-medium">
                          {job.companySize} employees
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium">{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-medium">{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium">{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{job.posted}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{job.applicants} applicants</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6 text-lg leading-relaxed">{job.description}</p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} className="bg-sky-50 text-sky-700 border-sky-200 px-3 py-1 font-medium">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {/* Benefits */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {job.benefits.map((benefit, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-emerald-200 text-emerald-700 px-3 py-1 font-medium"
                          >
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-1">
                          {job.match}%
                        </div>
                        <Badge className="bg-gradient-to-r from-emerald-50 to-sky-50 text-emerald-700 border-emerald-200 font-medium">
                          AI Match
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSaveJob(job.id)}
                        className={`${
                          savedJobs.includes(job.id)
                            ? "text-red-500 hover:text-red-600"
                            : "text-gray-400 hover:text-red-500"
                        } hover:bg-red-50`}
                      >
                        <Heart className={`w-6 h-6 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-sky-100">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 border-sky-200 px-3 py-1 font-medium">
                        {job.industry}
                      </Badge>
                      <Badge variant="outline" className="border-gray-200 text-gray-600 px-3 py-1 font-medium">
                        {job.experience}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-white/90 font-medium"
                      >
                        Lihat Detail
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </Button>
                      <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg font-medium">
                        Lamar Sekarang
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {sortedJobs.length === 0 && (
              <Card className="border-sky-100 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Tidak ada pekerjaan ditemukan</h3>
                  <p className="text-gray-600 mb-6 text-lg">Coba ubah filter pencarian atau kata kunci Anda</p>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setLocationFilter("All")
                      setTypeFilter("All")
                      setIndustryFilter("All")
                      setSalaryRange([10])
                    }}
                    className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg font-medium"
                  >
                    Reset Filter
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
