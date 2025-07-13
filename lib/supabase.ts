// Komentar random: trigger perubahan untuk cek deploy Vercel
import { createClient } from "@supabase/supabase-js"

/**
 * Supabase client – make sure your environment contains:
 *  NEXT_PUBLIC_SUPABASE_URL
 *  NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * In local dev add them to a `.env.local` file:
 *  NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables are missing.\n" +
      "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.",
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          location: string | null
          professional_summary: string | null
          experience_years: number | null
          mbti_type: string | null
          profile_completion: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          location?: string | null
          professional_summary?: string | null
          experience_years?: number | null
          mbti_type?: string | null
          profile_completion?: number
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          location?: string | null
          professional_summary?: string | null
          experience_years?: number | null
          mbti_type?: string | null
          profile_completion?: number
          updated_at?: string
        }
      }
      cv_uploads: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_url: string
          file_size: number | null
          analysis_status: string
          analysis_result: any | null
          skills_extracted: string[] | null
          experience_extracted: any | null
          uploaded_at: string
        }
        Insert: {
          user_id: string
          file_name: string
          file_url: string
          file_size?: number | null
          analysis_status?: string
          analysis_result?: any | null
          skills_extracted?: string[] | null
          experience_extracted?: any | null
        }
        Update: {
          analysis_status?: string
          analysis_result?: any | null
          skills_extracted?: string[] | null
          experience_extracted?: any | null
        }
      }
      mbti_results: {
        Row: {
          id: string
          user_id: string
          answers: any
          result_type: string
          personality_traits: string[]
          career_recommendations: string[]
          completed_at: string
        }
        Insert: {
          user_id: string
          answers: any
          result_type: string
          personality_traits: string[]
          career_recommendations: string[]
        }
        Update: {
          answers?: any
          result_type?: string
          personality_traits?: string[]
          career_recommendations?: string[]
        }
      }
      job_matches: {
        Row: {
          id: string
          user_id: string
          job_title: string
          company_name: string
          location: string | null
          salary_range: string | null
          job_type: string | null
          match_percentage: number | null
          skills_required: string[] | null
          job_description: string | null
          external_job_id: string | null
          source_platform: string | null
          job_url: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          job_title: string
          company_name: string
          location?: string | null
          salary_range?: string | null
          job_type?: string | null
          match_percentage?: number | null
          skills_required?: string[] | null
          job_description?: string | null
          external_job_id?: string | null
          source_platform?: string | null
          job_url?: string | null
        }
        Update: {
          job_title?: string
          company_name?: string
          location?: string | null
          salary_range?: string | null
          job_type?: string | null
          match_percentage?: number | null
          skills_required?: string[] | null
          job_description?: string | null
          external_job_id?: string | null
          source_platform?: string | null
          job_url?: string | null
        }
      }
    }
  }
}

console.log("ENV URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("ENV KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
