# Vercel Deployment - ui-dossier Branch

## ✅ Production Deployment Successful!

### Deployment URLs

**Production URL**: https://star-system-sorter-5v0zdlh7h-royalust.vercel.app

**Inspect Dashboard**: https://vercel.com/royalust/star-system-sorter/8YywGS5iowhbitfj6cKoDMx8jpee

**Previous Preview URL**: https://star-system-sorter-1ty0a5w0e-royalust.vercel.app

## What's Deployed

The **ui-dossier** branch with:
- 🎯 Hybrid Dossier Design (default)
- 📋 Original Design (toggle option)
- ✨ New Design (toggle option)
- 🔄 3-way version toggle
- ●●●●● Enhanced confidence dots
- All new UI components (Table, Tooltip)

## Testing the Preview

1. **Visit the preview URL**: https://star-system-sorter-1ty0a5w0e-royalust.vercel.app

2. **Navigate to Dossier**:
   - Go through the flow: Onboarding → Input → Result → Dossier
   - Or use test data if available

3. **Test the Toggle**:
   - Click "Cycle Version" button (top-right)
   - Compare all 3 versions: Hybrid → Old → New
   - Check the version indicator badge (top-left)

4. **Test Features**:
   - Export PNG
   - Print/PDF
   - Generate Narrative
   - Responsive design (mobile/tablet/desktop)

## ✅ Deployed to Production

**Status**: LIVE

**Production URL**: https://star-system-sorter-5v0zdlh7h-royalust.vercel.app

The ui-dossier branch with the hybrid Dossier design is now live in production!

## Environment Variables

Make sure these are set in Vercel dashboard:
- `BODYGRAPH_API_KEY` - Your BodyGraph API key (should already be set)

Check at: https://vercel.com/royalust/star-system-sorter/settings/environment-variables

## Rollback (If Needed)

If you need to rollback to a previous deployment:
1. Go to: https://vercel.com/royalust/star-system-sorter
2. Click on "Deployments"
3. Find the previous working deployment
4. Click "..." → "Promote to Production"

## Branch Strategy

### Current Setup
- **Branch**: ui-dossier
- **Status**: Preview deployed
- **Production**: Not yet deployed

### Recommended Workflow
1. ✅ Test preview deployment thoroughly
2. ✅ Get feedback from team/users
3. ⏳ Merge ui-dossier to main (or deploy directly)
4. ⏳ Deploy to production

### Option 1: Deploy ui-dossier to Production
```bash
# Deploy current branch to production
cd star-system-sorter
vercel --prod
```

### Option 2: Merge to Main First
```bash
# Merge to main
git checkout main
git merge ui-dossier
git push origin main

# Then deploy main to production
cd star-system-sorter
vercel --prod
```

## Build Configuration

Vercel automatically detects:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## API Routes

The `/api/hd` endpoint is configured via `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/hd"
    }
  ]
}
```

Make sure the serverless function is working:
- Test: https://star-system-sorter-1ty0a5w0e-royalust.vercel.app/api/hd

## Monitoring

### Check Deployment Status
```bash
vercel ls
```

### View Logs
```bash
vercel logs [deployment-url]
```

### Check Build Logs
Visit: https://vercel.com/royalust/star-system-sorter/deployments

## Troubleshooting

### If Preview Doesn't Work
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Check API endpoint is responding
4. Test locally first: `npm run build && npm run preview`

### If API Calls Fail
1. Verify `BODYGRAPH_API_KEY` is set in Vercel
2. Check serverless function logs
3. Test API endpoint directly

### If Styles Look Wrong
1. Check if CSS is being loaded
2. Verify Tailwind is configured correctly
3. Check browser console for errors

## Next Steps

1. **Test the preview deployment** ✅ (link above)
2. **Verify all features work**
3. **Get feedback** (if needed)
4. **Deploy to production** (when ready)
5. **Monitor for issues**

## Quick Commands

```bash
# Deploy preview (already done)
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm [deployment-url]
```

---

**Preview is live!** Test it at: https://star-system-sorter-1ty0a5w0e-royalust.vercel.app

When you're ready to go to production, run: `vercel --prod`
