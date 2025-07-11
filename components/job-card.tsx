"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Building, Clock, DollarSign, ExternalLink, Heart, Star, Users, Calendar } from "lucide-react"
import type { TalenticsJob } from "@/lib/talentics-api"
import { useState } from "react"
import Link from "next/link"

interface JobCardProps {
  job: TalenticsJob
  compact?: boolean
}

export function JobCard({ job, compact = false }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  const formatSalary = (salary: TalenticsJob["salary"]) => {
    if (!salary) return "Salary not specified"

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat("id-ID").format(num / 1000000)
    }

    if (salary.min && salary.max) {
      return `Rp ${formatNumber(salary.min)}-${formatNumber(salary.max)} juta`
    } else if (salary.min) {
      return `Rp ${formatNumber(salary.min)}+ juta`
    }
    return "Competitive salary"
  }

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
    window.open(job.application_url, "_blank")
  }

  if (compact) {
    return (
      <Card className="border-sky-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4 flex-1">
              {job.company.logo && (
                <img
                  src={job.company.logo || "/placeholder.svg"}
                  alt={job.company.name}
                  className="w-12 h-12 rounded-lg object-cover border border-sky-100"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-bold text-lg text-gray-800 truncate">{job.title}</h3>
                  {job.featured && (
                    <Badge className="bg-gradient-to-r from-sky-100 to-emerald-100 text-sky-700 border-sky-200 px-2 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sky-600 font-semibold mb-2">{job.company.name}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location.city}</span>
                    {job.location.remote && (
                      <Badge variant="outline" className="border-emerald-200 text-emerald-600 ml-1">
                        Remote
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{job.employment_type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatSalary(job.salary)}</span>
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

          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} className="bg-sky-50 text-sky-700 border-sky-200 text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="outline" className="border-gray-200 text-gray-600 text-xs">
                +{job.skills.length - 4} more
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(job.posted_date)}</span>
              </div>
              {job.company.size && (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{job.company.size} employees</span>
                </div>
              )}
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
            {job.company.logo && (
              <img
                src={job.company.logo || "/placeholder.svg"}
                alt={job.company.name}
                className="w-16 h-16 rounded-xl object-cover border border-sky-100 shadow-lg"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="text-2xl font-bold text-gray-800">{job.title}</h3>
                {job.featured && (
                  <Badge className="bg-gradient-to-r from-sky-100 to-emerald-100 text-sky-700 border-sky-200 px-3 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-sky-600 font-semibold text-lg mb-4">{job.company.name}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {job.location.city}, {job.location.country}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>{job.employment_type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(job.posted_date)}</span>
                </div>
              </div>

              {job.location.remote && (
                <Badge className="bg-gradient-to-r from-emerald-50 to-sky-50 text-emerald-700 border-emerald-200 mb-4">
                  Remote Work Available
                </Badge>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSaveJob}
            className={`${
              isSaved ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
            } hover:bg-red-50`}
          >
            <Heart className={`w-6 h-6 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>

        <p className="text-gray-600 mb-6 leading-relaxed">{job.description}</p>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Required Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <Badge key={index} className="bg-sky-50 text-sky-700 border-sky-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Benefits:</h4>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="border-emerald-200 text-emerald-700">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-sky-100">
          <div className="flex items-center space-x-4">
            <Badge className="bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 border-sky-200">
              {job.company.industry}
            </Badge>
            <Badge variant="outline" className="border-gray-200 text-gray-600">
              {job.experience_level}
            </Badge>
            {job.application_deadline && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Deadline: {new Date(job.application_deadline).toLocaleDateString("id-ID")}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Link href={`/jobs/${job.id}`}>
              <Button variant="outline" className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent">
                View Details
              </Button>
            </Link>
            <Button
              onClick={handleApply}
              className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-lg"
            >
              Apply Now
              <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
