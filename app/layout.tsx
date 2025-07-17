"use client"
import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

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
