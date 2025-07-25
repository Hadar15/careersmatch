# URGENT: OAuth Redirect Debug Steps

## The Problem
You're still getting redirected to `http://localhost:3000/?code=...` even after setting up the redirectTo parameter.

## Debug Steps to Follow:

### 1. Check Browser Developer Console
1. Open your deployed site at `https://careersmatchai.vercel.app`
2. Open Developer Tools (F12)
3. Go to Console tab
4. Click "Login with Google" button
5. Check what the console logs show for:
   - `Environment NEXT_PUBLIC_BASE_URL:`
   - `Window origin:`
   - `Final baseUrl:`
   - `Hardcoded redirectTo:`

### 2. Verify Supabase Configuration
**CRITICAL**: Go to your Supabase Dashboard → Authentication → URL Configuration and make sure you have:

**Site URL:**
```
https://careersmatchai.vercel.app/
```

**Redirect URLs:** (Must include BOTH)
```
https://careersmatchai.vercel.app/
https://careersmatchai.vercel.app/auth/callback
```

### 3. Verify Vercel Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Make sure you have:
   - Name: `NEXT_PUBLIC_BASE_URL`
   - Value: `https://careersmatchai.vercel.app`
   - Environment: Production (checked)

### 4. Test Results
After clicking the Google login button:
- If you see console logs with the correct values but still get redirected to localhost → **Supabase configuration issue**
- If console shows `undefined` for environment variable → **Vercel environment variable issue**
- If console shows localhost in window.origin → **You're testing on localhost instead of production**

### 5. Common Issues:
1. **Environment variable not deployed**: Redeploy after adding environment variables
2. **Supabase redirect URLs not saved**: Make sure to click "Save" in Supabase dashboard
3. **Testing on localhost**: Make sure you're testing on `https://careersmatchai.vercel.app`, not `localhost:3000`
4. **Browser cache**: Clear browser cache or use incognito mode

## Report Back:
Please share what the console logs show when you click the Google login button on your PRODUCTION site.
