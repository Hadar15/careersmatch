"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

export default function EditProfilePage() {
  const { user }: { user: SupabaseUser | null } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      setProfile(data)
      setAvatarUrl(data?.avatar_url || null)
      setLoading(false)
    }
    fetchProfile()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setSaving(true)
    const fileExt = file.name.split('.').pop()
    const filePath = `avatars/${user.id}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true })
    if (uploadError) {
      alert("Gagal upload foto profile")
      setSaving(false)
      return
    }
    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath)
    setAvatarUrl(publicUrlData.publicUrl)
    setProfile({ ...profile, avatar_url: publicUrlData.publicUrl })
    setSaving(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (!user) return
    if (!profile?.full_name || profile.full_name.trim() === "") {
      toast({ title: "Nama Lengkap wajib diisi", variant: "destructive" })
      setSaving(false)
      return
    }
    const updates = {
      ...profile,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)
    setSaving(false)
    if (!error) {
      toast({ title: "Profil berhasil diupdate!" })
      router.push("/dashboard")
    } else {
      toast({ title: "Gagal update profile", description: error.message, variant: "destructive" })
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-xl border-sky-100 shadow-xl">
          <CardHeader className="flex flex-col items-center space-y-2 pb-2">
            <CardTitle className="text-2xl font-bold">Edit Profil</CardTitle>
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-2">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Profile" />
                ) : (
                  <AvatarFallback>
                    {(profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1"
                disabled={saving}
              >
                Upload Foto
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={saving}
              />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={profile?.full_name || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profile?.phone || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  name="location"
                  value={profile?.location || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professional_summary">Summary</Label>
                <Textarea
                  id="professional_summary"
                  name="professional_summary"
                  value={profile?.professional_summary || ""}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
} 