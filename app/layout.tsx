import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/mock-auth"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "CareerMatch AI - Find Your Perfect Job with AI",
  description:
    "AI-powered job matching platform that analyzes your CV and personality to find the perfect career opportunities in Indonesia.",
  generator: 'v0.dev',
  robots: 'index, follow',
  keywords: 'job matching, AI career, Indonesia jobs, CV analysis, MBTI personality, remote work',
  authors: [{ name: 'CareerMatch AI Team' }],
  openGraph: {
    title: 'CareerMatch AI - Find Your Perfect Job with AI',
    description: 'AI-powered job matching platform for Indonesia',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerMatch AI - Find Your Perfect Job with AI',
    description: 'AI-powered job matching platform for Indonesia',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CareerMatch AI" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
