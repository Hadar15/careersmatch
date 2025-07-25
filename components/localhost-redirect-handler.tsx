"use client"

import { useEffect } from 'react'

export function LocalhostRedirectHandler() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleLocalhostRedirect = () => {
      const isLocalhost = window.location.hostname === 'localhost';
      const hasOAuthCode = window.location.search.includes('code=');
      const hasOAuthParams = window.location.search.includes('access_token=') || 
                            window.location.search.includes('refresh_token=') ||
                            window.location.hash.includes('access_token=');
      
      if (isLocalhost && (hasOAuthCode || hasOAuthParams)) {
        const currentUrl = window.location.href;
        const productionUrl = currentUrl.replace('http://localhost:3000', 'https://careersmatchai.vercel.app');
        
        console.log('🚀 Detected OAuth redirect to localhost, redirecting to production:', productionUrl);
        
        // Use replace to avoid adding to history
        window.location.replace(productionUrl);
      }
    };

    // Run immediately
    handleLocalhostRedirect();
    
    // Also run on popstate (back/forward navigation)
    window.addEventListener('popstate', handleLocalhostRedirect);
    
    return () => {
      window.removeEventListener('popstate', handleLocalhostRedirect);
    };
  }, []);

  return null;
}
