"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  full_name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: { message: string } }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      // Check if we're in browser environment
      if (typeof window !== 'undefined') {
        // Check if user is logged in from localStorage
        const savedUser = localStorage.getItem("currentUser")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
      // Clear corrupted data
      if (typeof window !== 'undefined') {
        localStorage.removeItem("currentUser")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call your auth service
    if (email && password) {
      const mockUser = {
        id: "mock-user-id",
        email,
        full_name: email.split("@")[0],
      }
      setUser(mockUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem("currentUser", JSON.stringify(mockUser))
      }
      return {}
    }
    return { error: { message: "Email dan password harus diisi" } }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    // Mock registration
    if (email && password && fullName) {
      const mockUser = {
        id: "mock-user-" + Date.now(),
        email,
        full_name: fullName,
      }
      setUser(mockUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem("currentUser", JSON.stringify(mockUser))
      }
      return {}
    }
    return { error: { message: "Semua field harus diisi" } }
  }

  const signOut = async () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("currentUser")
      localStorage.removeItem("userProfile")
      localStorage.removeItem("cvAnalysis")
      localStorage.removeItem("mbtiResult")
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
