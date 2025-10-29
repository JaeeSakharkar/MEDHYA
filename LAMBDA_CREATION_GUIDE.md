# 🚀 Complete Beginner's Guide to Creating AWS Lambda

## 🎯 What is Lambda?
Lambda is AWS's serverless compute service - it runs your backend code without you managing servers. Perfect for your QuizMaster V2 API!

## 📋 Step-by-Step Lambda Creation

### **Method 1: Easy Way - Using Serverless Framework (Recommended)**

#### **Step 1: Install Serverless Framework**
Open your terminal and run:
```bash
npm install -g serverless
```

#### **Step 2: Navigate to Your Backend**
```bash
cd backend-vite
```

#### **Step 3: Install Required Dependencies**
```bash
npm install serverless-http
```

#### **Step 4: Deploy Your Backend to Lambda**
```bash
serverless deploy --stage prod
```

**That's it!** Serverless will:
- ✅ Create Lambda function automatically
- ✅ Create API Gateway endpoints
- ✅ Set up all permissions
- ✅ Give you the API URL

---

### **Method 2: Manual Way - AWS Console (Learning Purpose)**

#### **Step 1: Go to AWS Lambda Console**
1. **Open**: https://console.aws.amazon.com/lambda/
2. **Click**: "Create function"

#### **Step 2: Basic Information**
- **Function name**: `quizmaster-backend`
- **Runtime**: `Node.js 18.x`
- **Architecture**: `x86_64`
- **Click**: "Create function"

#### **Step 3: Upload Your Code**
1. **Zip your backend code**:
   ```bash
   cd backend-vite/src
   zip -r ../lambda-code.zip .
   ```

2. **In Lambda Console**:
   - Click "Upload from" → ".zip file"
   - Upload `lambda-code.zip`
   - Click "Save"

#### **Step 4: Configure Handler**
- **Handler**: `lambda.handler`
- **Timeout**: `30 seconds`
- **Memory**: `512 MB`

#### **Step 5: Add Environment Variables**
In Lambda Console → Configuration → Environment variables:
```
COGNITO_POOL_ID = us-east-1_RsOYVRSJu
COGNITO_CLIENT_ID = 6npa9g9it0o66diikabm29j9je
COGNITO_REGION = us-east-1
COGNITO_DOMAIN = medhya.auth.us-east-1.amazoncognito.com
DYNAMODB_TABLE = QuizMasterTable
NODE_ENV = production
```

#### **Step 6: Create API Gateway**
1. **Go to API Gateway Console**: https://console.aws.amazon.com/apigateway/
2. **Click**: "Create API"
3. **Choose**: "REST API" → "Build"
4. **API name**: `quizmaster-api`
5. **Click**: "Create API"

#### **Step 7: Configure API Gateway**
1. **Create Resource**:
   - Click "Actions" → "Create Resource"
   - Resource name: `{proxy+}`
   - Enable "Configure as proxy resource"
   - Click "Create Resource"

2. **Create Method**:
   - Select the `{proxy+}` resource
   - Click "Actions" → "Create Method"
   - Choose "ANY"
   - Integration type: "Lambda Function"
   - Lambda function: `quizmaster-backend`
   - Click "Save"

3. **Enable CORS**:
   - Select `{proxy+}` resource
   - Click "Actions" → "Enable CORS"
   - Click "Enable CORS and replace existing CORS headers"

4. **Deploy API**:
   - Click "Actions" → "Deploy API"
   - Deployment stage: "prod"
   - Click "Deploy"

---

## 🎯 **Recommended Approach for You**

**Use Method 1 (Serverless Framework)** because:
- ✅ **Super easy** - just one command
- ✅ **Handles everything** automatically
- ✅ **Already configured** in your project
- ✅ **Professional** deployment method

## 🚀 **Quick Commands for You**

```bash
# 1. Install Serverless (one-time setup)
npm install -g serverless

# 2. Go to your backend
cd backend-vite

# 3. Install dependencies
npm install serverless-http

# 4. Deploy to Lambda
serverless deploy --stage prod
```

**Output will look like:**
```
✅ Service deployed to stack quizmaster-backend-lab-prod
✅ endpoints:
  ANY - https://abc123def.execute-api.us-east-1.amazonaws.com/prod/{proxy+}
✅ functions:
  api: quizmaster-backend-lab-prod-api
```

## 🔧 **If You Get Errors**

### **Error: "AWS credentials not configured"**
**Fix**: Run this first:
```bash
aws configure
# Enter your lab credentials
```

### **Error: "Serverless command not found"**
**Fix**: Install globally:
```bash
npm install -g serverless
```

### **Error: "Permission denied"**
**Fix**: Your lab role might not allow Lambda creation. Try:
1. Use different AWS region
2. Or deploy to EC2 instead

## 📱 **Alternative: Deploy to EC2 (If Lambda Fails)**

If Lambda doesn't work with your lab permissions:

```bash
# 1. Launch EC2 instance
# 2. Install Node.js
# 3. Clone your repo
# 4. Run your backend
cd backend-vite
npm install
npm start
```

## ✅ **Success Checklist**

After deployment, you should have:
- [ ] ✅ Lambda function created
- [ ] ✅ API Gateway URL (like `https://xyz.execute-api.us-east-1.amazonaws.com/prod`)
- [ ] ✅ Backend responding to requests
- [ ] ✅ DynamoDB table connected

## 🎯 **Next Steps After Lambda Creation**

1. **Test your API**:
   ```bash
   curl https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/
   ```

2. **Update frontend environment**:
   - Change `VITE_API_BASE_URL` to your Lambda URL

3. **Update Cognito callback URLs**:
   - Use your Amplify frontend URL

Your QuizMaster V2 will be fully deployed! 🎉