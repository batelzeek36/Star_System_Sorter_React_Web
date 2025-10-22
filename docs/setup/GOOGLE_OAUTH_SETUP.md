# Google OAuth Setup Guide

## Overview

This guide walks you through setting up Google OAuth for Star System Sorter. The implementation uses `@react-oauth/google` for a seamless authentication experience.

## Prerequisites

- Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `Star System Sorter` (or your preferred name)
4. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" (unless you have a Google Workspace)
3. Click "Create"

### Fill in the required fields:

**App information:**

- App name: `Star System Sorter`
- User support email: Your email
- App logo: (Optional) Upload your logo

**App domain:**

- Application home page: `https://yourdomain.com`
- Privacy policy: `https://yourdomain.com/privacy`
- Terms of service: `https://yourdomain.com/terms`

**Developer contact:**

- Email addresses: Your email

4. Click "Save and Continue"
5. Skip "Scopes" (default scopes are sufficient)
6. Add test users if in testing mode
7. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"

### Configure the OAuth client:

**Name:** `Star System Sorter Web Client`

**Authorized JavaScript origins:**

- Development: `http://localhost:5173`
- Production: `https://yourdomain.com`

**Authorized redirect URIs:**

- Development: `http://localhost:5173`
- Production: `https://yourdomain.com`

4. Click "Create"
5. **Copy your Client ID** - you'll need this!

## Step 5: Configure Environment Variables

### Development (.env)

Create a `.env` file in `star-system-sorter/`:

```bash
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

### Production (Netlify/Vercel)

Add the environment variable in your hosting platform:

**Netlify:**

1. Go to Site settings → Environment variables
2. Add: `VITE_GOOGLE_CLIENT_ID` = `your_client_id_here`

**Vercel:**

1. Go to Project Settings → Environment Variables
2. Add: `VITE_GOOGLE_CLIENT_ID` = `your_client_id_here`

## Step 6: Test the Integration

### Local Testing

1. Start the dev server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173`

3. Click "Continue with Google"

4. You should see the Google sign-in popup

5. Sign in with your Google account

6. You should be redirected to the onboarding screen

### Verify Authentication

Check the browser console for:

```
Google login successful: [Your Name]
```

Check localStorage:

```javascript
localStorage.getItem("auth-store");
```

You should see your user data stored.

## Troubleshooting

### Error: "Invalid client ID"

**Solution:**

- Verify your Client ID is correct in `.env`
- Make sure it ends with `.apps.googleusercontent.com`
- Restart your dev server after changing `.env`

### Error: "Redirect URI mismatch"

**Solution:**

- Check that `http://localhost:5173` is in "Authorized JavaScript origins"
- Make sure there are no trailing slashes
- Wait a few minutes for Google's changes to propagate

### Error: "Access blocked: This app's request is invalid"

**Solution:**

- Complete the OAuth consent screen configuration
- Add your email as a test user
- Make sure the app is not in "Production" status if you haven't verified it

### Google button not appearing

**Solution:**

- Check browser console for errors
- Verify `VITE_GOOGLE_CLIENT_ID` is set
- Make sure you're using `VITE_` prefix (required for Vite)
- Clear browser cache and reload

### "This app isn't verified" warning

**Solution:**

- This is normal for apps in testing mode
- Click "Advanced" → "Go to [App Name] (unsafe)"
- For production, submit your app for verification (optional)

## Security Best Practices

### DO:

- ✅ Keep your Client ID in environment variables
- ✅ Use HTTPS in production
- ✅ Regularly rotate credentials if compromised
- ✅ Monitor OAuth usage in Google Cloud Console
- ✅ Set up proper CORS policies

### DON'T:

- ❌ Commit `.env` files to git
- ❌ Share your Client ID publicly (though it's not a secret)
- ❌ Use the same credentials for dev and production
- ❌ Skip the OAuth consent screen configuration

## Features Implemented

### ✅ Current Features

- Google OAuth login with One Tap
- Guest mode (no authentication required)
- User profile storage (name, email, picture)
- Persistent sessions (localStorage)
- Automatic token handling
- Logout functionality

### 🚀 Future Enhancements

- Token refresh
- Session expiration
- Multiple OAuth providers (Apple, Facebook)
- Email/password authentication
- Two-factor authentication

## User Flow

```
Login Screen
    ↓
[Google OAuth Button]
    ↓
Google Sign-In Popup
    ↓
User Grants Permission
    ↓
JWT Token Received
    ↓
Token Decoded
    ↓
User Data Stored (authStore)
    ↓
Navigate to Onboarding
```

## API Reference

### Auth Store

```typescript
import { useAuthStore } from "./store/authStore";

// Get current user
const user = useAuthStore((state) => state.user);

// Check if authenticated
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// Login with Google
const login = useAuthStore((state) => state.login);
login({
  id: "google-123",
  email: "user@example.com",
  name: "User Name",
  picture: "https://...",
  isGuest: false,
});

// Login as guest
const loginAsGuest = useAuthStore((state) => state.loginAsGuest);
loginAsGuest();

// Logout
const logout = useAuthStore((state) => state.logout);
logout();
```

### User Object

```typescript
interface User {
  id: string; // Google sub or guest ID
  email: string; // User email
  name: string; // Display name
  picture?: string; // Profile picture URL
  isGuest: boolean; // True if guest user
}
```

## Testing

### Unit Tests

```bash
# Test auth store
npm test -- authStore.test.ts --run

# Test login screen
npm test -- LoginScreen.test.tsx --run
```

### E2E Tests

```bash
# Test login flow
npm run test:e2e -- login-flow.spec.ts
```

## Production Checklist

Before deploying to production:

- [ ] OAuth consent screen fully configured
- [ ] Production domain added to authorized origins
- [ ] Environment variable set in hosting platform
- [ ] Privacy policy page created
- [ ] Terms of service page created
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Error monitoring set up
- [ ] Analytics tracking added (optional)

## Support

For issues with Google OAuth:

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React OAuth Google Library](https://github.com/MomenSherif/react-oauth)

For app-specific issues:

- Check browser console for errors
- Review `GOOGLE_OAUTH_SETUP.md` (this file)
- Contact development team

## Changelog

### v1.0.0 (Current)

- Initial Google OAuth implementation
- Guest mode support
- Persistent sessions
- One Tap sign-in

---

**Last Updated:** October 21, 2025
