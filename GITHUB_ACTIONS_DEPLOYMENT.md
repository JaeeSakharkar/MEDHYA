# 🚀 GitHub Actions Deployment Guide

## Overview
Deploy your QuizMaster V2 application automatically using GitHub Actions CI/CD pipeline. This works perfectly with AWS Academy Lab constraints!

## 🎯 What This Does

The GitHub Actions workflow will:
1. **Build** your frontend and backend
2. **Deploy frontend** to S3 static website
3. **Deploy backend** to AWS Lambda via Serverless
4. **Update** frontend with correct API URLs
5. **Test** the complete deployment

## 📋 Prerequisites

1. **GitHub Repository** with your code
2. **AWS Academy Lab** credentials
3. **GitHub Secrets** configured (see below)

## 🔧 Setup Instructions

### Step 1: Push Code to GitHub

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit - QuizMaster V2"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/quizmaster-v2.git
git branch -M main
git push -u origin main
```

### Step 2: Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these **Repository Secrets**:

#### AWS Credentials (from your lab)
- `AWS_ACCESS_KEY_ID`: Your lab access key
- `AWS_SECRET_ACCESS_KEY`: Your lab secret key  
- `AWS_SESSION_TOKEN`: Your lab session token

#### S3 Configuration
- `S3_BUCKET_NAME`: `quizmaster-v2-your-unique-name` (choose unique name)

#### Cognito Configuration
- `COGNITO_POOL_ID`: `us-east-1_RsOYVRSJu`
- `COGNITO_CLIENT_ID`: `6npa9g9it0o66diikabm29j9je`
- `COGNITO_DOMAIN`: `medhya.auth.us-east-1.amazoncognito.com`

#### Frontend Environment Variables
- `VITE_COGNITO_DOMAIN`: `medhya.auth.us-east-1.amazoncognito.com`
- `VITE_COGNITO_CLIENT_ID`: `6npa9g9it0o66diikabm29j9je`
- `VITE_REDIRECT_URI`: Will be auto-generated based on S3 bucket
- `VITE_LOGOUT_URI`: Will be auto-generated based on S3 bucket
- `VITE_API_BASE_URL`: Will be auto-generated from Lambda deployment

### Step 3: Trigger Deployment

The workflow triggers automatically on:
- **Push to main/master branch**
- **Pull request to main/master**
- **Manual trigger** (workflow_dispatch)

#### Manual Trigger:
1. Go to **Actions** tab in your GitHub repo
2. Select **Deploy QuizMaster V2** workflow
3. Click **Run workflow**

### Step 4: Monitor Deployment

1. **Go to Actions tab** in your GitHub repository
2. **Click on the running workflow**
3. **Monitor each job**:
   - `build-and-test`: Builds frontend and backend
   - `deploy-to-s3`: Deploys frontend to S3
   - `deploy-backend`: Deploys backend to Lambda
   - `update-frontend-config`: Updates frontend with API URLs

## 📊 Deployment Jobs Breakdown

### Job 1: Build and Test
```yaml
- Checkout code
- Setup Node.js 18
- Install dependencies (frontend & backend)
- Build frontend with environment variables
- Upload build artifacts
```

### Job 2: Deploy to S3
```yaml
- Download build artifacts
- Configure AWS credentials
- Create S3 bucket (if not exists)
- Enable static website hosting
- Set public access policy
- Upload frontend files
```

### Job 3: Deploy Backend
```yaml
- Setup Node.js and Serverless
- Configure AWS credentials
- Deploy to Lambda using Serverless Framework
- Create API Gateway endpoints
```

### Job 4: Update Frontend Config
```yaml
- Get API Gateway URL from deployment
- Rebuild frontend with correct API URL
- Redeploy to S3 with updated configuration
```

## 🔒 Security Features

- **Secrets Management**: All sensitive data stored in GitHub Secrets
- **AWS Session Tokens**: Supports temporary lab credentials
- **Public Access Control**: Proper S3 bucket policies
- **CORS Configuration**: Secure cross-origin requests

## 🌐 Accessing Your Deployed App

After successful deployment, you'll see output like:
```
✅ Deployment complete!
🌐 Frontend: http://quizmaster-v2-your-name.s3-website-us-east-1.amazonaws.com
🔗 Backend API: https://abc123.execute-api.us-east-1.amazonaws.com/prod
```

## 🔧 Updating Cognito URLs

After first deployment, update your Cognito User Pool:

1. **Go to AWS Cognito Console**
2. **Select your User Pool**
3. **App integration → App client → Edit**
4. **Update Callback URLs**:
   ```
   http://your-bucket-name.s3-website-us-east-1.amazonaws.com/callback
   ```
5. **Update Sign-out URLs**:
   ```
   http://your-bucket-name.s3-website-us-east-1.amazonaws.com/login
   ```

## 🔄 Continuous Deployment

Every time you push code to the main branch:
1. **Automatic build** and deployment
2. **Zero-downtime** updates
3. **Rollback capability** via GitHub Actions history
4. **Build status** visible in GitHub

## 🐛 Troubleshooting

### Common Issues:

#### 1. AWS Credentials Expired
- **Solution**: Update GitHub Secrets with new lab credentials

#### 2. S3 Bucket Name Conflict
- **Solution**: Change `S3_BUCKET_NAME` secret to a unique name

#### 3. Serverless Deployment Fails
- **Solution**: Check AWS permissions in lab environment

#### 4. Build Failures
- **Solution**: Check GitHub Actions logs for specific errors

### Debug Steps:
1. **Check Actions tab** for detailed logs
2. **Verify all secrets** are set correctly
3. **Ensure AWS credentials** are valid
4. **Check S3 bucket** permissions

## 📱 Mobile-Friendly Deployment

The deployment automatically includes:
- **Responsive design** for mobile devices
- **PWA capabilities** (if configured)
- **Fast loading** via S3 CDN
- **HTTPS support** (when using CloudFront)

## 🎯 Production Optimizations

The workflow includes:
- **Build optimization** for production
- **Asset compression** and minification
- **Environment-specific** configurations
- **Caching strategies** for better performance

## 📈 Monitoring and Analytics

After deployment, you can add:
- **CloudWatch logs** for backend monitoring
- **S3 access logs** for frontend analytics
- **API Gateway metrics** for performance tracking
- **Custom dashboards** for application health

## 🚀 Quick Start Commands

```bash
# 1. Clone/setup your repository
git clone https://github.com/yourusername/quizmaster-v2.git
cd quizmaster-v2

# 2. Configure GitHub Secrets (via GitHub web interface)

# 3. Push to trigger deployment
git add .
git commit -m "Deploy to production"
git push origin main

# 4. Monitor deployment in GitHub Actions tab
```

Your QuizMaster V2 will be automatically deployed and live within minutes! 🎉