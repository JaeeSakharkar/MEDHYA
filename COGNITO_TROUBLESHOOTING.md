# 🔐 Cognito Troubleshooting Guide

Let's get your Cognito authentication working step by step!

## 🔍 Current Configuration Check

### 1. **Cognito App Client Settings**
Go to AWS Cognito Console → User Pools → Your Pool → App Integration → App Client

**Required Settings:**
```
✅ App Client ID: 6npa9g9it0o66diikabm29j9je
✅ App Client Secret: Not required (public client)
✅ Authentication flows: 
   - ALLOW_USER_SRP_AUTH ✅
   - ALLOW_REFRESH_TOKEN_AUTH ✅
   - ALLOW_USER_PASSWORD_AUTH ✅ (optional)

✅ OAuth 2.0 Settings:
   - Implicit grant ✅
   - Authorization code grant ✅ (optional)
   
✅ OAuth Scopes:
   - email ✅
   - openid ✅
   - profile ✅

✅ Callback URLs:
   - http://localhost:8081/callback (for local dev)
   - https://your-amplify-domain.amplifyapp.com/callback (for production)

✅ Sign out URLs:
   - http://localhost:8081/login (for local dev)
   - https://your-amplify-domain.amplifyapp.com/login (for production)
```

### 2. **User Pool Settings**
```
✅ Domain: medhya.auth.us-east-1.amazoncognito.com
✅ User Pool ID: us-east-1_RsOYVRSJu
✅ Region: us-east-1
```

### 3. **User Groups**
Make sure you have an 'admin' group:
- Go to User Pool → Groups
- Create group named: `admin` (lowercase)
- Add your user to this group

## 🚀 Testing Steps

### Step 1: Test Cognito Hosted UI Directly
Open this URL in your browser:
```
https://medhya.auth.us-east-1.amazoncognito.com/login?client_id=6npa9g9it0o66diikabm29j9je&response_type=token&scope=email+openid+profile&redirect_uri=http://localhost:8081/callback
```

**Expected Result:** You should see the Cognito login page

### Step 2: Test Login Flow
1. Enter your credentials
2. Should redirect to: `http://localhost:8081/callback#id_token=...`
3. App should process the token and redirect to dashboard

### Step 3: Check Browser Console
Open Developer Tools → Console and look for:
- ✅ "Redirecting to Cognito: ..."
- ✅ "ID token found in hash (implicit flow)"
- ✅ "Login successful, user info: ..."
- ❌ Any error messages

## 🔧 Common Issues & Fixes

### Issue 1: "Invalid redirect URI"
**Fix:** Update Cognito App Client callback URLs
```bash
# Add these URLs to your Cognito App Client:
http://localhost:8081/callback
https://your-amplify-domain.amplifyapp.com/callback
```

### Issue 2: "User is not confirmed"
**Fix:** Confirm user in Cognito Console
1. Go to User Pool → Users
2. Find your user
3. Click "Confirm user" if status is "Unconfirmed"

### Issue 3: "User not in admin group"
**Fix:** Add user to admin group
1. Go to User Pool → Groups
2. Create group: `admin`
3. Go to Users → Your User → Add to group → Select `admin`

### Issue 4: "Token expired"
**Fix:** Login again - tokens expire after 1 hour

### Issue 5: CORS errors
**Fix:** Make sure your domain is in Cognito callback URLs

## 🧪 Debug Mode

Add this to your browser console to debug:
```javascript
// Check current auth state
console.log('Auth token:', localStorage.getItem('idToken'));

// Decode token (if exists)
const token = localStorage.getItem('idToken');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload);
  console.log('User groups:', payload['cognito:groups']);
  console.log('Token expires:', new Date(payload.exp * 1000));
}
```

## 🔄 Reset Authentication

If things get stuck, reset everything:
```javascript
// Clear all auth data
localStorage.removeItem('idToken');
localStorage.clear();

// Then refresh page and try login again
window.location.reload();
```

## 📱 Test URLs

### Local Development:
- **App**: http://localhost:8081
- **Login**: http://localhost:8081/login
- **Callback**: http://localhost:8081/callback

### Production (update with your domain):
- **App**: https://main.d1234567890.amplifyapp.com
- **Login**: https://main.d1234567890.amplifyapp.com/login
- **Callback**: https://main.d1234567890.amplifyapp.com/callback

## 🎯 Quick Test Script

Run this in your browser console on the login page:
```javascript
// Test Cognito URL generation
const COGNITO_DOMAIN = 'medhya.auth.us-east-1.amazoncognito.com';
const CLIENT_ID = '6npa9g9it0o66diikabm29j9je';
const REDIRECT_URI = window.location.origin + '/callback';

const authUrl = `https://${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=token&scope=email+openid+profile&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

console.log('Generated Auth URL:', authUrl);
console.log('Click this link to test:', authUrl);
```

## 🆘 Still Not Working?

1. **Check AWS CloudWatch Logs** for Cognito errors
2. **Verify User Pool Configuration** matches exactly
3. **Test with a fresh incognito window**
4. **Check browser network tab** for failed requests
5. **Verify user exists and is confirmed**

Let me know what specific error you're seeing and I'll help debug it! 🚀