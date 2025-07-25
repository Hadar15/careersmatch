"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RedirectHandler() {
  const router = useRouter()

  useEffect(() => {
    // Check if we're on localhost with an OAuth code
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const currentHost = window.location.host
    
    if (code && currentHost.includes('localhost')) {
      // We got redirected to localhost after OAuth, redirect to production with the code
      const productionUrl = `https://careersmatchai.vercel.app${window.location.pathname}${window.location.search}`
      window.location.replace(productionUrl)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Redirecting to secure site...</h2>
        <p className="text-gray-600">Please wait while we redirect you to the production site.</p>
      </div>
    </div>
  )
}
