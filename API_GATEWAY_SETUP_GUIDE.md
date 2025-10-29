# 🌐 API Gateway Setup Guide - Complete Beginner's Guide

## 🎯 What is API Gateway?

API Gateway creates HTTP endpoints that trigger your Lambda function. It's like a bridge between the internet and your Lambda function.

**Without API Gateway**: Lambda function exists but can't be accessed via HTTP  
**With API Gateway**: Lambda function gets a public URL like `https://abc123.execute-api.us-east-1.amazonaws.com/prod`

## 📋 Step-by-Step API Gateway Setup

### **Step 1: Go to API Gateway Console**
1. **Open**: https://console.aws.amazon.com/apigateway/
2. **Click**: "Create API"

### **Step 2: Choose API Type**
1. **Select**: "REST API" (not REST API Private)
2. **Click**: "Build"

### **Step 3: Create API**
Fill in these details:
- **API name**: `quizmaster-api`
- **Description**: `QuizMaster V2 Backend API`
- **Endpoint Type**: `Regional`
- **Click**: "Create API"

### **Step 4: Create Proxy Resource**
1. **Click**: "Actions" → "Create Resource"
2. **Fill in**:
   - **Resource Name**: `proxy`
   - **Resource Path**: `{proxy+}`
   - **✅ Check**: "Configure as proxy resource"
   - **✅ Check**: "Enable API Gateway CORS"
3. **Click**: "Create Resource"

### **Step 5: Create ANY Method**
1. **Select**: the `{proxy+}` resource you just created
2. **Click**: "Actions" → "Create Method"
3. **Choose**: "ANY" from dropdown
4. **Click**: ✓ (checkmark)

### **Step 6: Configure Lambda Integration**
Fill in these details:
- **Integration type**: `Lambda Function`
- **✅ Check**: "Use Lambda Proxy integration"
- **Lambda Region**: `us-east-1`
- **Lambda Function**: `quizmaster-backend` (your Lambda function name)
- **Click**: "Save"

### **Step 7: Grant Permissions**
- **Click**: "OK" when prompted to give API Gateway permission to invoke your Lambda

### **Step 8: Enable CORS (Important!)**
1. **Select**: the `{proxy+}` resource
2. **Click**: "Actions" → "Enable CORS"
3. **Configure CORS**:
   - **Access-Control-Allow-Origin**: `*`
   - **Access-Control-Allow-Headers**: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With`
   - **Access-Control-Allow-Methods**: `GET,POST,PUT,DELETE,OPTIONS`
4. **Click**: "Enable CORS and replace existing CORS headers"

### **Step 9: Deploy API**
1. **Click**: "Actions" → "Deploy API"
2. **Deployment stage**: `prod`
3. **Stage description**: `Production deployment`
4. **Click**: "Deploy"

### **Step 10: Get Your API URL**
After deployment, you'll see:
- **Invoke URL**: `https://abc123def.execute-api.us-east-1.amazonaws.com/prod`

**This is your API base URL!** 🎉

## 🧪 Test Your API Gateway

### **Test 1: Health Check**
```bash
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/
```

**Expected Response:**
```json
{
  "message": "QuizMaster V2 Lambda Backend Running!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "lambda": {
    "functionName": "quizmaster-backend"
  }
}
```

### **Test 2: Status Check**
```bash
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/status
```

### **Test 3: CORS Check**
```bash
curl -X OPTIONS https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/ \
  -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: GET"
```

## 🔧 Advanced Configuration

### **Custom Domain (Optional)**
1. **Go to**: API Gateway → Custom domain names
2. **Create**: `api.yourdomain.com`
3. **Add**: SSL certificate
4. **Map**: to your API

### **API Keys (Optional)**
1. **Go to**: API Gateway → API Keys
2. **Create**: API key
3. **Associate**: with usage plan

### **Throttling (Optional)**
1. **Go to**: API Gateway → Usage Plans
2. **Set**: Rate limits (requests per second)
3. **Set**: Burst limits

## 🚨 Common Issues & Solutions

### **Issue 1: CORS Errors**
**Problem**: Frontend can't access API  
**Solution**: 
1. Enable CORS on `{proxy+}` resource
2. Add proper headers in Lambda response

### **Issue 2: 403 Forbidden**
**Problem**: API Gateway can't invoke Lambda  
**Solution**: 
1. Check Lambda permissions
2. Re-create the method integration

### **Issue 3: 502 Bad Gateway**
**Problem**: Lambda function error  
**Solution**: 
1. Check Lambda logs in CloudWatch
2. Verify Lambda handler is `index.handler`

### **Issue 4: Timeout**
**Problem**: Lambda takes too long  
**Solution**: 
1. Increase Lambda timeout (max 15 minutes)
2. Increase API Gateway timeout (max 29 seconds)

## 📊 API Gateway Features

### **Request/Response Transformation**
- Modify headers
- Transform request/response body
- Add/remove parameters

### **Authentication**
- API Keys
- AWS IAM
- Cognito User Pools
- Lambda Authorizers

### **Monitoring**
- CloudWatch metrics
- Access logs
- Execution logs

### **Caching**
- Response caching
- TTL configuration
- Cache key parameters

## 🎯 Quick Setup Commands

### **Using AWS CLI (Alternative)**
```bash
# Create API
aws apigateway create-rest-api --name quizmaster-api --region us-east-1

# Get API ID
API_ID=$(aws apigateway get-rest-apis --query 'items[?name==`quizmaster-api`].id' --output text)

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?path==`/`].id' --output text)

# Create proxy resource
aws apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part '{proxy+}'

# Create method and integration
# (Additional commands needed...)
```

## 📱 Frontend Integration

### **Update Frontend Environment**
After getting your API Gateway URL, update:

**frontend/.env.production:**
```env
VITE_API_BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
```

### **Test Frontend Connection**
```javascript
// Test from browser console
const API_URL = 'https://your-api-id.execute-api.us-east-1.amazonaws.com/prod';

fetch(`${API_URL}/`)
  .then(res => res.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
```

## 🔒 Security Best Practices

### **1. Enable CORS Properly**
- Specify exact origins in production
- Don't use `*` for credentials

### **2. Use HTTPS Only**
- API Gateway provides SSL by default
- Redirect HTTP to HTTPS

### **3. Implement Rate Limiting**
- Prevent abuse
- Set reasonable limits

### **4. Monitor Usage**
- CloudWatch metrics
- Access logs
- Error tracking

## 📋 Complete Setup Checklist

- [ ] ✅ Lambda function deployed
- [ ] ✅ API Gateway created
- [ ] ✅ Proxy resource configured
- [ ] ✅ ANY method created
- [ ] ✅ Lambda integration set up
- [ ] ✅ CORS enabled
- [ ] ✅ API deployed to stage
- [ ] ✅ API URL obtained
- [ ] ✅ Health check tested
- [ ] ✅ Frontend updated with API URL

## 🎉 Success Indicators

When everything is working:
- ✅ API Gateway URL returns 200 status
- ✅ CORS headers present in responses
- ✅ Lambda function logs show requests
- ✅ Frontend can make API calls
- ✅ Authentication works with JWT tokens

## 🚀 Next Steps

1. **Test all endpoints** with your API Gateway URL
2. **Update frontend** with the new API URL
3. **Update Cognito** callback URLs if needed
4. **Monitor** API Gateway metrics
5. **Set up** custom domain (optional)

Your QuizMaster V2 API is now publicly accessible! 🌐