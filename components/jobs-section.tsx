"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { JobCard } from "@/components/job-card"
import { remotiveAPI, type RemotiveJob } from "@/lib/remotive-api"
import { Briefcase, ArrowRight, Loader2, RefreshCw, Filter, Building, Star, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export function JobsSection() {
  const [jobs, setJobs] = useState<RemotiveJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  const [dataSource, setDataSource] = useState<'remotive' | 'mock' | null>(null)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      setIsUsingMockData(false)
      setDataSource(null)

      // Fetch all jobs without search filter to get all available jobs
      const response = await remotiveAPI.getJobs()

      // Check if this is actually from Remotive API or fallback mock data
      const isRealRemotiveData = response.jobs.some(job => 
        job.url && 
        !job.url.includes('example.com') && 
        job.company_name && 
        !job.company_name.includes('Indonesia') &&
        job.id > 1000 // Real Remotive jobs typically have higher IDs
      )

      if (isRealRemotiveData) {
        setDataSource('remotive')
        console.log("✅ Successfully fetched jobs from Remotive API:", response.jobs.length, "jobs")
      } else {
        setDataSource('mock')
        setIsUsingMockData(true)
        console.log("⚠️ Using fallback mock data - API returned mock data")
      }

      setJobs(response.jobs)
    } catch (err) {
      console.error("❌ Error fetching jobs:", err)
      
      // Use mock data as fallback
      const mockJobs = [
        {
          id: 1,
          title: "Frontend Developer",
          company_name: "TechCorp Indonesia",
          candidate_required_location: "Jakarta, Indonesia",
          job_type: "Full-time",
          publication_date: "2024-01-15",
          url: "https://example.com/job1"
        },
        {
          id: 2,
          title: "Backend Engineer",
          company_name: "Digital Solutions",
          candidate_required_location: "Remote",
          job_type: "Full-time",
          publication_date: "2024-01-14",
          url: "https://example.com/job2"
        },
        {
          id: 3,
          title: "UI/UX Designer",
          company_name: "Creative Studio",
          candidate_required_location: "Bandung, Indonesia",
          job_type: "Contract",
          publication_date: "2024-01-13",
          url: "https://example.com/job3"
        },
        {
          id: 4,
          title: "Data Scientist",
          company_name: "AI Research Lab",
          candidate_required_location: "Surabaya, Indonesia",
          job_type: "Full-time",
          publication_date: "2024-01-12",
          url: "https://example.com/job4"
        },
        {
          id: 5,
          title: "DevOps Engineer",
          company_name: "CloudTech Solutions",
          candidate_required_location: "Remote",
          job_type: "Full-time",
          publication_date: "2024-01-11",
          url: "https://example.com/job5"
        },
        {
          id: 6,
          title: "Product Manager",
          company_name: "Startup Indonesia",
          candidate_required_location: "Jakarta, Indonesia",
          job_type: "Full-time",
          publication_date: "2024-01-10",
          url: "https://example.com/job6"
        }
      ];
      
      setJobs(mockJobs)
      setIsUsingMockData(true)
      setDataSource('mock')
      setError("Tidak dapat mengakses Remotive API. Menampilkan data contoh.")
      console.log("⚠️ Using fallback mock data due to API error")
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Jobs from Remotive</h2>
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
            Live Jobs from Remotive
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
            Latest Job Opportunities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto px-4 font-medium leading-relaxed">
            Discover amazing career opportunities from Indonesia's top companies, powered by Remotive
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

        {/* Compact Jobs Container */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-sky-100 bg-white/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Building className="w-6 h-6 text-emerald-600 mr-2" />
                  Available Positions
                </h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-gray-200 text-gray-600">
                    {jobs.length} Jobs Available
                  </Badge>
                  {dataSource === 'mock' ? (
                    <Badge variant="outline" className="border-yellow-200 text-yellow-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Demo Data
                    </Badge>
                  ) : dataSource === 'remotive' ? (
                    <Badge variant="outline" className="border-green-200 text-green-600 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Live Data
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-gray-200 text-gray-500 flex items-center">
                      Unknown Source
                    </Badge>
                  )}
                </div>
              </div>

              {/* Jobs Grid - Compact with Scroll */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-sky-200 scrollbar-track-gray-100">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-sky-300 transition-colors hover:shadow-md">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 flex-1 mr-2">{job.title}</h4>
                      <Badge variant="outline" className="text-xs border-sky-200 text-sky-600 shrink-0">
                        {job.job_type}
                      </Badge>
                    </div>
                    <p className="text-sky-600 font-medium text-xs mb-2">{job.company_name}</p>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <span className="flex items-center">
                        📍 {job.candidate_required_location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        📅 {new Date(job.publication_date).toLocaleDateString('id-ID')}
                      </span>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-3 py-1 rounded hover:from-sky-600 hover:to-emerald-600 transition-all"
                      >
                        Apply Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {jobs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No jobs available at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
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
                    variant="outline"
                    size="lg"
                    className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent px-8 py-3"
                  >
                    Explore More Jobs
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
