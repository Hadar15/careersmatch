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

  async getJobs(params?: any): Promise<TalenticsApiResponse> {
    // Return empty jobs (no dummy)
    return {
      jobs: [],
      total: 0,
      page: 1,
      per_page: 20,
      total_pages: 1,
    }
  }

  async getJobById(id: string): Promise<TalenticsJob | null> {
    return null
  }

  // Mock data sebagai fallback (now always empty)
  private getMockJobs(params?: any): TalenticsApiResponse {
    return {
      jobs: [],
      total: 0,
      page: 1,
      per_page: 20,
      total_pages: 1,
    }
  }
}

export const talenticsAPI = new TalenticsAPI()
