# Deployment Guide - Star System Sorter

## Overview

This guide covers deploying the Star System Sorter to production using either Vercel or Netlify.

## Prerequisites

- Node.js 20+
- npm
- BodyGraph API key

## Platform Configuration

### Option 1: Vercel

**1. Install Vercel CLI (optional)**

```bash
npm install -g vercel
```

**2. Deploy**

```bash
cd star-system-sorter
vercel
```

**3. Set Environment Variable**
In the Vercel dashboard:

- Go to Project Settings → Environment Variables
- Add: `BODYGRAPH_API_KEY` = `your_api_key_here`
- **IMPORTANT**: Do NOT use `VITE_` prefix (this would expose the key to the client)

**4. Configuration**
The `vercel.json` file is already configured with:

- API rewrites: `/api/*` → serverless function at `/api/hd.ts`
- SPA fallback: All routes → `/index.html`

**5. Verify Deployment**

- Test API: `https://your-app.vercel.app/api/hd` (POST request)
- Test routes: `https://your-app.vercel.app/input` (should load, not 404)

---

### Option 2: Netlify

**1. Install Netlify CLI (optional)**

```bash
npm install -g netlify-cli
```

**2. Deploy**

```bash
cd star-system-sorter
netlify deploy --prod
```

**3. Set Environment Variable**
In the Netlify dashboard:

- Go to Site Settings → Environment Variables
- Add: `BODYGRAPH_API_KEY` = `your_api_key_here`
- **IMPORTANT**: Do NOT use `VITE_` prefix (this would expose the key to the client)

**4. Configuration**
The `netlify.toml` file is already configured with:

- Build command: `npm run build`
- Publish directory: `dist`
- API redirects: `/api/*` → Netlify function at `/netlify/functions/hd.ts`
- SPA fallback: All routes → `/index.html`

**5. Verify Deployment**

- Test API: `https://your-app.netlify.app/api/hd` (POST request)
- Test routes: `https://your-app.netlify.app/input` (should load, not 404)

---

## Testing Production Build Locally

**1. Build the application**

```bash
cd star-system-sorter
npm run build
```

**2. Preview the build**

```bash
npm run preview
```

**3. Test the preview**

- Open `http://localhost:4173` (or the port shown)
- Navigate to `/input`, `/result`, `/why` - all should load
- Note: API calls will fail locally without the serverless function running

---

## Verification Checklist

After deployment, verify:

- [ ] All routes load without 404 errors:
  - `/` (onboarding)
  - `/input` (form)
  - `/result` (results)
  - `/why` (explanation)
- [ ] Direct access to routes works (not just navigation)
- [ ] Page refresh on any route doesn't cause 404
- [ ] API endpoint responds: POST to `/api/hd` with valid data
- [ ] No `BODYGRAPH_API_KEY` in client bundle (check browser DevTools → Sources)
- [ ] HTTPS is enabled (automatic on both platforms)
- [ ] Form submission works end-to-end

---

## Troubleshooting

### API Key Not Working

- Verify environment variable name is `BODYGRAPH_API_KEY` (no `VITE_` prefix)
- Redeploy after setting environment variables
- Check serverless function logs in platform dashboard

### Routes Return 404

- Verify `vercel.json` or `netlify.toml` is in the project root
- Check that SPA fallback redirect is configured
- Ensure `dist/index.html` exists after build

### API Calls Fail

- Check serverless function logs in platform dashboard
- Verify API key is set correctly
- Test with curl: `curl -X POST https://your-app.com/api/hd -H "Content-Type: application/json" -d '{"dateISO":"1990-01-15","time":"14:30","timeZone":"America/New_York"}'`

### Build Fails

- Run `npm run build` locally to reproduce
- Check for TypeScript errors
- Verify all dependencies are installed

---

## Security Notes

- ✅ API key stored server-side only (environment variable)
- ✅ No `VITE_` prefix on API key (prevents client exposure)
- ✅ HTTPS enforced by default on both platforms
- ✅ CORS configured in serverless functions
- ✅ Rate limiting handled by serverless function
- ✅ Cache keys are hashed (no raw PII)

---

## Performance

- **Caching**: 30-day TTL reduces API calls by ~95%
- **CDN**: Static assets served from edge locations
- **Serverless**: Auto-scaling based on demand
- **Build Size**: Optimized with Vite tree-shaking

---

## Monitoring

**Vercel:**

- View logs: Project → Deployments → [deployment] → Functions
- Analytics: Project → Analytics

**Netlify:**

- View logs: Site → Functions → [function] → Logs
- Analytics: Site → Analytics

---

## Rollback

**Vercel:**

- Go to Deployments → Select previous deployment → Promote to Production

**Netlify:**

- Go to Deploys → Select previous deploy → Publish deploy

---

## Support

For issues with:

- **Deployment**: Check platform documentation (Vercel/Netlify)
- **API Integration**: Review `server/src/routes/hd.ts` for reference implementation
- **Build Errors**: Run `npm run build` locally and check TypeScript errors
