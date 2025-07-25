"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function CallbackPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash containing the session information
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Error getting session:", error)
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          })
          router.push("/auth/login")
          return
        }

        if (data?.session) {
          // Successfully authenticated
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          })
          
          // Check if user has completed profile setup
          const { data: profile } = await supabase
            .from('profiles')
            .select('profile_completion')
            .eq('id', data.session.user.id)
            .single()

          // Redirect based on profile completion
          if (profile && profile.profile_completion >= 100) {
            router.push("/dashboard")
          } else {
            router.push("/profile")
          }
        } else {
          // No session found, redirect to login
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Callback error:", error)
        toast({
          title: "Authentication Error",
          description: "Something went wrong during authentication",
          variant: "destructive",
        })
        router.push("/auth/login")
      }
    }

    handleAuthCallback()
  }, [router, toast])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing authentication...</h2>
        <p className="text-gray-600">Please wait while we sign you in.</p>
      </div>
    </div>
  )
}