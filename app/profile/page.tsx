"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Globe, Menu, X, Brain, MapPin, User as UserIcon, Mail, Phone, Briefcase } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, profile, loading, signOut } = useAuth();
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

  // Helper untuk format lokasi jika berupa JSON string
  let locationLabel = profile?.location;
  try {
    if (profile?.location && profile.location.startsWith('{')) {
      const locObj = JSON.parse(profile.location);
      locationLabel = locObj.address || profile.location;
    }
  } catch (e) {
    locationLabel = profile?.location;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
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
        <main className="container mx-auto px-4 py-8 flex flex-col items-center">
          <div className="w-full max-w-2xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-0 md:p-0 border border-sky-100 overflow-hidden">
            {/* Header Gradient */}
            <div className="h-32 w-full bg-gradient-to-r from-sky-400/60 via-emerald-400/60 to-sky-400/60 flex items-end justify-center relative">
              <div className="absolute left-1/2 -bottom-10 -translate-x-1/2">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg bg-sky-50">
                  <AvatarImage src={"/placeholder-user.jpg"} alt={profile?.full_name || user.email} />
                  <AvatarFallback className="text-3xl font-bold text-sky-700 bg-sky-100">{(profile?.full_name || user.email)?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="pt-16 pb-8 px-6 md:px-12 flex flex-col items-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl md:text-3xl font-bold text-sky-800 drop-shadow-sm text-center">{profile?.full_name || user.user_metadata?.full_name || user.email}</span>
                  {profile?.mbti_type && (
                    <Badge variant="secondary" className="ml-2 flex items-center gap-1 px-3 py-1 text-base shadow hover:scale-105 transition"><Brain className="w-5 h-5" />{profile.mbti_type}</Badge>
                  )}
                </div>
                <span className="text-gray-500 text-sm mb-2">{user.email}</span>
              </div>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {locationLabel && (
                  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-base shadow hover:bg-sky-50 transition"><MapPin className="w-5 h-5 text-sky-600" />{locationLabel}</Badge>
                )}
                {profile?.phone && (
                  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-base shadow hover:bg-emerald-50 transition"><Phone className="w-5 h-5 text-emerald-600" />{profile.phone}</Badge>
                )}
                {profile?.experience_years !== null && profile?.experience_years !== undefined && (
                  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-base shadow hover:bg-sky-50 transition"><Briefcase className="w-5 h-5 text-sky-600" />{profile.experience_years} tahun pengalaman</Badge>
                )}
              </div>
              {profile?.professional_summary && (
                <div className="mb-6 mt-4 text-center text-gray-700 text-base italic max-w-xl">"{profile.professional_summary}"</div>
              )}
              <div className="mb-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Profile Completion</span>
                  <span className="text-xs font-semibold text-sky-700">{profile?.profile_completion || 20}%</span>
                </div>
                <Progress value={profile?.profile_completion || 20} className="h-2 bg-sky-100" />
              </div>
              <div className="flex justify-center w-full">
                <Button onClick={handleLogout} className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold px-8 py-2 rounded-xl shadow-lg transition">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
} 