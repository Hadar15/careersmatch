"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Globe, Menu, X, Brain } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    console.log("Logout button clicked");
    await signOut();
    // Fallback: force reload in case signOut does not reload
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Profile Content */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>
      ) : !user ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <Card className="max-w-md w-full border-sky-100 shadow-xl">
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Anda belum login.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/login">
                <Button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white mt-4">Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Profil Saya</h1>
          <div className="mb-8">
            <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold">
              Logout
            </Button>
          </div>
          <Card className="max-w-md w-full border-sky-100 shadow-xl mb-6">
            <CardHeader>
              <CardTitle>Profil Saya</CardTitle>
              <CardDescription>Informasi akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-semibold text-gray-700">Nama Lengkap:</div>
                <div className="text-lg">{user.user_metadata?.full_name || user.email}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Email:</div>
                <div className="text-lg">{user.email}</div>
              </div>
            </CardContent>
          </Card>
        </main>
      )}
    </div>
  );
} 