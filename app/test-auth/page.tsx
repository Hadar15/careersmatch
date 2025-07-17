"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    console.log("[TestAuth] Attempting Supabase email/password sign-in");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("[TestAuth] Sign-in error:", error);
      } else {
        console.log("[TestAuth] Sign-in success:", data);
      }
    } catch (err) {
      console.error("[TestAuth] Sign-in exception:", err);
    }
  };

  return (
    <div>
      <div>Test Auth Page (Minimal)</div>
      <div style={{ marginTop: 20 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={handleSignIn}>Sign In (Supabase)</button>
      </div>
    </div>
  );
} 