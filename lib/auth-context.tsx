"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase, type Database } from "./supabase"
import type { User, Session, AuthError } from "@supabase/supabase-js"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null; needsVerification: boolean }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Database["public"]["Tables"]["profiles"]["Update"]) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error)
      return null
    }
    return data
  }

  const createProfile = async (user: User) => {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || null,
        profile_completion: 20,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating profile:", error)
      return null
    }

    return data
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user && session.user.confirmed_at) {
        let userProfile = await fetchProfile(session.user.id)
        if (!userProfile) {
          userProfile = await createProfile(session.user)
        }
        setProfile(userProfile)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user && session.user.confirmed_at) {
        let userProfile = await fetchProfile(session.user.id)
        if (!userProfile) {
          userProfile = await createProfile(session.user)
        }
        setProfile(userProfile)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/verify-email` : undefined,
      },
    })
    // If user is null, it means email confirmation is required
    const needsVerification = !data?.user || !data.user.confirmed_at
    return { error, needsVerification }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    // Always clear state, even if error
    setUser(null)
    setSession(null)
    setProfile(null)
    // Force reload to clear any stale state and ensure cookies are reset
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    }
    return { error }
  }

  const updateProfile = async (updates: Database["public"]["Tables"]["profiles"]["Update"]) => {
    if (!user) return { error: new Error("No user logged in") }

    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single()

    if (error) return { error: new Error(error.message) }

    setProfile(data)
    return { error: null }
  }

  const value = { user, session, profile, loading, signUp, signIn, signOut, updateProfile }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
