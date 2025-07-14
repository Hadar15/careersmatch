"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-medium text-gray-700">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Anda belum login. Silakan login untuk melihat profil Anda.</p>
            <Button onClick={() => router.push("/auth/login")}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-emerald-50 to-white p-4">
      <Card className="w-full max-w-md border-sky-100 shadow-xl">
        <CardHeader>
          <CardTitle>Profil Saya</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="font-medium text-gray-700 mb-2">Email:</div>
            <div className="mb-4 text-gray-900">{user.email}</div>
            <div className="font-medium text-gray-700 mb-2">Nama Lengkap:</div>
            <div className="mb-4 text-gray-900">{user.user_metadata?.full_name || user.full_name || "-"}</div>
          </div>
          <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent mb-4" onClick={handleSignOut}>
            Logout
          </Button>
          <Button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-medium" onClick={() => router.push("/")}>Kembali ke Landing Page</Button>
        </CardContent>
      </Card>
    </div>
  );
} 