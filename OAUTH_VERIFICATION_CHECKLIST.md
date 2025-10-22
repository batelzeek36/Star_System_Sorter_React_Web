# OAuth Setup Verification Checklist

## ✅ Your Client ID
```
561870327787-eopkkl32jt0cnn74b949v35b8859cmnv.apps.googleusercontent.com
```

## Configuration Checklist

### 1. ✅ Vercel Environment Variables
- [x] Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- [x] Variable: `VITE_GOOGLE_CLIENT_ID`
- [x] Value: `561870327787-eopkkl32jt0cnn74b949v35b8859cmnv.apps.googleusercontent.com`
- [x] Environment: Production (and optionally Preview/Development)
- [x] Redeploy after adding

### 2. ✅ Local Development (.env)
- [x] File created: `star-system-sorter/.env`
- [x] Contains: `VITE_GOOGLE_CLIENT_ID=561870327787-eopkkl32jt0cnn74b949v35b8859cmnv.apps.googleusercontent.com`
- [x] Added to `.gitignore` (so it won't be committed)

### 3. ⚠️ Google Cloud Console - Authorized Origins
You need to add your Vercel URL to Google Cloud Console:

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to: **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173` (for local dev)
   - `https://your-app.vercel.app` (your production URL)
   - `https://your-custom-domain.com` (if you have one)

6. Under **Authorized redirect URIs**, add the same URLs
7. Click **SAVE**

**⚠️ Important:** Without this step, OAuth will fail with "redirect_uri_mismatch" error!

### 4. ⚠️ OAuth Consent Screen
Make sure you've configured:

1. Go to: **APIs & Services** → **OAuth consent screen**
2. Fill in required fields:
   - App name: `Star System Sorter`
   - User support email: Your email
   - Developer contact: Your email
3. Add your domain (optional but recommended)
4. Save

### 5. Test Users (Optional but Recommended)
Add yourself and beta testers:

1. In OAuth consent screen, scroll to **Test users**
2. Click **+ ADD USERS**
3. Add email addresses (up to 100)
4. Click **SAVE**

## Testing the Setup

### Test Locally

```bash
cd star-system-sorter
npm run dev
```

Visit `http://localhost:5173` and:
1. Click "Continue with Google"
2. Google popup should appear
3. Sign in
4. Should redirect to `/onboarding`
5. Check browser console for: `Google login successful: [Your Name]`

### Test on Production

Visit your Vercel URL:
1. Click "Continue with Google"
2. If you see "redirect_uri_mismatch" → Add your Vercel URL to authorized origins
3. If you see "This app isn't verified" → Click Advanced → Go to app (this is normal)
4. Sign in
5. Should redirect to `/onboarding`

## Common Issues & Solutions

### Issue: "redirect_uri_mismatch"
**Solution:** Add your Vercel URL to authorized origins in Google Cloud Console

### Issue: Google button not showing
**Solution:** 
- Check browser console for errors
- Verify `VITE_GOOGLE_CLIENT_ID` is set
- Restart dev server (for local)
- Redeploy (for production)

### Issue: "Invalid client ID"
**Solution:**
- Verify Client ID is correct
- Make sure it ends with `.apps.googleusercontent.com`
- Check for extra spaces or quotes

### Issue: "This app isn't verified"
**Solution:**
- This is normal for apps in Testing mode
- Click "Advanced" → "Go to [App Name] (unsafe)"
- Or add users as test users in OAuth consent screen
- Or use "Continue as Guest" instead

## Quick Verification Commands

### Check if .env exists locally
```bash
cat star-system-sorter/.env
# Should show: VITE_GOOGLE_CLIENT_ID=561870327787...
```

### Check if environment variable is loaded
```bash
cd star-system-sorter
npm run dev
# In browser console, type:
# import.meta.env.VITE_GOOGLE_CLIENT_ID
# Should show your Client ID
```

### Check Vercel environment variables
```bash
vercel env ls
# Should show VITE_GOOGLE_CLIENT_ID
```

## What's Working vs What Needs Setup

### ✅ Already Working
- Code implementation
- Auth store
- Login screen
- Tests
- Local .env file created
- Vercel environment variable added

### ⚠️ Needs Your Action
- [ ] Add Vercel URL to Google Cloud Console authorized origins
- [ ] Verify OAuth consent screen is configured
- [ ] (Optional) Add test users
- [ ] Test OAuth flow on production

## Next Steps

1. **Add your Vercel URL to Google Cloud Console** (5 min)
   - This is the most important step!
   - Without it, OAuth will fail

2. **Test locally** (2 min)
   ```bash
   npm run dev
   # Try Google login
   ```

3. **Test on production** (2 min)
   - Visit your Vercel URL
   - Try Google login
   - Should work after step 1

4. **Add test users** (optional, 2 min)
   - Add 5-10 beta testers
   - They won't see "unverified" warning

## Summary

**What you have:**
- ✅ Client ID: `561870327787-eopkkl32jt0cnn74b949v35b8859cmnv.apps.googleusercontent.com`
- ✅ Vercel environment variable set
- ✅ Local .env file created
- ✅ Code fully implemented

**What you need to do:**
- ⚠️ Add your Vercel URL to Google Cloud Console authorized origins
- ⚠️ Test the OAuth flow

**Time needed:** ~10 minutes

Once you add your Vercel URL to authorized origins, everything should work!
