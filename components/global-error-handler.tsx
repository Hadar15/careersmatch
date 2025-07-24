"use client"

import { useEffect } from 'react'

export default function GlobalErrorHandler() {
  useEffect(() => {
    console.log('Global error handler initialized')
    
    // More aggressive error suppression for browser extension errors
    const isExtensionError = (error: any): boolean => {
      const message = error?.message || error?.reason?.message || String(error)
      
      return message.includes('A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') ||
             message.includes('A listener indicated an asynchronous response') ||
             message.includes('message channel closed before a response was received') ||
             message.includes('Extension context invalidated') ||
             message.includes('message channel closed') ||
             message.includes('chrome-extension://') ||
             message.includes('moz-extension://') ||
             message.includes('Invalid extension context') ||
             message.includes('Extension has been reloaded')
    }
    
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.log('Unhandled rejection caught:', event.reason)
      
      if (isExtensionError(event.reason)) {
        console.warn('🔇 Suppressed browser extension error:', event.reason?.message || event.reason)
        event.preventDefault() // Prevent default error handling
        event.stopPropagation()
        return false
      }
      
      // Log other errors normally
      console.error('Unhandled promise rejection (not extension):', event.reason)
    }
    
    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.log('Error caught:', event.error?.message || event.message)
      
      if (isExtensionError(event.error || event)) {
        console.warn('🔇 Suppressed browser extension error:', event.error?.message || event.message)
        event.preventDefault()
        event.stopPropagation()
        return false
      }
      
      console.error('Uncaught error (not extension):', event.error)
    }
    
    // Override console.error temporarily to catch and filter extension errors
    const originalConsoleError = console.error
    console.error = (...args: any[]) => {
      const message = args.join(' ')
      if (isExtensionError({ message })) {
        console.warn('🔇 Suppressed console extension error:', message)
        return
      }
      originalConsoleError.apply(console, args)
    }
    
    // Add event listeners with capture phase
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true)
    window.addEventListener('error', handleError, true)
    
    // Also add for document
    document.addEventListener('error', handleError, true)
    
    // Cleanup
    return () => {
      console.log('Global error handler cleanup')
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true)
      window.removeEventListener('error', handleError, true)
      document.removeEventListener('error', handleError, true)
      console.error = originalConsoleError
    }
  }, [])
  
  return null // This component doesn't render anything
}
