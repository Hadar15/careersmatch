"use client";
import React, { createContext, useContext } from "react";

const AuthContext = createContext({
  user: null,
  loading: false,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => ({}),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log("Minimal AuthProvider rendering");
  return (
    <AuthContext.Provider value={{
      user: null,
      loading: false,
      signIn: async () => ({}),
      signUp: async () => ({}),
      signOut: async () => ({}),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
