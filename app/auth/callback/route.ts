import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("Error exchanging code for session:", error)
        // Redirect to login with error
        return NextResponse.redirect(new URL("/auth/login?error=auth_failed", request.url))
      }

      // Successful authentication - redirect to home page
      return NextResponse.redirect(new URL("/", request.url))
    } catch (err) {
      console.error("Auth callback error:", err)
      return NextResponse.redirect(new URL("/auth/login?error=auth_failed", request.url))
    }
  }

  // No code parameter - redirect to login
  return NextResponse.redirect(new URL("/auth/login", request.url))
}
