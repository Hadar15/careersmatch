"use client"

import { useEffect } from 'react'

export default function ExtensionErrorSuppressor() {
  useEffect(() => {
    // Track if we've already patched to avoid double patching
    if ((window as any).__extensionErrorPatched) {
      return
    }

    console.log('🔧 Initializing enhanced extension error suppression')

    const isExtensionError = (error: any): boolean => {
      const message = error?.message || String(error)
      return message.includes('A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received') ||
             message.includes('message channel closed before a response was received') ||
             message.includes('Extension context invalidated') ||
             message.includes('chrome-extension://') ||
             message.includes('moz-extension://') ||
             message.includes('Could not establish connection') ||
             message.includes('Receiving end does not exist') ||
             message.includes('The message port closed before a response was received')
    }

    // Enhanced global error handlers
    const originalWindowError = window.onerror
    const originalUnhandledRejection = window.onunhandledrejection

    // Global error handler
    window.onerror = function(message, source, lineno, colno, error) {
      if (typeof message === 'string' && isExtensionError({ message })) {
        console.warn('🔇 Global: Suppressed extension error:', message)
        return true // Prevent default error handling
      }
      return originalWindowError ? originalWindowError.call(this, message, source, lineno, colno, error) : false
    }

    // Unhandled promise rejection handler
    window.onunhandledrejection = function(event) {
      if (isExtensionError(event.reason)) {
        console.warn('🔇 Unhandled rejection: Suppressed extension error:', event.reason?.message || event.reason)
        event.preventDefault()
        return
      }
      if (originalUnhandledRejection) {
        return originalUnhandledRejection.call(window, event)
      }
    }

    // Patch Promise methods
    const originalPromiseConstructor = window.Promise
    const originalThen = originalPromiseConstructor.prototype.then
    const originalCatch = originalPromiseConstructor.prototype.catch

    // Enhanced Promise.prototype.then
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

    // Enhanced Promise.prototype.catch
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

    // Patch XMLHttpRequest to handle extension interference
    const originalXHR = window.XMLHttpRequest
    window.XMLHttpRequest = function(this: XMLHttpRequest) {
      const xhr = new originalXHR()
      
      // Wrap event handlers to catch extension errors
      const originalAddEventListener = xhr.addEventListener
      xhr.addEventListener = function(type: string, listener: any, options?: any) {
        const wrappedListener = function(this: any, event: any) {
          try {
            return listener.call(this, event)
          } catch (error) {
            if (isExtensionError(error)) {
              console.warn('🔇 XHR Event: Suppressed extension error in', type, 'listener:', error)
              return
            }
            throw error
          }
        }
        return originalAddEventListener.call(this, type, wrappedListener, options)
      }
      
      return xhr
    } as any

    // Patch fetch to handle extension interference
    const originalFetch = window.fetch
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      return originalFetch.call(this, input, init).catch((error: any) => {
        if (isExtensionError(error)) {
          console.warn('🔇 Fetch: Suppressed extension error:', error)
          // Return a resolved promise with a mock response for extension errors
          return Promise.resolve(new Response(JSON.stringify({ error: 'Extension interference detected' }), {
            status: 200,
            statusText: 'OK (Extension Error Suppressed)'
          }))
        }
        throw error
      })
    }

    // Mark as patched
    ;(window as any).__extensionErrorPatched = true
    console.log('✅ Enhanced extension error suppression active')

    return () => {
      // Restore original methods on cleanup
      if ((window as any).__extensionErrorPatched) {
        window.onerror = originalWindowError
        window.onunhandledrejection = originalUnhandledRejection
        ;(originalPromiseConstructor.prototype as any).then = originalThen
        ;(originalPromiseConstructor.prototype as any).catch = originalCatch
        window.XMLHttpRequest = originalXHR
        window.fetch = originalFetch
        delete (window as any).__extensionErrorPatched
        console.log('🔧 Restored original methods')
      }
    }
  }, [])
  
  return null
}
