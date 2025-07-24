import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata = {
  title: "CareerMatch AI - Find Your Perfect Job with AI",
  description: "AI-powered job matching platform for Indonesia",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log("LAYOUT: AuthProvider is running");
  return (
    <html lang="id" className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Ultra-aggressive early error suppression for browser extension errors
              (function() {
                const isExtensionError = (error) => {
                  const message = error?.message || error?.reason?.message || String(error);
                  return message.includes('A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') ||
                         message.includes('A listener indicated an asynchronous response') ||
                         message.includes('message channel closed before a response was received') ||
                         message.includes('Extension context invalidated') ||
                         message.includes('chrome-extension://') ||
                         message.includes('moz-extension://') ||
                         message.includes('Invalid extension context') ||
                         message.includes('Extension has been reloaded');
                };
                
                // Override console.error to suppress extension errors
                const originalConsoleError = console.error;
                console.error = function(...args) {
                  const message = args.join(' ');
                  if (isExtensionError({ message })) {
                    console.warn('🔇 Console: Suppressed extension error:', message);
                    return;
                  }
                  originalConsoleError.apply(console, args);
                };
                
                // Capture all error events very early
                window.addEventListener('unhandledrejection', function(event) {
                  if (isExtensionError(event.reason)) {
                    console.warn('🔇 Early unhandledrejection: Suppressed extension error:', event.reason?.message || event.reason);
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return false;
                  }
                }, true);
                
                window.addEventListener('error', function(event) {
                  if (isExtensionError(event.error || event)) {
                    console.warn('🔇 Early error: Suppressed extension error:', event.error?.message || event.message);
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return false;
                  }
                }, true);
                
                // Also listen on document
                document.addEventListener('error', function(event) {
                  if (isExtensionError(event.error || event)) {
                    console.warn('🔇 Early document error: Suppressed extension error:', event.error?.message || event.message);
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return false;
                  }
                }, true);
                
                // Override window.onerror
                const originalOnError = window.onerror;
                window.onerror = function(message, source, lineno, colno, error) {
                  if (isExtensionError(error || { message })) {
                    console.warn('🔇 window.onerror: Suppressed extension error:', message);
                    return true; // Prevent default error handling
                  }
                  if (originalOnError) {
                    return originalOnError.call(this, message, source, lineno, colno, error);
                  }
                  return false;
                };
                
                // Override window.onunhandledrejection
                const originalOnUnhandledRejection = window.onunhandledrejection;
                window.onunhandledrejection = function(event) {
                  if (isExtensionError(event.reason)) {
                    console.warn('🔇 window.onunhandledrejection: Suppressed extension error:', event.reason?.message || event.reason);
                    event.preventDefault();
                    return true;
                  }
                  if (originalOnUnhandledRejection) {
                    return originalOnUnhandledRejection.call(this, event);
                  }
                  return false;
                };
                
                console.log('🛡️ Ultra-aggressive extension error suppression loaded');
              })();
            `
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <Header />
          <div className="min-h-screen bg-white">{children}</div>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}