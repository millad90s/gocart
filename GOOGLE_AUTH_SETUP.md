# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen if prompted:
   - Choose **External** for testing
   - Fill in app name: **GoCart**
   - Add your email
   - Add authorized domain (for production)
6. For Application type, select **Web application**
7. Add Authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:3001` (if using port 3001)
8. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3001/api/auth/callback/google`
9. Click **Create**
10. Copy the **Client ID** and **Client Secret**

## Step 2: Update Environment Variables

Replace the placeholder values in `.env.development`:

```env
GOOGLE_CLIENT_ID="your-actual-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-google-client-secret-here"
```

## Step 3: Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Replace the `NEXTAUTH_SECRET` value in `.env.development` with the generated secret.

## Step 4: Restart Development Server

```bash
npm run dev
```

## Testing Google Login

1. Visit your app at `http://localhost:3000`
2. Click the "Login" button in the navbar
3. You'll be redirected to Google's sign-in page
4. Sign in with your Google account
5. Grant permissions to GoCart
6. You'll be redirected back to your app, now logged in!

## User Profile Features

Once logged in:
- Profile picture displays in navbar
- Click profile to see dropdown menu:
  - My Profile (`/profile`)
  - My Orders (`/orders`)
  - My Store (`/store`)
  - Admin Panel (`/admin`)
  - Sign Out

## Database Schema Changes

The User model now includes:
- `id` - Auto-generated CUID
- `name` - Optional (from Google)
- `email` - Unique, required (from Google)
- `emailVerified` - Email verification timestamp
- `image` - Profile picture URL (from Google)
- `accounts` - OAuth accounts linked
- `sessions` - Active sessions

New tables added:
- `Account` - OAuth provider accounts
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

## Production Setup

For production (`.env.production`):

```env
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret-key"
GOOGLE_CLIENT_ID="your-production-google-client-id"
GOOGLE_CLIENT_SECRET="your-production-google-client-secret"
```

Remember to add your production domain to Google OAuth authorized origins and redirect URIs.
