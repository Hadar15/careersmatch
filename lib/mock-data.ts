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

export const mockJobListings: any[] = []
export const mockCourses: any[] = []
export const mockSkillGaps: any[] = []

// Helper functions untuk localStorage
export const saveUserProfile = (profile: Partial<UserProfile>) => {
  if (typeof window === 'undefined') {
    return profile as UserProfile
  }
  const existing = getUserProfile()
  const updated = { ...existing, ...profile }
  localStorage.setItem("userProfile", JSON.stringify(updated))
  return updated
}

export const getUserProfile = (): UserProfile => {
  if (typeof window === 'undefined') {
    return {
      id: "mock-user-id",
      email: "",
      full_name: null,
      phone: null,
      location: null,
      professional_summary: null,
      experience_years: null,
      mbti_type: null,
      profile_completion: 20,
    }
  }
  try {
    const saved = localStorage.getItem("userProfile")
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error("Error loading user profile from localStorage:", error)
    localStorage.removeItem("userProfile")
  }
  let user = null
  try {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      user = JSON.parse(currentUser)
    }
  } catch (error) {
    console.error("Error loading current user from localStorage:", error)
    localStorage.removeItem("currentUser")
  }
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
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem("cvAnalysis", JSON.stringify(analysis))
  const profile = getUserProfile()
  saveUserProfile({ ...profile, profile_completion: Math.max(profile.profile_completion, 60) })
}

export const getCVAnalysis = (): CVAnalysis | null => {
  if (typeof window === 'undefined') {
    return null
  }
  const saved = localStorage.getItem("cvAnalysis")
  return saved ? JSON.parse(saved) : null
}

export const saveMBTIResult = (result: MBTIResult) => {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem("mbtiResult", JSON.stringify(result))
  const profile = getUserProfile()
  saveUserProfile({
    ...profile,
    mbti_type: result.type,
    profile_completion: Math.max(profile.profile_completion, 85),
  })
}

export const getMBTIResult = (): MBTIResult | null => {
  if (typeof window === 'undefined') {
    return null
  }
  const saved = localStorage.getItem("mbtiResult")
  return saved ? JSON.parse(saved) : null
}
