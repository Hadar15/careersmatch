"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestSupabase() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log("TestSupabase useEffect running");
    supabase.auth.getSession()
      .then((result) => {
        console.log("TestSupabase getSession result:", result);
      })
      .catch((err) => {
        console.error("TestSupabase getSession error:", err);
      });

    // Direct fetch to Supabase REST API
    fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + "/rest/v1/", {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      } as HeadersInit,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Direct fetch to Supabase REST API result:", data);
      })
      .catch((err) => {
        console.error("Direct fetch to Supabase REST API error:", err);
      });
  }, []);

  const handleSignIn = async () => {
    console.log("Attempting Supabase email/password sign-in");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Sign-in error:", error);
      } else {
        console.log("Sign-in success:", data);
      }
    } catch (err) {
      console.error("Sign-in exception:", err);
    }
  };

  return (
    <div>
      <div>Test Supabase Page</div>
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