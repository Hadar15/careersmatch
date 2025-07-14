import { NextRequest, NextResponse } from "next/server"

// Mock job data - in real app this would come from a database or external API
const mockJobs = [
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
    description: "Build revolutionary products that impact millions of Indonesian users with cutting-edge technology...",
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
    description: "Lead a team of talented developers in creating innovative enterprise solutions for Indonesian businesses...",
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
    description: "Create amazing user experiences for millions of customers across Indonesia's largest e-commerce platform...",
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
    description: "Build scalable backend systems for cloud infrastructure serving enterprise clients across Southeast Asia...",
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
    description: "Develop cutting-edge AI solutions for Indonesian businesses and contribute to the future of technology...",
    skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning"],
    benefits: ["Research Budget", "Conference Attendance", "Health Insurance", "Innovation Time"],
    posted: "4 days ago",
    applicants: 19,
    companySize: "50-100",
    industry: "Artificial Intelligence",
    featured: true,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const location = searchParams.get("location") || ""
    const type = searchParams.get("type") || ""
    const industry = searchParams.get("industry") || ""
    const skills = searchParams.get("skills") || ""
    const limit = parseInt(searchParams.get("limit") || "10")

    // Filter jobs based on search parameters
    let filteredJobs = mockJobs

    if (query) {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.company.toLowerCase().includes(query.toLowerCase()) ||
          job.description.toLowerCase().includes(query.toLowerCase()) ||
          job.skills.some((skill) => skill.toLowerCase().includes(query.toLowerCase()))
      )
    }

    if (location && location !== "All") {
      filteredJobs = filteredJobs.filter((job) => job.location === location)
    }

    if (type && type !== "All") {
      filteredJobs = filteredJobs.filter((job) => job.type === type)
    }

    if (industry && industry !== "All") {
      filteredJobs = filteredJobs.filter((job) => job.industry === industry)
    }

    if (skills) {
      const skillList = skills.split(",").map((skill) => skill.trim().toLowerCase())
      filteredJobs = filteredJobs.filter((job) =>
        job.skills.some((jobSkill) => skillList.includes(jobSkill.toLowerCase()))
      )
    }

    // Sort by match percentage and featured status
    filteredJobs.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.match - a.match
    })

    // Apply limit
    const limitedJobs = filteredJobs.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: limitedJobs,
      total: filteredJobs.length,
      limit,
      query: {
        q: query,
        location,
        type,
        industry,
        skills,
      },
    })
  } catch (error) {
    console.error("Error searching jobs:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search jobs",
      },
      { status: 500 }
    )
  }
} 