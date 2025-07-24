"use client"

import { useEffect } from 'react'

export default function NetworkErrorSuppressor() {
  useEffect(() => {
    // Check if already patched
    if ((window as any).__networkErrorPatched) {
      return
    }
    
    console.log('🌐 Patching network methods to suppress extension errors')
    
    const isExtensionError = (error: any): boolean => {
      const message = error?.message || String(error)
      return message.includes('A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') ||
             message.includes('message channel closed before a response was received') ||
             message.includes('Extension context invalidated') ||
             message.includes('chrome-extension://') ||
             message.includes('moz-extension://')
    }
    
    // Patch fetch to handle extension errors
    const originalFetch = window.fetch
    window.fetch = function(...args: Parameters<typeof fetch>): Promise<Response> {
      return originalFetch.apply(this, args).catch((error) => {
        if (isExtensionError(error)) {
          console.warn('🔇 fetch: Suppressed extension error:', error?.message || error)
          // Return a fake successful response for extension errors
          return new Response('{}', { 
            status: 200, 
            statusText: 'OK',
            headers: { 'Content-Type': 'application/json' }
          })
        }
        throw error // Re-throw non-extension errors
      })
    }
    
    // Patch XMLHttpRequest to handle extension errors
    const originalXHROpen = XMLHttpRequest.prototype.open
    const originalXHRSend = XMLHttpRequest.prototype.send
    
    XMLHttpRequest.prototype.open = function(...args: any[]) {
      // Store original error handler
      const originalOnError = this.onerror
      const originalOnAbort = this.onabort
      
      // Wrap error handlers
      this.onerror = function(event) {
        if (isExtensionError(event)) {
          console.warn('🔇 XHR.onerror: Suppressed extension error:', event)
          return
        }
        if (originalOnError) {
          originalOnError.call(this, event)
        }
      }
      
      this.onabort = function(event) {
        if (isExtensionError(event)) {
          console.warn('🔇 XHR.onabort: Suppressed extension error:', event)
          return
        }
        if (originalOnAbort) {
          originalOnAbort.call(this, event)
        }
      }
      
      return (originalXHROpen as any).apply(this, args)
    }
    
    // Mark as patched
    ;(window as any).__networkErrorPatched = true
    
    return () => {
      // Restore original methods on cleanup
      if ((window as any).__networkErrorPatched) {
        window.fetch = originalFetch
        XMLHttpRequest.prototype.open = originalXHROpen
        XMLHttpRequest.prototype.send = originalXHRSend
        delete (window as any).__networkErrorPatched
        console.log('🌐 Restored original network methods')
      }
    }
  }, [])
  
  return null
}
