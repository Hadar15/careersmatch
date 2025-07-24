"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Log to external service if needed
    // logErrorToService(error, errorInfo)
  }

  componentDidMount() {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      
      // Prevent the default browser behavior (logging to console)
      event.preventDefault()
      
      // Don't crash the app for unhandled rejections
      // Instead, just log them
      if (event.reason && event.reason.message) {
        const message = event.reason.message
        
        // Filter out known non-critical errors
        if (
          message.includes('A listener indicated an asynchronous response') ||
          message.includes('message channel closed') ||
          message.includes('Extension context invalidated')
        ) {
          console.warn('Non-critical browser extension error (ignored):', message)
          return
        }
      }
    }
    
    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error('Uncaught error:', event.error)
      
      // Filter out browser extension errors
      if (event.error && event.error.message) {
        const message = event.error.message
        if (
          message.includes('A listener indicated an asynchronous response') ||
          message.includes('message channel closed') ||
          message.includes('Extension context invalidated')
        ) {
          console.warn('Non-critical browser extension error (ignored):', message)
          return
        }
      }
    }
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-red-600">Oops! Terjadi Kesalahan</CardTitle>
              <CardDescription>
                Aplikasi mengalami masalah. Silakan muat ulang halaman.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-gray-100 p-2 rounded text-sm">
                  <summary className="cursor-pointer">Detail Error (Development)</summary>
                  <pre className="mt-2 text-xs overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Muat Ulang Halaman
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
