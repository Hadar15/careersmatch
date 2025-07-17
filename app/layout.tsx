import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata = {
  title: "CareerMatch AI - Find Your Perfect Job with AI",
  description: "AI-powered job matching platform for Indonesia",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-white">{children}</div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
