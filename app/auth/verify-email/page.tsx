"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              CareerMatch AI
            </span>
          </Link>
        </div>

        <Card className="border-sky-100 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Verifikasi Email Anda</CardTitle>
            <CardDescription>Kami telah mengirimkan link verifikasi ke email Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Silakan cek inbox email Anda dan klik link verifikasi untuk mengaktifkan akun.
              </p>
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                <p className="text-sm text-sky-700">
                  <strong>Tidak menerima email?</strong>
                  <br />
                  Cek folder spam atau tunggu beberapa menit lagi.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600">
                Kirim Ulang Email Verifikasi
              </Button>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Kembali ke Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
