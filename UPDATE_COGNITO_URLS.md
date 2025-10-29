# Update Cognito Callback URLs

## Issue
Your frontend is running on port 8081 instead of 8080, but your Cognito User Pool is configured for port 8080.

## Solution
You need to update your Cognito User Pool settings to allow the new URLs.

### Step 1: Update Cognito User Pool
1. Go to AWS Cognito Console
2. Select your User Pool
3. Go to "App integration" tab
4. Click on your App client "medhya"
5. Scroll down to "Hosted UI" section
6. Click "Edit"

### Step 2: Update Callback URLs
**Add these URLs to your existing ones (don't remove the old ones yet):**

**Allowed callback URLs:**
- `http://localhost:8080/callback` (existing)
- `http://localhost:8081/callback` (new)

**Allowed sign-out URLs:**
- `http://localhost:8080/login` (existing)  
- `http://localhost:8081/login` (new)

**OAuth 2.0 grant types (IMPORTANT):**
- ✅ Implicit grant (required for frontend apps)
- ✅ Authorization code grant (optional, but requires client secret)

**OAuth scopes:**
- ✅ email
- ✅ openid  
- ✅ phone

### Step 3: Save Changes
Click "Save changes" in the Cognito console.

### Step 4: Test the Updated URLs
Your working login URL should now be:
```
https://medhya.auth.us-east-1.amazoncognito.com/login?client_id=6npa9g9it0o66diikabm29j9je&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2Fcallback
```

### Alternative: Force Frontend to Use Port 8080
If you prefer to keep using port 8080, you can:

1. Stop the frontend process
2. Find what's using port 8080: `netstat -ano | findstr :8080`
3. Kill that process or change its port
4. Restart the frontend

### Current Status
- ✅ Backend running on port 5000
- ✅ Frontend running on port 8081
- ❌ Cognito configured for port 8080 (needs update)

### Next Steps
1. Update Cognito URLs as described above
2. Test login flow: http://localhost:8081
3. You should be able to login and get redirected properly