"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"
import { User } from "lucide-react"

export default function ProfilePage() {
  const { user }: { user: SupabaseUser | null } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        if (error) {
          toast({
            title: "Gagal memuat profil",
            description: error.message,
            variant: "destructive",
          })
        }
        setProfile(data)
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat mengambil data profil.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-emerald-50 to-white">
        <Card className="border-sky-100 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <User className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg font-medium text-gray-700">Memuat profil...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-xl border-sky-100 shadow-xl">
          <CardHeader className="flex flex-col items-center space-y-2 pb-2">
            <CardTitle className="text-2xl font-bold">Profil Saya</CardTitle>
            <Avatar className="w-24 h-24">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="Profile" />
              ) : (
                <AvatarFallback>
                  {(profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div><strong>Nama:</strong> {profile?.full_name || user?.user_metadata?.full_name || "-"}</div>
              <div><strong>Email:</strong> {profile?.email || user?.email || "-"}</div>
              <div><strong>Phone:</strong> {profile?.phone || "-"}</div>
              <div><strong>Lokasi:</strong> {profile?.location || "-"}</div>
              <div className="md:col-span-2"><strong>Summary:</strong> {profile?.professional_summary || "-"}</div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => router.push("/profile/edit")}>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
} 