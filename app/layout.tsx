"use client";
import { AuthProvider } from "@/lib/auth-context";
import type { ReactNode } from "react";
export default function RootLayout({ children }: { children: ReactNode }) {
  console.log("RootLayout rendered");
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
