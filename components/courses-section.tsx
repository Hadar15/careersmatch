"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CourseCard } from "@/components/course-card"
import type { Course } from "@/app/api/courses/classcentral/route"
import { BookOpen, ArrowRight, Loader2, RefreshCw, Filter, GraduationCap, Star, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  const [dataSource, setDataSource] = useState<'classcentral' | 'mock' | 'fallback' | null>(null)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      setIsUsingMockData(false)
      setDataSource(null)

      const response = await fetch('/api/courses/classcentral')
      const data = await response.json()

      // Check data source from API response
      if (data.dataSource && data.dataSource !== 'mock' && data.dataSource !== 'fallback') {
        setDataSource('classcentral')
        console.log("✅ Successfully fetched courses from Class Central API:", data.courses.length, "courses")
        console.log("📡 Data source:", data.dataSource)
      } else if (data.dataSource === 'fallback') {
        setDataSource('fallback')
        setIsUsingMockData(true)
        setError("Tidak dapat mengakses Class Central API. Menampilkan data contoh.")
        console.log("⚠️ Using fallback data - API returned fallback data")
      } else {
        setDataSource('mock')
        setIsUsingMockData(true)
        console.log("⚠️ Using mock data - API returned mock data")
      }

      setCourses(data.courses)
    } catch (err) {
      console.error("❌ Error fetching courses:", err)
      
      // Use enhanced mock data as fallback
      const mockCourses: Course[] = [
        {
          id: "course-1-error",
          title: "CS50's Introduction to Computer Science",
          link: "https://www.classcentral.com/course/edx-cs50s-introduction-to-computer-science-9656",
          pubDate: new Date().toISOString(),
          contentSnippet: "An introduction to the intellectual enterprises of computer science and the art of programming.",
          category: "Computer Science",
          provider: "Harvard University"
        },
        {
          id: "course-2-error",
          title: "Machine Learning by Stanford University",
          link: "https://www.classcentral.com/course/coursera-machine-learning-835",
          pubDate: new Date(Date.now() - 86400000).toISOString(),
          contentSnippet: "Learn about machine learning algorithms and their applications in real-world scenarios.",
          category: "Artificial Intelligence",
          provider: "Stanford University"
        },
        {
          id: "course-3-error",
          title: "The Complete Web Developer Bootcamp",
          link: "https://www.classcentral.com/course/udemy-the-complete-web-developer-bootcamp-12345",
          pubDate: new Date(Date.now() - 172800000).toISOString(),
          contentSnippet: "Learn web development from scratch with HTML, CSS, JavaScript, and modern frameworks.",
          category: "Web Development",
          provider: "Udemy"
        },
        {
          id: "course-4-error",
          title: "Data Science: Machine Learning",
          link: "https://www.classcentral.com/course/edx-data-science-machine-learning-6789",
          pubDate: new Date(Date.now() - 259200000).toISOString(),
          contentSnippet: "Build a movie recommendation system and learn the science behind one of the most popular and successful data science techniques.",
          category: "Data Science",
          provider: "MIT"
        },
        {
          id: "course-5-error",
          title: "Python for Everybody",
          link: "https://www.classcentral.com/course/coursera-python-for-everybody-2345",
          pubDate: new Date(Date.now() - 345600000).toISOString(),
          contentSnippet: "Learn to program and analyze data with Python. Develop programs to gather, clean, analyze, and visualize data.",
          category: "Programming",
          provider: "University of Michigan"
        },
        {
          id: "course-6-error",
          title: "Introduction to Cybersecurity",
          link: "https://www.classcentral.com/course/edx-introduction-to-cybersecurity-3456",
          pubDate: new Date(Date.now() - 432000000).toISOString(),
          contentSnippet: "Learn the basics of cybersecurity, network security, and ethical hacking principles.",
          category: "Cybersecurity",
          provider: "Coursera"
        }
      ];
      
      setCourses(mockCourses)
      setIsUsingMockData(true)
      setDataSource('fallback')
      setError("Tidak dapat mengakses Class Central API. Menampilkan data contoh.")
      console.log("⚠️ Using fallback mock data due to API error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleRefresh = () => {
    fetchCourses()
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-white/60 backdrop-blur-sm">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-emerald-50 to-sky-50 text-emerald-700 border-emerald-200 px-4 sm:px-6 py-2 sm:py-3 font-medium">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Free Courses from Class Central
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            Latest Online Courses
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 font-medium leading-relaxed">
            Discover amazing free courses from top universities and platforms worldwide
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="w-full sm:w-auto border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              <RefreshCw className="mr-2 w-4 h-4" />
              Refresh Courses
            </Button>
            <Link href="/mbti-test" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600">
                <Filter className="mr-2 w-4 h-4" />
                Find Your Path
              </Button>
            </Link>
          </div>
        </div>

        {/* Compact Courses Container */}
        <div className="max-w-6xl mx-auto">
          <Card className="border-emerald-100 bg-white/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-4 sm:p-6">
              {/* Error Message - Always show if there's an error */}
              {error && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center text-yellow-800">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mr-2" />
                  Available Courses
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Badge variant="outline" className="border-gray-200 text-gray-600 text-xs sm:text-sm">
                    {courses.length} Courses Available
                  </Badge>
                  {dataSource === 'classcentral' ? (
                    <Badge variant="outline" className="border-green-200 text-green-600 flex items-center text-xs sm:text-sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Live Data
                    </Badge>
                  ) : dataSource === 'fallback' ? (
                    <Badge variant="outline" className="border-orange-200 text-orange-600 flex items-center text-xs sm:text-sm">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Enhanced Demo
                    </Badge>
                  ) : dataSource === 'mock' ? (
                    <Badge variant="outline" className="border-yellow-200 text-yellow-600 flex items-center text-xs sm:text-sm">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Demo Data
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-gray-200 text-gray-500 flex items-center text-xs sm:text-sm">
                      Unknown Source
                    </Badge>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Loading Courses from Class Central</h3>
                  <p className="text-sm sm:text-base text-gray-600">Fetching the latest courses for you...</p>
                </div>
              ) : (
                /* Courses Grid - Responsive with better mobile layout */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-gray-100">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-emerald-300 transition-colors hover:shadow-md">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-800 text-xs sm:text-sm line-clamp-2 flex-1 mr-2">{course.title}</h4>
                        <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-600 shrink-0">
                          Free
                        </Badge>
                      </div>
                      <p className="text-emerald-600 font-medium text-xs mb-2">{course.provider}</p>
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <span className="flex items-center">
                          🎓 {course.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {new Date(course.pubDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <Button
                          size="sm"
                          className="text-xs bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white px-2 py-1 h-6"
                          onClick={() => window.open(course.link, '_blank')}
                        >
                          View
                          <ArrowRight className="ml-1 w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View All Courses Button */}
              <div className="text-center mt-6">
                <Link href="/mbti-test">
                  <Button className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white shadow-lg">
                    Find Your Perfect Course
                    <ArrowRight className="ml-2 w-4 h-4" />
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