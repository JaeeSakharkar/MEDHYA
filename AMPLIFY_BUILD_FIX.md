# Amplify Build Fix Guide

The build is failing due to an environment variable issue. Here are several solutions:

## Quick Fix 1: Update Amplify Build Settings

In your Amplify console:

1. Go to App Settings → Environment variables
2. Add these variables:
   ```
   VITE_COGNITO_DOMAIN = medhya.auth.us-east-1.amazoncognito.com
   VITE_COGNITO_CLIENT_ID = 6npa9g9it0o66diikabm29j9je
   VITE_REDIRECT_URI = https://main.your-app-id.amplifyapp.com/callback
   VITE_LOGOUT_URI = https://main.your-app-id.amplifyapp.com/login
   VITE_API_BASE_URL = https://p0r3ff73bh.execute-api.us-east-1.amazonaws.com/prod
   ```

3. Redeploy your app

## Quick Fix 2: Update amplify.yml

Update your `amplify.yml` file:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - echo "VITE_COGNITO_DOMAIN=medhya.auth.us-east-1.amazoncognito.com" > .env.production
        - echo "VITE_COGNITO_CLIENT_ID=6npa9g9it0o66diikabm29j9je" >> .env.production
        - echo "VITE_REDIRECT_URI=https://main.$AWS_APP_ID.amplifyapp.com/callback" >> .env.production
        - echo "VITE_LOGOUT_URI=https://main.$AWS_APP_ID.amplifyapp.com/login" >> .env.production
        - echo "VITE_API_BASE_URL=https://p0r3ff73bh.execute-api.us-east-1.amazonaws.com/prod" >> .env.production
        - npm run build
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

## Quick Fix 3: Hardcode Values (Temporary)

Update `frontend/src/contexts/AuthContext.tsx`:

```typescript
// AWS Cognito configuration - hardcoded for deployment
const COGNITO_DOMAIN = 'medhya.auth.us-east-1.amazoncognito.com';
const CLIENT_ID = '6npa9g9it0o66diikabm29j9je';
const REDIRECT_URI = window.location.origin + '/callback';
const LOGOUT_URI = window.location.origin + '/login';
```

## Quick Fix 4: Use Different Hosting

If Amplify continues to have issues, use alternative hosting:

### GitHub Pages
```bash
# Run this locally
npm run build
# Upload dist/ folder to GitHub Pages
```

### Netlify
1. Connect your GitHub repo to Netlify
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/dist`
4. Environment variables: Add the same variables as above

### Vercel
1. Connect your GitHub repo to Vercel
2. Framework preset: Vite
3. Root directory: `frontend`
4. Environment variables: Add the same variables as above

## Debug Steps

1. **Check Environment Variables**: Make sure no trailing spaces
2. **Clean Build**: Delete node_modules and reinstall
3. **Local Test**: Run `npm run build` locally first
4. **Check Logs**: Look at full Amplify build logs for more details

## Alternative: Use LocalStorage Only

If you want to avoid backend complexity entirely:

1. Update your components to use `localApi` instead of backend calls
2. Remove all API_BASE_URL references
3. Use the localStorage-based solution we created earlier

This will give you a fully functional app without any backend dependencies.

## Test Locally First

Before deploying, always test locally:

```bash
cd frontend
npm install
npm run build
npm run preview
```

If it works locally, the issue is with the deployment environment.