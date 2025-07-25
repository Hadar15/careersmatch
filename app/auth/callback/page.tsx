"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get authorization code from URL parameters
        const code = searchParams?.get("code")
        const error = searchParams?.get("error")

        if (error) {
          console.error("OAuth error:", error)
          toast({
            title: "Authentication Error",
            description: "OAuth authentication failed",
            variant: "destructive",
          })
          router.push("/auth/login")
          return
        }

        if (code) {
          // Exchange authorization code for session
          const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (sessionError) {
            console.error("Error exchanging code for session:", sessionError)
            toast({
              title: "Authentication Error",
              description: sessionError.message,
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
            // No session created, redirect to login
            router.push("/auth/login")
          }
        } else {
          // No code parameter, try getting existing session as fallback
          const { data, error } = await supabase.auth.getSession()
          
          if (error || !data?.session) {
            router.push("/auth/login")
            return
          }

          // Session exists, redirect appropriately
          const { data: profile } = await supabase
            .from('profiles')
            .select('profile_completion')
            .eq('id', data.session.user.id)
            .single()

          if (profile && profile.profile_completion >= 100) {
            router.push("/dashboard")
          } else {
            router.push("/profile")
          }
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
  }, [router, searchParams, toast])

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

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait.</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}