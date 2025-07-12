"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Building, Clock, ExternalLink, Heart, Star } from "lucide-react"
import type { RemotiveJob } from "@/lib/remotive-api"
import { useState } from "react"

interface JobCardProps {
  job: RemotiveJob
  compact?: boolean
}

export function JobCard({ job, compact = false }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const handleSaveJob = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(job.url, "_blank")
  }

  if (compact) {
    return (
      <Card className="border-sky-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4 flex-1">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                {job.company_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-bold text-lg text-gray-800 truncate">{job.title}</h3>
                </div>
                <p className="text-sky-600 font-semibold mb-2">{job.company_name}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.candidate_required_location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{job.job_type}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveJob}
              className={`${
                isSaved ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
              } hover:bg-red-50 shrink-0`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(job.publication_date)}</span>
              </div>
            </div>
            <Button
              onClick={handleApply}
              className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg"
            >
              Apply Now
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Full card version for detailed view
  return (
    <Card className="border-sky-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 backdrop-blur-sm group">
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {job.company_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="text-2xl font-bold text-gray-800">{job.title}</h3>
              </div>
              <p className="text-sky-600 font-semibold text-lg mb-4">{job.company_name}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{job.candidate_required_location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>{job.job_type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(job.publication_date)}</span>
                </div>
              </div>

              {job.description && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Job Description</h4>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {job.description}
                  </p>
                </div>
              )}

              {job.tags && job.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Skills & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.slice(0, 6).map((tag, index) => (
                      <Badge key={index} className="bg-sky-50 text-sky-700 border-sky-200 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {job.tags.length > 6 && (
                      <Badge variant="outline" className="border-gray-200 text-gray-600 text-xs">
                        +{job.tags.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleSaveJob}
              className={`${
                isSaved ? "border-red-200 text-red-600 bg-red-50" : "border-gray-200 text-gray-600"
              } hover:bg-gray-50`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Saved" : "Save Job"}
            </Button>
          </div>
          <Button
            onClick={handleApply}
            className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg px-8"
          >
            Apply Now
            <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

