"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { JobCard } from "@/components/job-card"
import { talenticsAPI, type TalenticsJob } from "@/lib/talentics-api"
import { Briefcase, ArrowRight, Loader2, RefreshCw, Filter, Building, Star } from "lucide-react"
import Link from "next/link"

export function JobsSection() {
  const [jobs, setJobs] = useState<TalenticsJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [featuredJobs, setFeaturedJobs] = useState<TalenticsJob[]>([])
  const [regularJobs, setRegularJobs] = useState<TalenticsJob[]>([])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all jobs
      const response = await talenticsAPI.getJobs({
        per_page: 20,
      })

      // Separate featured and regular jobs
      const featured = response.jobs.filter((job) => job.featured)
      const regular = response.jobs.filter((job) => !job.featured)

      setFeaturedJobs(featured)
      setRegularJobs(regular)
      setJobs(response.jobs)
    } catch (err) {
      setError("Failed to load jobs from Talentics")
      console.error("Error fetching jobs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleRefresh = () => {
    fetchJobs()
  }

  if (loading) {
    return (
      <section className="py-16 md:py-20 px-4 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Jobs from Talentics</h2>
            <p className="text-gray-600">Fetching the latest job opportunities for you...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 md:py-20 px-4 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto">
          <Card className="border-red-200 bg-red-50/50 max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-800 mb-2">Unable to Load Jobs</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={handleRefresh}
                className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600"
              >
                <RefreshCw className="mr-2 w-4 h-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-20 px-4 bg-white/60 backdrop-blur-sm">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 border-sky-200 px-6 py-3 font-medium">
            <Briefcase className="w-5 h-5 mr-2" />
            Live Jobs from Talentics
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
            Latest Job Opportunities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto px-4 font-medium leading-relaxed">
            Discover amazing career opportunities from Indonesia's top companies, powered by Talentics
          </p>

          <div className="flex items-center justify-center space-x-4 mt-6">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent"
            >
              <RefreshCw className="mr-2 w-4 h-4" />
              Refresh Jobs
            </Button>
            <Link href="/job-matching">
              <Button className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600">
                <Filter className="mr-2 w-4 h-4" />
                Advanced Search
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Jobs */}
        {featuredJobs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <Star className="w-6 h-6 text-sky-600 mr-2" />
                Featured Jobs
              </h3>
              <Badge className="bg-gradient-to-r from-sky-100 to-emerald-100 text-sky-700 border-sky-200 px-3 py-1">
                {featuredJobs.length} Featured
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} compact />
              ))}
            </div>
          </div>
        )}

        {/* Job Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm text-center p-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {jobs.length}
            </div>
            <p className="text-gray-600 font-medium">Total Jobs</p>
          </Card>

          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm text-center p-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-2">
              {new Set(jobs.map((job) => job.company.name)).size}
            </div>
            <p className="text-gray-600 font-medium">Companies</p>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm text-center p-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {new Set(jobs.map((job) => job.location.city)).size}
            </div>
            <p className="text-gray-600 font-medium">Cities</p>
          </Card>

          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm text-center p-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent mb-2">
              {jobs.filter((job) => job.location.remote).length}
            </div>
            <p className="text-gray-600 font-medium">Remote Jobs</p>
          </Card>
        </div>

        {/* All Jobs Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <Building className="w-6 h-6 text-emerald-600 mr-2" />
              All Opportunities
            </h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-gray-200 text-gray-600">
                Updated from Talentics API
              </Badge>
            </div>
          </div>

          {/* Jobs Grid - Scrollable */}
          <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-sky-200 scrollbar-track-gray-100">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} compact />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border-sky-100 bg-gradient-to-r from-sky-50 to-emerald-50 p-8">
            <CardContent className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                Ready to Find Your Dream Job?
              </h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Join thousands of professionals who found their perfect career match through our AI-powered platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 px-8 py-3"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/job-matching">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-sky-200 text-sky-600 hover:bg-sky-50 px-8 py-3 bg-transparent"
                  >
                    Browse All Jobs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
