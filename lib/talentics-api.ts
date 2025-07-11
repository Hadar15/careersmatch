// Talentics API integration
export interface TalenticsJob {
  id: string
  title: string
  company: {
    name: string
    logo?: string
    size?: string
    industry?: string
  }
  location: {
    city: string
    country: string
    remote?: boolean
  }
  employment_type: string
  experience_level: string
  salary?: {
    min?: number
    max?: number
    currency: string
    period: string
  }
  description: string
  requirements: string[]
  skills: string[]
  benefits?: string[]
  posted_date: string
  application_deadline?: string
  application_url: string
  featured?: boolean
}

export interface TalenticsApiResponse {
  jobs: TalenticsJob[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

class TalenticsAPI {
  private baseUrl = "https://api.talentics.com/v1"
  private apiKey = process.env.NEXT_PUBLIC_TALENTICS_API_KEY

  async getJobs(params?: {
    page?: number
    per_page?: number
    location?: string
    job_type?: string
    experience_level?: string
    skills?: string[]
    company?: string
    featured?: boolean
  }): Promise<TalenticsApiResponse> {
    try {
      // For demo purposes, always return mock data
      // In production, you would use the real API
      return this.getMockJobs(params)
    } catch (error) {
      console.error("Error fetching jobs from Talentics:", error)
      // Return mock data as fallback
      return this.getMockJobs(params)
    }
  }

  async getJobById(id: string): Promise<TalenticsJob | null> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Talentics API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching job details from Talentics:", error)
      return null
    }
  }

  // Mock data sebagai fallback
  private getMockJobs(params?: any): TalenticsApiResponse {
    const mockJobs: TalenticsJob[] = [
      {
        id: "tal_001",
        title: "Senior Frontend Developer",
        company: {
          name: "TechCorp Indonesia",
          logo: "/placeholder.svg?height=60&width=60",
          size: "100-500",
          industry: "Technology",
        },
        location: {
          city: "Jakarta",
          country: "Indonesia",
          remote: false,
        },
        employment_type: "Full-time",
        experience_level: "Senior",
        salary: {
          min: 15000000,
          max: 25000000,
          currency: "IDR",
          period: "monthly",
        },
        description:
          "Join our elite development team building next-generation fintech solutions for Indonesian market. We are looking for passionate developers who love creating amazing user experiences.",
        requirements: [
          "5+ years experience in React/Next.js",
          "Strong TypeScript skills",
          "Experience with modern CSS frameworks",
          "Knowledge of state management (Redux/Zustand)",
          "Experience with testing frameworks",
        ],
        skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux"],
        benefits: ["Health Insurance", "Remote Work", "Learning Budget", "Stock Options"],
        posted_date: "2024-01-10T08:00:00Z",
        application_deadline: "2024-02-10T23:59:59Z",
        application_url: "https://talentics.com/jobs/tal_001/apply",
        featured: true,
      },
      {
        id: "tal_002",
        title: "Full Stack Developer",
        company: {
          name: "StartupXYZ",
          logo: "/placeholder.svg?height=60&width=60",
          size: "10-50",
          industry: "Fintech",
        },
        location: {
          city: "Bandung",
          country: "Indonesia",
          remote: true,
        },
        employment_type: "Full-time",
        experience_level: "Mid-level",
        salary: {
          min: 12000000,
          max: 20000000,
          currency: "IDR",
          period: "monthly",
        },
        description:
          "Build revolutionary fintech products that impact millions of Indonesian users. Join our fast-growing startup and shape the future of digital payments.",
        requirements: [
          "3+ years full-stack development experience",
          "Proficiency in Node.js and React",
          "Database design experience (MongoDB/PostgreSQL)",
          "API development and integration",
          "Cloud platform experience (AWS/GCP)",
        ],
        skills: ["Node.js", "React", "MongoDB", "Express", "AWS"],
        benefits: ["Equity Package", "Flexible Hours", "Health Insurance", "Remote Work"],
        posted_date: "2024-01-08T10:30:00Z",
        application_url: "https://talentics.com/jobs/tal_002/apply",
        featured: false,
      },
      {
        id: "tal_003",
        title: "Product Manager",
        company: {
          name: "E-commerce Giant",
          logo: "/placeholder.svg?height=60&width=60",
          size: "1000+",
          industry: "E-commerce",
        },
        location: {
          city: "Jakarta",
          country: "Indonesia",
          remote: false,
        },
        employment_type: "Full-time",
        experience_level: "Senior",
        salary: {
          min: 20000000,
          max: 35000000,
          currency: "IDR",
          period: "monthly",
        },
        description:
          "Lead product strategy for Indonesia's largest e-commerce platform. Drive innovation and user experience for millions of customers across the archipelago.",
        requirements: [
          "5+ years product management experience",
          "Experience in e-commerce or marketplace",
          "Strong analytical and data-driven mindset",
          "Excellent communication skills",
          "Experience with agile methodologies",
        ],
        skills: ["Product Strategy", "Data Analysis", "User Research", "Agile", "Stakeholder Management"],
        benefits: ["Health Insurance", "Performance Bonus", "Career Development", "Employee Discount"],
        posted_date: "2024-01-09T14:15:00Z",
        application_url: "https://talentics.com/jobs/tal_003/apply",
        featured: true,
      },
      {
        id: "tal_004",
        title: "UI/UX Designer",
        company: {
          name: "Design Studio",
          logo: "/placeholder.svg?height=60&width=60",
          size: "50-100",
          industry: "Design",
        },
        location: {
          city: "Yogyakarta",
          country: "Indonesia",
          remote: true,
        },
        employment_type: "Full-time",
        experience_level: "Mid-level",
        salary: {
          min: 8000000,
          max: 15000000,
          currency: "IDR",
          period: "monthly",
        },
        description:
          "Create beautiful and intuitive user experiences for digital products. Work with cross-functional teams to bring innovative design solutions to life.",
        requirements: [
          "3+ years UI/UX design experience",
          "Proficiency in Figma and Adobe Creative Suite",
          "Strong portfolio showcasing mobile and web designs",
          "Understanding of design systems",
          "Experience with user research and testing",
        ],
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Design Systems"],
        benefits: ["Creative Freedom", "Learning Budget", "Flexible Hours", "Health Insurance"],
        posted_date: "2024-01-07T09:45:00Z",
        application_url: "https://talentics.com/jobs/tal_004/apply",
        featured: false,
      },
      {
        id: "tal_005",
        title: "Data Scientist",
        company: {
          name: "AI Innovation Lab",
          logo: "/placeholder.svg?height=60&width=60",
          size: "50-100",
          industry: "Artificial Intelligence",
        },
        location: {
          city: "Jakarta",
          country: "Indonesia",
          remote: true,
        },
        employment_type: "Full-time",
        experience_level: "Senior",
        salary: {
          min: 18000000,
          max: 30000000,
          currency: "IDR",
          period: "monthly",
        },
        description:
          "Drive AI innovation and data-driven insights for Indonesian businesses. Work on cutting-edge machine learning projects that solve real-world problems.",
        requirements: [
          "PhD or Masters in Data Science/Statistics/Computer Science",
          "4+ years experience in machine learning",
          "Proficiency in Python and R",
          "Experience with deep learning frameworks",
          "Strong statistical analysis skills",
        ],
        skills: ["Python", "Machine Learning", "TensorFlow", "Statistics", "Data Visualization"],
        benefits: ["Research Budget", "Conference Attendance", "Flexible Hours", "Innovation Time"],
        posted_date: "2024-01-06T11:20:00Z",
        application_url: "https://talentics.com/jobs/tal_005/apply",
        featured: true,
      },
      {
        id: "tal_006",
        title: "DevOps Engineer",
        company: {
          name: "Cloud Solutions",
          logo: "/placeholder.svg?height=60&width=60",
          size: "200-500",
          industry: "Cloud Computing",
        },
        location: {
          city: "Surabaya",
          country: "Indonesia",
          remote: true,
        },
        employment_type: "Full-time",
        experience_level: "Mid-level",
        salary: {
          min: 14000000,
          max: 22000000,
          currency: "IDR",
          period: "monthly",
        },
        description:
          "Build and maintain scalable cloud infrastructure for enterprise clients. Automate deployment processes and ensure high availability systems.",
        requirements: [
          "3+ years DevOps experience",
          "Experience with AWS/Azure/GCP",
          "Proficiency in Docker and Kubernetes",
          "Infrastructure as Code (Terraform/CloudFormation)",
          "CI/CD pipeline experience",
        ],
        skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
        benefits: ["Cloud Certifications", "Learning Budget", "Remote Work", "Health Insurance"],
        posted_date: "2024-01-05T16:30:00Z",
        application_url: "https://talentics.com/jobs/tal_006/apply",
        featured: false,
      },
    ]

    return {
      jobs: mockJobs,
      total: mockJobs.length,
      page: 1,
      per_page: 20,
      total_pages: 1,
    }
  }
}

export const talenticsAPI = new TalenticsAPI()
