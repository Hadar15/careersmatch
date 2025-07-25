import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { LocalhostRedirectHandler } from "@/components/localhost-redirect-handler"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata = {
  title: "CareerMatch AI - Find Your Perfect Job with AI",
  description: "AI-powered job matching platform for Indonesia",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log("LAYOUT: AuthProvider is running");
  return (
    <html lang="id" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <LocalhostRedirectHandler />
        <AuthProvider>
          <Header />
          <div className="min-h-screen bg-white">{children}</div>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}