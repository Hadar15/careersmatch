"use client"

import { useState, useEffect } from "react"
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
import { formatJobType } from "@/lib/utils"
import { remotiveAPI, type RemotiveJob } from "@/lib/remotive-api"

export default function JobMatchingPage() {
  const [jobs, setJobs] = useState<RemotiveJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [industryFilter, setIndustryFilter] = useState("All")
  const [salaryRange, setSalaryRange] = useState([10])
  const [savedJobs, setSavedJobs] = useState<number[]>([])

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await remotiveAPI.getJobs()
        setJobs(response.jobs)
      } catch (err) {
        setError("Gagal memuat data pekerjaan.")
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = locationFilter === "All" || job.candidate_required_location.includes(locationFilter)
    const matchesType = typeFilter === "All" || formatJobType(job.job_type) === typeFilter
    return matchesSearch && matchesLocation && matchesType
  })

  const sortedJobs = filteredJobs

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Loading Jobs...</h2>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">{error}</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-3 leading-tight pb-2">
            Job Matching Results
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            {filteredJobs.length} pekerjaan ditemukan berdasarkan data yang sama dengan landing page
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
                className="group relative overflow-hidden rounded-3xl border-0 bg-white/80 backdrop-blur-md shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-emerald-200/60 hover:ring-2 hover:ring-sky-200"
              >
                {/* Gradient bar at top */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-200/60 via-emerald-200/60 to-white" />
                <CardContent className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-4">
                    {/* Logo or Initial */}
                    <div className="flex items-center gap-4 flex-1">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-1 drop-shadow-sm">
                          {job.title}
                        </h3>
                        <Badge className="bg-gradient-to-r from-sky-100 to-emerald-100 text-sky-700 border-sky-200 px-3 py-1 font-semibold text-sm">
                          <Building className="w-4 h-4 mr-1 inline-block" />
                          {job.company_name}
                        </Badge>
                      </div>
                    </div>
                    {/* Save Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaveJob(job.id)}
                      className={`transition-all duration-300 shadow-none border-2 border-transparent hover:border-red-200 hover:bg-red-50 ${
                        savedJobs.includes(job.id)
                          ? "text-red-500 bg-red-50 border-red-200 scale-110"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                      title={savedJobs.includes(job.id) ? "Hapus dari Favorit" : "Simpan Pekerjaan"}
                    >
                      <Heart className={`w-7 h-7 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                  {/* Info Badges */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <Badge className="bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 border-sky-200 px-3 py-1 font-medium">
                      <MapPin className="w-4 h-4 mr-1 inline-block" />
                      {job.candidate_required_location}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-emerald-50 to-sky-50 text-emerald-700 border-emerald-200 px-3 py-1 font-medium">
                      <Briefcase className="w-4 h-4 mr-1 inline-block" />
                      {formatJobType(job.job_type)}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 border-sky-200 px-3 py-1 font-medium">
                      <Clock className="w-4 h-4 mr-1 inline-block" />
                      {job.publication_date}
                    </Badge>
                    {job.salary && (
                      <Badge className="bg-gradient-to-r from-emerald-50 to-sky-50 text-emerald-700 border-emerald-200 px-3 py-1 font-medium">
                        <DollarSign className="w-4 h-4 mr-1 inline-block" />
                        {job.salary}
                      </Badge>
                    )}
                  </div>
                  {/* Action Button */}
                  <div className="flex items-center justify-end pt-6 border-t border-sky-100">
                    <Button
                      className="rounded-full px-8 py-3 text-lg font-bold bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 shadow-lg transition-all duration-300 hover:scale-105"
                      onClick={() => window.open(job.url, '_blank')}
                    >
                      Lamar Sekarang
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
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
