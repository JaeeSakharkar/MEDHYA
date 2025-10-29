# AWS Cognito Integration Setup Guide

## Overview
This guide explains how to set up AWS Cognito authentication for the QuizMaster-V2 application.

## Prerequisites
- AWS Account with appropriate permissions
- Node.js and npm installed
- Basic understanding of AWS Cognito

## AWS Cognito Configuration

### 1. Create User Pool
1. Go to AWS Cognito Console
2. Click "Create user pool"
3. Configure sign-in options:
   - Email
   - Username (optional)
4. Configure security requirements:
   - Password policy (as per your requirements)
   - MFA (optional)
5. Configure sign-up experience:
   - Enable self-registration
   - Required attributes: email
6. Configure message delivery:
   - Email (use Cognito default for testing)
7. Integrate your app:
   - User pool name: `QuizMaster-UserPool`
   - App client name: `QuizMaster-Client`
   - Generate client secret: **NO** (for frontend apps)

### 2. Configure App Client
1. In your User Pool, go to "App integration" tab
2. Click on your app client
3. Configure Hosted UI:
   - Allowed callback URLs: `http://localhost:8080/callback`
   - Allowed sign-out URLs: `http://localhost:8080/login`
   - OAuth 2.0 grant types: `Implicit grant`
   - OAuth scopes: `email`, `openid`, `phone`

### 3. Create Admin Group
1. In User Pool, go to "Groups" tab
2. Create new group:
   - Group name: `admin`
   - Description: `Administrator users`
   - Precedence: `1`

### 4. Add Users to Admin Group
1. Go to "Users" tab
2. Create or select a user
3. Add user to "admin" group manually

## Environment Configuration

### Backend (.env)
```env
# AWS Cognito Configuration
COGNITO_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=your-client-id-here
COGNITO_REGION=us-east-1

# Other configurations...
PORT=5000
```

### Frontend (.env)
```env
# AWS Cognito Hosted UI Configuration
VITE_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=your-client-id-here
VITE_REDIRECT_URI=http://localhost:8080/callback
VITE_LOGOUT_URI=http://localhost:8080/login
VITE_API_BASE_URL=http://localhost:5000
```

## Running the Application

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Test Authentication
1. Navigate to `http://localhost:8080`
2. Click "Sign In with AWS Cognito"
3. You'll be redirected to Cognito Hosted UI
4. Sign up or sign in
5. After successful authentication, you'll be redirected back

## Authentication Flow

1. **Login**: User clicks login → Redirected to Cognito Hosted UI
2. **Authentication**: User enters credentials in Cognito
3. **Callback**: Cognito redirects to `/callback` with JWT token
4. **Token Processing**: Frontend extracts and stores JWT token
5. **Role Detection**: JWT contains `cognito:groups` for role-based access
6. **API Calls**: All API requests include JWT token in Authorization header
7. **Backend Validation**: Backend validates JWT against Cognito JWKS

## Security Features

- **JWT Validation**: All API endpoints validate JWT tokens
- **Role-Based Access**: Admin routes protected by group membership
- **Token Expiration**: Automatic token expiry handling
- **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)

## Troubleshooting

### Common Issues

1. **Token not found in callback**
   - Check Cognito callback URL configuration
   - Ensure OAuth flow is set to "Implicit grant"

2. **JWT validation fails**
   - Verify COGNITO_POOL_ID and COGNITO_REGION in backend .env
   - Check that token is not expired

3. **Admin access denied**
   - Ensure user is added to "Admin" group in Cognito
   - Check JWT token contains correct groups

4. **CORS errors**
   - Backend has CORS enabled for frontend domain
   - Check API_BASE_URL in frontend .env

### Testing Endpoints

Test authentication:
```bash
# Get JWT token from browser localStorage after login
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/test-auth
```

## Production Considerations

1. **Environment Variables**: Use proper environment management
2. **HTTPS**: Enable HTTPS for production domains
3. **Token Storage**: Consider httpOnly cookies instead of localStorage
4. **Error Handling**: Implement proper error boundaries
5. **Monitoring**: Add logging and monitoring for auth failures
6. **Rate Limiting**: Implement rate limiting on auth endpoints

## Next Steps

1. Implement ProtectedRoute component (already done)
2. Add token refresh mechanism
3. Implement proper error handling
4. Add audit logging for admin actions
5. Consider implementing custom Lambda triggers (when IAM permissions allow)