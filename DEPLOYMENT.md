# 🚀 Deployment Guide

## Prerequisites
- GitHub account
- Vercel account
- All environment variables ready

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Production ready deployment"
git push origin main
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables in Vercel dashboard

### Required Environment Variables:
```
DATABASE_URL=your-postgresql-connection-string
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-secure-secret-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
OPENROUTER_API_KEY=your-openrouter-api-key
```

## Step 3: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your OAuth credentials
3. Add your Vercel domain to authorized redirect URIs:
   - `https://your-app-name.vercel.app/api/auth/callback/google`

## Step 4: Test Deployment

1. Visit your deployed app
2. Test authentication
3. Test all features
4. Check database connections

## 🎉 Your app is now live!

Your Arogya Sahayak application is production-ready and deployed!