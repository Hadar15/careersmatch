"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { User, LogOut, Brain } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/" || pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) return null;

  return (
    <header className="border-b border-sky-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSidebarOpen(true)} className="mr-2 p-2 rounded hover:bg-sky-100">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect y="6" width="28" height="2.5" rx="1.25" fill="#1992fa" />
              <rect y="13" width="28" height="2.5" rx="1.25" fill="#1992fa" />
              <rect y="20" width="28" height="2.5" rx="1.25" fill="#1992fa" />
            </svg>
          </button>
          <button onClick={() => router.push("/dashboard")} className="inline-flex items-center space-x-2 focus:outline-none">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              CareerMatch AI
            </span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 focus:outline-none px-2 py-1 rounded-lg hover:bg-sky-50 transition">
                <Avatar>
                  <AvatarFallback>
                    {(user?.user_metadata?.full_name || user?.email?.split("@")[0] || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-700">
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2">
              <DropdownMenuItem onClick={() => router.push("/profile")}
                className="flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 hover:bg-sky-50">
                <User className="w-4 h-4 text-sky-600" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => { await signOut(); router.push("/"); }}
                className="flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 mt-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Sidebar Drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigasi</SheetTitle>
          <div className="p-6 pb-2">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar>
                <AvatarFallback>
                  {(user?.user_metadata?.full_name || user?.email?.split("@")[0] || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-lg text-gray-800">
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                </div>
                <div className="text-gray-500 text-sm">{user?.email}</div>
              </div>
            </div>
            <Separator className="my-4" />
            <nav className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start" onClick={() => {router.push("/profile"); setSidebarOpen(false)}}>
                Profile
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => {router.push("/"); setSidebarOpen(false)}}>
                Dashboard
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => {router.push("/ai-analysis"); setSidebarOpen(false)}}>
                AI Analysis
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => {router.push("/job-matching"); setSidebarOpen(false)}}>
                Job Matching
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => {router.push("/skill-upgrade"); setSidebarOpen(false)}}>
                Course
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => {router.push("/roadmap"); setSidebarOpen(false)}}>
                Roadmap
              </Button>
              <Button variant="ghost" className="justify-start text-red-600 border border-red-200 mt-2" onClick={async () => {await signOut(); setSidebarOpen(false); router.push("/");}}>
                Logout
              </Button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
} 