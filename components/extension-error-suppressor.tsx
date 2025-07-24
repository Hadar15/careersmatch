"use client"

import { useEffect } from 'react'

export default function ExtensionErrorSuppressor() {
  useEffect(() => {
    // Monkey patch Promise to catch extension-related errors at the source
    const originalPromiseConstructor = window.Promise
    const originalThen = originalPromiseConstructor.prototype.then
    const originalCatch = originalPromiseConstructor.prototype.catch
    
    // Track if we've already patched to avoid double patching
    if ((window as any).__extensionErrorPatched) {
      return
    }
    
    console.log('🔧 Patching Promise methods to suppress extension errors')
    
    const isExtensionError = (error: any): boolean => {
      const message = error?.message || String(error)
      return message.includes('A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') ||
             message.includes('message channel closed before a response was received') ||
             message.includes('Extension context invalidated') ||
             message.includes('chrome-extension://') ||
             message.includes('moz-extension://')
    }
    
    // Patch Promise.prototype.then
    ;(originalPromiseConstructor.prototype as any).then = function(onFulfilled?: any, onRejected?: any) {
      const wrappedOnRejected = onRejected ? (error: any) => {
        if (isExtensionError(error)) {
          console.warn('🔇 Promise.then: Suppressed extension error:', error?.message || error)
          return Promise.resolve() // Convert to resolved promise
        }
        return onRejected(error)
      } : (error: any) => {
        if (isExtensionError(error)) {
          console.warn('🔇 Promise.then: Suppressed unhandled extension error:', error?.message || error)
          return Promise.resolve() // Convert to resolved promise
        }
        throw error // Re-throw non-extension errors
      }
      
      return originalThen.call(this, onFulfilled, wrappedOnRejected)
    }
    
    // Patch Promise.prototype.catch
    ;(originalPromiseConstructor.prototype as any).catch = function(onRejected?: any) {
      const wrappedOnRejected = onRejected ? (error: any) => {
        if (isExtensionError(error)) {
          console.warn('🔇 Promise.catch: Suppressed extension error:', error?.message || error)
          return Promise.resolve() // Convert to resolved promise
        }
        return onRejected(error)
      } : (error: any) => {
        if (isExtensionError(error)) {
          console.warn('🔇 Promise.catch: Suppressed unhandled extension error:', error?.message || error)
          return Promise.resolve() // Convert to resolved promise
        }
        throw error // Re-throw non-extension errors
      }
      
      return originalCatch.call(this, wrappedOnRejected)
    }
    
    // Mark as patched
    ;(window as any).__extensionErrorPatched = true
    
    return () => {
      // Restore original methods on cleanup
      if ((window as any).__extensionErrorPatched) {
        ;(originalPromiseConstructor.prototype as any).then = originalThen
        ;(originalPromiseConstructor.prototype as any).catch = originalCatch
        delete (window as any).__extensionErrorPatched
        console.log('🔧 Restored original Promise methods')
      }
    }
  }, [])
  
  return null
}
