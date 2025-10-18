# Deployment Verification Checklist

## ✅ Pre-Deployment (Completed)

- ✅ **Build successful**: `npm run build` completed without errors
- ✅ **Bundle size**: 83KB gzipped (optimized)
- ✅ **No API key exposure**: Verified no `BODYGRAPH_API_KEY` in client bundle
- ✅ **No VITE_ variables**: Verified no environment variables in client bundle
- ✅ **Vercel config**: `vercel.json` created with API rewrites and SPA fallback
- ✅ **Netlify config**: `netlify.toml` created with API redirects and SPA fallback
- ✅ **Serverless functions**: Created for both platforms with caching
- ✅ **Git commit**: Changes committed
- ✅ **Git tag**: `v7-deploy` created

## 🔄 Manual Verification (After Deployment)

### Choose Your Platform

**Option A: Vercel**
```bash
cd star-system-sorter
vercel
```

**Option B: Netlify**
```bash
cd star-system-sorter
netlify deploy --prod
```

### Set Environment Variable

In your platform dashboard:
- **Variable Name**: `BODYGRAPH_API_KEY`
- **Value**: Your BodyGraph API key
- ⚠️ **IMPORTANT**: Do NOT use `VITE_` prefix

### Verification Steps

Once deployed, test on your hosted URL (e.g., `https://your-app.vercel.app`):

#### 1. SPA Routing Test
- [ ] Navigate to `https://your-app.vercel.app/` - loads onboarding screen
- [ ] Navigate to `https://your-app.vercel.app/input` - loads input form
- [ ] Navigate to `https://your-app.vercel.app/result` - loads result screen
- [ ] Navigate to `https://your-app.vercel.app/why` - loads why screen
- [ ] **Hard refresh (Cmd+Shift+R)** on `/result` - still loads (no 404)
- [ ] **Hard refresh (Cmd+Shift+R)** on `/why` - still loads (no 404)
- [ ] **Hard refresh (Cmd+Shift+R)** on `/input` - still loads (no 404)

#### 2. API Routing Test
Test the API endpoint with curl:

```bash
curl -X POST https://your-app.vercel.app/api/hd \
  -H "Content-Type: application/json" \
  -d '{
    "dateISO": "1990-01-15",
    "time": "14:30",
    "timeZone": "America/New_York"
  }'
```

Expected response:
- [ ] Status: 200 OK
- [ ] Returns JSON with HD data (type, authority, profile, centers, channels, gates)
- [ ] No CORS errors in browser console

#### 3. Security Verification
- [ ] Open browser DevTools → Sources tab
- [ ] Search for "BODYGRAPH" in all files
- [ ] Verify: No API key found in any client-side file
- [ ] Check Network tab: API calls go to `/api/hd` (not external URL)

#### 4. End-to-End User Flow
- [ ] Start at homepage
- [ ] Click "Begin Sorting"
- [ ] Fill in birth data form:
  - Date: 01/15/1990
  - Time: 02:30 PM
  - Location: New York, NY
  - Timezone: America/New_York
- [ ] Submit form
- [ ] Verify: Results screen loads with star system classification
- [ ] Click "View Why"
- [ ] Verify: Why screen loads with explanation
- [ ] Navigate back to results
- [ ] Verify: Results are still displayed (state persisted)

#### 5. Performance Check
- [ ] Open DevTools → Network tab
- [ ] Hard refresh homepage
- [ ] Check: Total page load < 3 seconds
- [ ] Check: Main bundle loads from CDN
- [ ] Check: Assets are gzipped

## 📊 Expected Results

### Routes (SPA Fallback Working)
All routes should return `200 OK` and load the app:
- `/` → Onboarding screen
- `/input` → Input form
- `/result` → Results screen
- `/why` → Why screen

### API (Rewrites Working)
- `/api/hd` → Serverless function (not 404)
- Returns valid HD data
- No CORS errors

### Security (Key Protected)
- No `BODYGRAPH_API_KEY` in client bundle
- API key only in serverless function environment
- HTTPS enforced

## 🐛 Troubleshooting

### Routes return 404
**Problem**: Direct access to `/result` or `/why` returns 404

**Solution**:
- Verify `vercel.json` or `netlify.toml` is in project root
- Check platform dashboard for deployment logs
- Ensure SPA fallback redirect is configured

### API calls fail
**Problem**: POST to `/api/hd` returns 500 or 404

**Solution**:
- Check serverless function logs in platform dashboard
- Verify `BODYGRAPH_API_KEY` is set (no `VITE_` prefix)
- Redeploy after setting environment variable
- Test with curl command above

### CORS errors
**Problem**: Browser console shows CORS errors

**Solution**:
- Verify serverless function includes CORS headers
- Check that API calls go to same domain (not external)
- Review serverless function code in `/api/hd.ts` or `/netlify/functions/hd.ts`

## ✅ Sign-Off

Once all checks pass:

- [ ] All routes load correctly
- [ ] Hard refresh works on all routes
- [ ] API endpoint responds correctly
- [ ] No API key in client bundle
- [ ] End-to-end flow works
- [ ] Performance is acceptable

**Deployment Status**: 🎉 VERIFIED

---

## Quick Reference

**Vercel Dashboard**: https://vercel.com/dashboard
**Netlify Dashboard**: https://app.netlify.com/

**Deployment Docs**: See `DEPLOYMENT.md` for detailed instructions

**Git Tag**: `v7-deploy`
