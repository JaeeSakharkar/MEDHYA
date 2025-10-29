# 🧪 API Gateway Testing - Step by Step Implementation

## 🎯 Your API Gateway is Ready! Now Let's Test It

### **Step 1: Get Your API Gateway URL**

1. **In API Gateway Console**, look for your **"Invoke URL"**
2. **It should look like**: `https://abc123def.execute-api.us-east-1.amazonaws.com/prod`
3. **Copy this URL** - you'll need it for testing

## 🧪 **Testing Implementation Steps**

### **Test 1: Basic Health Check (No Auth Required)**

#### **Method 1: Browser Test**
1. **Open your browser**
2. **Go to**: `https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/`
3. **Expected Result**: JSON response with Lambda info

#### **Method 2: Command Line Test**
```bash
curl https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/
```

**Expected Response:**
```json
{
  "message": "QuizMaster V2 Lambda Backend Running!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "lambda": {
    "functionName": "quizmaster-backend",
    "region": "us-east-1"
  },
  "database": "DynamoDB"
}
```

### **Test 2: Status Endpoint**

```bash
curl https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/status
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 1.234,
  "memory": {
    "rss": 45678912,
    "heapTotal": 12345678
  }
}
```

### **Test 3: CORS Check (Important for Frontend)**

```bash
curl -X OPTIONS https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/ \
  -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

**Look for these headers in response:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization
```

### **Test 4: Error Handling**

```bash
curl https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/invalid-endpoint
```

**Expected Response:**
```json
{
  "error": "Endpoint not found",
  "method": "GET",
  "path": "/invalid-endpoint"
}
```

## 🔐 **Authentication Tests (Requires JWT Token)**

### **Step 1: Get JWT Token**

1. **Go to your frontend**: http://localhost:8081/auth-test
2. **Login with Cognito**
3. **Open browser console** (F12)
4. **Run**: `localStorage.getItem('idToken')`
5. **Copy the token**

### **Step 2: Test Authentication Endpoint**

```bash
curl https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/test-auth \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "message": "Authentication successful!",
  "user": {
    "id": "cognito-user-id",
    "email": "user@example.com",
    "groups": ["admin"],
    "isAdmin": true
  }
}
```

### **Step 3: Test Quiz Endpoints**

#### **Get All Quizzes:**
```bash
curl https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/quizzes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### **Get User Profile:**
```bash
curl https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### **Get User Scores:**
```bash
curl https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/scores \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🚀 **Automated Testing Script**

### **Run the Test Script:**
```bash
test-api-gateway.bat
```

**This will test:**
- ✅ Health check
- ✅ Status endpoint
- ✅ CORS headers
- ✅ Error handling
- ✅ Authentication (if token provided)
- ✅ Quiz endpoints (if token provided)

## 📊 **Success Indicators**

### **✅ Your API is Working If:**
- Health check returns **200 status** with JSON
- Status endpoint returns **system information**
- CORS headers are **present in responses**
- Authentication works with **valid JWT tokens**
- Error endpoints return **proper 404 responses**

### **❌ Common Issues:**

#### **Issue 1: 502 Bad Gateway**
- **Problem**: Lambda function error
- **Solution**: Check Lambda logs in CloudWatch

#### **Issue 2: 403 Forbidden**
- **Problem**: API Gateway can't invoke Lambda
- **Solution**: Check Lambda permissions

#### **Issue 3: CORS Errors**
- **Problem**: Missing CORS headers
- **Solution**: Enable CORS on API Gateway resource

#### **Issue 4: 401 Unauthorized**
- **Problem**: Invalid or missing JWT token
- **Solution**: Get fresh token from frontend login

## 🔧 **Frontend Integration Test**

### **Step 1: Update Frontend Environment**

**Update `frontend/.env.production`:**
```env
VITE_API_BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
```

### **Step 2: Test Frontend Connection**

**Open browser console on your frontend and run:**
```javascript
// Test API connection
const API_URL = 'https://your-api-id.execute-api.us-east-1.amazonaws.com/prod';

fetch(`${API_URL}/`)
  .then(res => res.json())
  .then(data => console.log('✅ API Connected:', data))
  .catch(err => console.error('❌ API Error:', err));

// Test with authentication
const token = localStorage.getItem('idToken');
if (token) {
  fetch(`${API_URL}/test-auth`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => console.log('✅ Auth Working:', data))
  .catch(err => console.error('❌ Auth Error:', err));
}
```

## 📱 **Complete Application Test**

### **Step 1: Update Frontend**
1. **Update** `VITE_API_BASE_URL` with your API Gateway URL
2. **Restart frontend** if needed

### **Step 2: Test Full Flow**
1. **Go to**: http://localhost:8081
2. **Login** with Cognito
3. **Navigate** through the app
4. **Check** that all API calls work
5. **Test** quiz creation, scores, etc.

## 🎯 **Quick Test Commands**

### **Replace YOUR_API_URL with your actual URL:**

```bash
# Basic health check
curl https://YOUR_API_URL/

# Status check
curl https://YOUR_API_URL/status

# With authentication (replace YOUR_TOKEN)
curl https://YOUR_API_URL/test-auth -H "Authorization: Bearer YOUR_TOKEN"

# Get quizzes
curl https://YOUR_API_URL/quizzes -H "Authorization: Bearer YOUR_TOKEN"
```

## ✅ **Final Checklist**

- [ ] ✅ Health check returns 200
- [ ] ✅ Status endpoint works
- [ ] ✅ CORS headers present
- [ ] ✅ Authentication works with JWT
- [ ] ✅ Quiz endpoints return data
- [ ] ✅ Error handling works (404 for invalid paths)
- [ ] ✅ Frontend can connect to API
- [ ] ✅ Complete application flow works

## 🎉 **Success!**

If all tests pass, your QuizMaster V2 is fully deployed with:
- ✅ **Lambda backend** running your API
- ✅ **API Gateway** providing HTTP endpoints
- ✅ **DynamoDB** storing your data
- ✅ **Cognito** handling authentication
- ✅ **Frontend** connected to the API

Your application is production-ready! 🚀