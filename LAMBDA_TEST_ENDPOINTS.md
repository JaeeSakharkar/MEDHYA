# 🧪 Lambda Test Endpoints - QuizMaster V2

## 🚀 Your Lambda API Base URL
After deploying with `serverless deploy --stage prod`, you'll get a URL like:
```
https://abc123def.execute-api.us-east-1.amazonaws.com/prod
```

Replace `YOUR_LAMBDA_URL` below with your actual URL.

## 📋 Test Endpoints

### **1. Health Check Endpoints (No Auth Required)**

#### **Basic Health Check**
```bash
curl -X GET "YOUR_LAMBDA_URL/"
```

**Expected Response:**
```json
{
  "message": "QuizMaster V2 Lambda Backend Running!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production",
  "requestId": "abc123",
  "lambda": {
    "functionName": "quizmaster-backend-lab-prod-api",
    "functionVersion": "$LATEST",
    "region": "us-east-1"
  },
  "database": "DynamoDB",
  "cognito": {
    "poolId": "us-east-1_RsOYVRSJu",
    "region": "us-east-1"
  }
}
```

#### **Status Check**
```bash
curl -X GET "YOUR_LAMBDA_URL/status"
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 1.234,
  "memory": {
    "rss": 45678912,
    "heapTotal": 12345678,
    "heapUsed": 8765432
  },
  "requestId": "xyz789"
}
```

### **2. Authentication Test Endpoints**

#### **Test Auth (Requires JWT Token)**
```bash
curl -X GET "YOUR_LAMBDA_URL/test-auth" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "message": "Authentication successful!",
  "requestId": "def456",
  "user": {
    "id": "cognito-user-id",
    "email": "user@example.com",
    "groups": ["admin"],
    "isAdmin": true
  },
  "lambda": {
    "functionName": "quizmaster-backend-lab-prod-api",
    "requestId": "lambda-request-id"
  }
}
```

### **3. Quiz Endpoints**

#### **Get All Quizzes (Requires Auth)**
```bash
curl -X GET "YOUR_LAMBDA_URL/quizzes" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Get Single Quiz (Requires Auth)**
```bash
curl -X GET "YOUR_LAMBDA_URL/quizzes/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Create Quiz (Admin Only)**
```bash
curl -X POST "YOUR_LAMBDA_URL/quizzes" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Quiz",
    "description": "A test quiz created via Lambda",
    "subject": "programming"
  }'
```

#### **Update Quiz (Admin Only)**
```bash
curl -X PUT "YOUR_LAMBDA_URL/quizzes/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Test Quiz",
    "description": "Updated description"
  }'
```

#### **Delete Quiz (Admin Only)**
```bash
curl -X DELETE "YOUR_LAMBDA_URL/quizzes/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **4. Question Endpoints**

#### **Get Questions for Quiz (Requires Auth)**
```bash
curl -X GET "YOUR_LAMBDA_URL/questions/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Create Question (Admin Only)**
```bash
curl -X POST "YOUR_LAMBDA_URL/questions/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is Lambda?",
    "options": ["Serverless compute", "Database", "Storage", "Network"],
    "correctAnswer": 0
  }'
```

### **5. Score Endpoints**

#### **Get User Scores (Requires Auth)**
```bash
curl -X GET "YOUR_LAMBDA_URL/scores" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Submit Score (Requires Auth)**
```bash
curl -X POST "YOUR_LAMBDA_URL/scores" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quizId": "1",
    "score": 85,
    "totalQuestions": 10
  }'
```

#### **Get All Scores (Admin Only)**
```bash
curl -X GET "YOUR_LAMBDA_URL/scores/all" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **6. User Endpoints**

#### **Get User Profile (Requires Auth)**
```bash
curl -X GET "YOUR_LAMBDA_URL/users/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Get All Users (Admin Only)**
```bash
curl -X GET "YOUR_LAMBDA_URL/users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **7. Chapter Endpoints**

#### **Get Chapters (Requires Auth)**
```bash
curl -X GET "YOUR_LAMBDA_URL/chapters/programming" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Create Chapter (Admin Only)**
```bash
curl -X POST "YOUR_LAMBDA_URL/chapters/programming" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lambda Functions",
    "description": "Learn about AWS Lambda"
  }'
```

### **8. Auth Code Exchange**

#### **Exchange Cognito Code for Token**
```bash
curl -X POST "YOUR_LAMBDA_URL/auth/exchange-code" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "cognito-authorization-code",
    "redirect_uri": "https://your-frontend-domain.com/callback"
  }'
```

## 🔧 Testing Tools

### **1. Postman Collection**
Create a Postman collection with these endpoints:

**Environment Variables:**
- `lambda_url`: Your Lambda API URL
- `jwt_token`: Your Cognito JWT token

### **2. Browser Testing**
For GET endpoints without auth:
```
https://YOUR_LAMBDA_URL/
https://YOUR_LAMBDA_URL/status
```

### **3. JavaScript Testing**
```javascript
// Test from browser console
const API_URL = 'YOUR_LAMBDA_URL';
const token = localStorage.getItem('idToken');

// Test health check
fetch(`${API_URL}/`)
  .then(res => res.json())
  .then(data => console.log('Health:', data));

// Test authenticated endpoint
fetch(`${API_URL}/test-auth`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => console.log('Auth Test:', data));
```

## 🎯 Quick Test Script

Save this as `test-lambda.sh`:

```bash
#!/bin/bash

# Replace with your actual Lambda URL
LAMBDA_URL="YOUR_LAMBDA_URL"
JWT_TOKEN="YOUR_JWT_TOKEN"

echo "🧪 Testing Lambda Endpoints"
echo "=========================="

echo "1. Health Check:"
curl -s "$LAMBDA_URL/" | jq '.'

echo -e "\n2. Status Check:"
curl -s "$LAMBDA_URL/status" | jq '.'

echo -e "\n3. Auth Test:"
curl -s "$LAMBDA_URL/test-auth" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq '.'

echo -e "\n4. Get Quizzes:"
curl -s "$LAMBDA_URL/quizzes" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq '.'

echo -e "\n5. Get User Profile:"
curl -s "$LAMBDA_URL/users/profile" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq '.'

echo -e "\n✅ Lambda testing complete!"
```

## 📊 Expected Response Codes

| Endpoint | Success | Auth Required | Admin Only |
|----------|---------|---------------|------------|
| `GET /` | 200 | ❌ | ❌ |
| `GET /status` | 200 | ❌ | ❌ |
| `GET /test-auth` | 200 | ✅ | ❌ |
| `GET /quizzes` | 200 | ✅ | ❌ |
| `POST /quizzes` | 201 | ✅ | ✅ |
| `GET /scores` | 200 | ✅ | ❌ |
| `GET /scores/all` | 200 | ✅ | ✅ |
| `GET /users` | 200 | ✅ | ✅ |

## 🚨 Error Responses

### **401 Unauthorized**
```json
{
  "error": "Missing Authorization header"
}
```

### **403 Forbidden**
```json
{
  "error": "Invalid or expired token"
}
```

### **403 Admin Required**
```json
{
  "error": "Admin access required"
}
```

### **500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "requestId": "abc123"
}
```

## 🎯 How to Get JWT Token

1. **Login to your frontend**: http://localhost:8081/auth-test
2. **Complete Cognito authentication**
3. **Get token from localStorage**:
   ```javascript
   localStorage.getItem('idToken')
   ```
4. **Use this token** in Authorization header

## 🚀 Quick Start Testing

1. **Deploy Lambda**:
   ```bash
   cd backend-vite
   serverless deploy --stage prod
   ```

2. **Get your Lambda URL** from deployment output

3. **Test health check**:
   ```bash
   curl https://your-lambda-url.execute-api.us-east-1.amazonaws.com/prod/
   ```

4. **Get JWT token** from frontend login

5. **Test authenticated endpoints** with the token

Your Lambda backend is ready for production! 🎉