# 🚀 AWS Amplify Deployment Guide - QuizMaster V2

## Overview
This guide will help you deploy your QuizMaster V2 application to AWS Amplify with:
- **Frontend**: React + Vite on Amplify Hosting
- **Backend**: Node.js + Express on Amplify Functions (or EC2/Lambda)
- **Database**: DynamoDB
- **Authentication**: AWS Cognito (already configured)

## 📋 Prerequisites

1. **AWS Account** with appropriate permissions
2. **GitHub Repository** (recommended for CI/CD)
3. **AWS CLI** installed and configured
4. **Amplify CLI** installed

### Install AWS Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

## 🎯 Deployment Strategy

### Option 1: Full Amplify Stack (Recommended)
- Frontend: Amplify Hosting
- Backend: Amplify Functions (Lambda)
- Database: DynamoDB
- Auth: Cognito (existing)

### Option 2: Hybrid Approach
- Frontend: Amplify Hosting
- Backend: EC2/ECS/Lambda (separate)
- Database: DynamoDB
- Auth: Cognito (existing)

## 🚀 Option 1: Full Amplify Deployment

### Step 1: Initialize Amplify Project
```bash
# In your project root
amplify init
```

**Configuration:**
- Project name: `quizmaster-v2`
- Environment: `prod`
- Default editor: `Visual Studio Code`
- App type: `javascript`
- Framework: `react`
- Source directory: `frontend/src`
- Build directory: `frontend/dist`
- Build command: `npm run build`
- Start command: `npm run dev`

### Step 2: Add Hosting
```bash
amplify add hosting
```
- Select: `Amazon CloudFront and S3`
- Hosting bucket name: `quizmaster-v2-hosting`

### Step 3: Add API (Backend Functions)
```bash
amplify add api
```
- Select: `REST`
- API name: `quizmasterapi`
- Path: `/api`
- Lambda source: `Create a new Lambda function`
- Function name: `quizmasterFunction`
- Template: `Serverless ExpressJS function`

### Step 4: Add Database
```bash
amplify add storage
```
- Select: `NoSQL Database`
- Table name: `QuizMasterTable`
- Partition key: `PK` (String)
- Sort key: `SK` (String)
- Add global secondary indexes: `No`

### Step 5: Configure Environment Variables
Create `amplify/backend/function/quizmasterFunction/src/.env`:
```env
COGNITO_POOL_ID=us-east-1_RsOYVRSJu
COGNITO_CLIENT_ID=6npa9g9it0o66diikabm29j9je
COGNITO_REGION=us-east-1
COGNITO_DOMAIN=medhya.auth.us-east-1.amazoncognito.com
AWS_REGION=us-east-1
NODE_ENV=production
```

### Step 6: Deploy
```bash
amplify push
```

## 🎯 Option 2: Frontend-Only Amplify (Simpler)

### Step 1: Prepare Frontend for Production
Update `frontend/.env.production`:
```env
VITE_COGNITO_DOMAIN=medhya.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=6npa9g9it0o66diikabm29j9je
VITE_REDIRECT_URI=https://your-app-domain.amplifyapp.com/callback
VITE_LOGOUT_URI=https://your-app-domain.amplifyapp.com/login
VITE_API_BASE_URL=https://your-backend-api-url.com
```

### Step 2: Build Frontend
```bash
cd frontend
npm run build
```

### Step 3: Deploy to Amplify Console

1. **Go to AWS Amplify Console**
2. **Click "New App" → "Host web app"**
3. **Connect Repository** (GitHub recommended)
4. **Configure Build Settings**:

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
        - npm run build
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

### Step 4: Configure Environment Variables in Amplify Console
- `VITE_COGNITO_DOMAIN`: `medhya.auth.us-east-1.amazoncognito.com`
- `VITE_COGNITO_CLIENT_ID`: `6npa9g9it0o66diikabm29j9je`
- `VITE_REDIRECT_URI`: `https://your-domain.amplifyapp.com/callback`
- `VITE_LOGOUT_URI`: `https://your-domain.amplifyapp.com/login`
- `VITE_API_BASE_URL`: `https://your-backend-url.com`

## 🗄️ Backend Deployment Options

### Option A: AWS Lambda + API Gateway
```bash
# Install Serverless Framework
npm install -g serverless

# Create serverless.yml in backend-vite/
```

### Option B: AWS ECS/Fargate
```bash
# Create Dockerfile in backend-vite/
```

### Option C: AWS EC2
- Launch EC2 instance
- Install Node.js
- Deploy code
- Configure reverse proxy (nginx)

## 📝 Amplify Build Configuration

Create `amplify.yml` in project root:
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
        - npm run build
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
backend:
  phases:
    preBuild:
      commands:
        - cd backend-vite
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: backend-vite/dist
    files:
      - '**/*'
```

## 🔧 Update Cognito URLs for Production

After deployment, update your Cognito User Pool:

1. **Go to AWS Cognito Console**
2. **Select your User Pool**
3. **App integration → App client → Edit**
4. **Update URLs**:
   - Callback URLs: `https://your-domain.amplifyapp.com/callback`
   - Sign-out URLs: `https://your-domain.amplifyapp.com/login`

## 🌐 Custom Domain (Optional)

### Step 1: Add Custom Domain in Amplify
1. Go to Amplify Console → Your App
2. Click "Domain management"
3. Add domain (e.g., `quizmaster.yourdomain.com`)

### Step 2: Update Cognito URLs
Update callback URLs to use your custom domain.

## 📊 Monitoring & Analytics

### Add Analytics
```bash
amplify add analytics
```

### Add Monitoring
- CloudWatch logs
- X-Ray tracing
- Amplify Console metrics

## 🔒 Security Considerations

### Environment Variables
- Never commit sensitive data
- Use Amplify Console environment variables
- Rotate secrets regularly

### HTTPS
- Amplify provides SSL certificates automatically
- Ensure all API calls use HTTPS

### CORS
Update backend CORS settings for production domain:
```javascript
app.use(cors({
  origin: ['https://your-domain.amplifyapp.com'],
  credentials: true
}));
```

## 🚀 Quick Start Commands

### For Frontend-Only Deployment:
```bash
# 1. Prepare environment
cd frontend
cp .env .env.production
# Edit .env.production with production URLs

# 2. Build
npm run build

# 3. Deploy via Amplify Console
# - Connect GitHub repo
# - Configure build settings
# - Deploy!
```

### For Full Stack Deployment:
```bash
# 1. Initialize Amplify
amplify init

# 2. Add services
amplify add hosting
amplify add api
amplify add storage

# 3. Deploy
amplify push

# 4. Update Cognito URLs
# Use the provided Amplify domain
```

## 📋 Deployment Checklist

- [ ] Frontend builds successfully (`npm run build`)
- [ ] Environment variables configured
- [ ] Cognito callback URLs updated
- [ ] Backend API deployed and accessible
- [ ] Database tables created
- [ ] CORS configured for production domain
- [ ] SSL certificate active
- [ ] Custom domain configured (optional)
- [ ] Monitoring and analytics set up

## 🎯 Next Steps After Deployment

1. **Test the deployed application**
2. **Monitor performance and errors**
3. **Set up CI/CD pipeline**
4. **Configure backup and disaster recovery**
5. **Implement proper logging and monitoring**

Your QuizMaster V2 will be live on AWS Amplify! 🚀