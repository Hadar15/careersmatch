"use client"

import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"

type AuthContextType = {
  user: any;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<{ error: any | null }>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log("AuthProvider function called");
  "use client"
  console.log("AuthProvider mounted");
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    console.log("AuthProvider useEffect running");
    // --- Begin: Manual session restoration from OAuth URL hash ---
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.substring(1));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        if (access_token && refresh_token) {
          supabase.auth.setSession({ access_token, refresh_token });
          // Remove the hash from the URL for cleanliness
          window.history.replaceState(null, "", window.location.pathname);
          console.log("Supabase session set from OAuth URL hash");
        }
      }
    }
    // --- End: Manual session restoration from OAuth URL hash ---
    const getSession = async () => {
      // Force refresh the session from localStorage/cookies
      await supabase.auth.refreshSession();
      const { data } = await supabase.auth.getSession();
      console.log("Supabase getSession data", data);
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  // Sign up with email/password
  const signUp = async (email: string, password: string, fullName: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/verify-email` : undefined,
      },
    })
  }

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    return { error };
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
