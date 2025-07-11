// Mock data untuk simulasi tanpa database

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  location: string | null
  professional_summary: string | null
  experience_years: number | null
  mbti_type: string | null
  profile_completion: number
}

export interface CVAnalysis {
  skills: string[]
  hiddenSkills: string[]
  experience: {
    totalYears: number
    roles: Array<{ title: string; company: string; duration: string }>
  }
  industries: string[]
  level: string
  recommendations: string[]
}

export interface MBTIResult {
  type: string
  traits: string[]
  careers: string[]
  answers: Record<number, string>
}

export const mockJobListings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Indonesia",
    location: "Jakarta",
    type: "Full-time",
    experience: "3-5 years",
    salary: "Rp 15-25 juta",
    match: 95,
    description: "We're looking for a Senior Frontend Developer to join our dynamic team...",
    skills: ["React", "JavaScript", "TypeScript", "Next.js", "Tailwind CSS"],
    benefits: ["Health Insurance", "Remote Work", "Learning Budget"],
    posted: "2 days ago",
    applicants: 45,
    companySize: "100-500",
    industry: "Technology",
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
    description: "Join our fast-growing startup as a Full Stack Developer...",
    skills: ["Node.js", "React", "MongoDB", "Express", "AWS"],
    benefits: ["Equity", "Flexible Hours", "Health Insurance"],
    posted: "1 week ago",
    applicants: 32,
    companySize: "10-50",
    industry: "Fintech",
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
    description: "Lead a team of developers in building innovative solutions...",
    skills: ["Leadership", "JavaScript", "System Design", "Team Management"],
    benefits: ["Leadership Training", "Health Insurance", "Bonus"],
    posted: "3 days ago",
    applicants: 28,
    companySize: "500+",
    industry: "Consulting",
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
    description: "Build amazing user experiences for millions of customers...",
    skills: ["React", "Redux", "JavaScript", "CSS", "Testing"],
    benefits: ["Employee Discount", "Health Insurance", "Career Growth"],
    posted: "5 days ago",
    applicants: 67,
    companySize: "1000+",
    industry: "E-commerce",
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
    description: "Build scalable backend systems for cloud infrastructure...",
    skills: ["Python", "Django", "PostgreSQL", "Docker", "Kubernetes"],
    benefits: ["Remote Work", "Learning Budget", "Health Insurance"],
    posted: "1 day ago",
    applicants: 23,
    companySize: "200-500",
    industry: "Cloud Computing",
  },
  {
    id: 6,
    title: "Mobile Developer",
    company: "AppTech Solutions",
    location: "Jakarta",
    type: "Full-time",
    experience: "2-4 years",
    salary: "Rp 13-21 juta",
    match: 72,
    description: "Develop cutting-edge mobile applications for iOS and Android...",
    skills: ["React Native", "Flutter", "JavaScript", "Dart", "Firebase"],
    benefits: ["Device Allowance", "Health Insurance", "Training"],
    posted: "4 days ago",
    applicants: 41,
    companySize: "50-100",
    industry: "Mobile Technology",
  },
]

export const mockCourses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    provider: "Tech Academy",
    duration: "6 weeks",
    rating: 4.8,
    price: "Rp 500,000",
    relevance: "High",
    skills: ["React", "JavaScript", "State Management"],
    description: "Master advanced React patterns and best practices",
  },
  {
    id: 2,
    title: "Leadership in Tech",
    provider: "Management Institute",
    duration: "4 weeks",
    rating: 4.9,
    price: "Rp 750,000",
    relevance: "Medium",
    skills: ["Leadership", "Team Management", "Communication"],
    description: "Develop leadership skills for tech professionals",
  },
  {
    id: 3,
    title: "System Design Fundamentals",
    provider: "Engineering School",
    duration: "8 weeks",
    rating: 4.7,
    price: "Rp 1,200,000",
    relevance: "High",
    skills: ["System Design", "Architecture", "Scalability"],
    description: "Learn to design scalable distributed systems",
  },
  {
    id: 4,
    title: "TypeScript Mastery",
    provider: "Code Academy",
    duration: "5 weeks",
    rating: 4.6,
    price: "Rp 400,000",
    relevance: "High",
    skills: ["TypeScript", "JavaScript", "Type Safety"],
    description: "Master TypeScript for better code quality",
  },
  {
    id: 5,
    title: "Cloud Architecture with AWS",
    provider: "Cloud Institute",
    duration: "10 weeks",
    rating: 4.8,
    price: "Rp 1,500,000",
    relevance: "Medium",
    skills: ["AWS", "Cloud Computing", "DevOps"],
    description: "Build scalable applications on AWS cloud",
  },
]

export const mockSkillGaps = [
  { skill: "TypeScript", current: 60, target: 85, priority: "High" },
  { skill: "System Design", current: 40, target: 80, priority: "High" },
  { skill: "Team Leadership", current: 70, target: 90, priority: "Medium" },
  { skill: "Cloud Architecture", current: 30, target: 75, priority: "Medium" },
  { skill: "Testing", current: 50, target: 80, priority: "High" },
  { skill: "DevOps", current: 35, target: 70, priority: "Low" },
]

// Helper functions untuk localStorage
export const saveUserProfile = (profile: Partial<UserProfile>) => {
  const existing = getUserProfile()
  const updated = { ...existing, ...profile }
  localStorage.setItem("userProfile", JSON.stringify(updated))
  return updated
}

export const getUserProfile = (): UserProfile => {
  const saved = localStorage.getItem("userProfile")
  if (saved) {
    return JSON.parse(saved)
  }

  // Default profile
  const currentUser = localStorage.getItem("currentUser")
  const user = currentUser ? JSON.parse(currentUser) : null

  return {
    id: user?.id || "mock-user-id",
    email: user?.email || "",
    full_name: user?.full_name || null,
    phone: null,
    location: null,
    professional_summary: null,
    experience_years: null,
    mbti_type: null,
    profile_completion: 20,
  }
}

export const saveCVAnalysis = (analysis: CVAnalysis) => {
  localStorage.setItem("cvAnalysis", JSON.stringify(analysis))
  // Update profile completion
  const profile = getUserProfile()
  saveUserProfile({ ...profile, profile_completion: Math.max(profile.profile_completion, 60) })
}

export const getCVAnalysis = (): CVAnalysis | null => {
  const saved = localStorage.getItem("cvAnalysis")
  return saved ? JSON.parse(saved) : null
}

export const saveMBTIResult = (result: MBTIResult) => {
  localStorage.setItem("mbtiResult", JSON.stringify(result))
  // Update profile completion and MBTI type
  const profile = getUserProfile()
  saveUserProfile({
    ...profile,
    mbti_type: result.type,
    profile_completion: Math.max(profile.profile_completion, 85),
  })
}

export const getMBTIResult = (): MBTIResult | null => {
  const saved = localStorage.getItem("mbtiResult")
  return saved ? JSON.parse(saved) : null
}
