@echo off
echo 🎓 QuizMaster V2 - AWS Academy Lab Deployment
echo =============================================

echo 🔍 Checking AWS credentials...
aws sts get-caller-identity
if errorlevel 1 (
    echo ❌ AWS credentials not configured. Please run 'aws configure' first.
    exit /b 1
)

echo 📋 Lab-Compatible Deployment Options:
echo 1. S3 Static Website + Lambda API (Recommended)
echo 2. EC2 Instance (All-in-one)
echo 3. External Services (Netlify + Railway)

set /p choice="Choose deployment option (1-3): "

if "%choice%"=="1" (
    echo 🎯 Deploying to S3 + Lambda...
    
    echo 📦 Building frontend...
    cd frontend
    npm run build
    cd ..
    
    echo 🪣 Creating S3 bucket...
    set BUCKET_NAME=quizmaster-v2-lab-%RANDOM%
    aws s3 mb s3://%BUCKET_NAME%
    
    if errorlevel 1 (
        echo ❌ Failed to create S3 bucket. Check your lab permissions.
        exit /b 1
    )
    
    echo 🌐 Enabling static website hosting...
    aws s3 website s3://%BUCKET_NAME% --index-document index.html --error-document index.html
    
    echo 📤 Uploading frontend files...
    aws s3 sync frontend\dist\ s3://%BUCKET_NAME% --delete
    
    echo 🚀 Deploying backend to Lambda...
    cd backend-vite
    npm install serverless-http
    serverless deploy --stage lab
    cd ..
    
    echo ✅ Deployment complete!
    echo 🌐 Frontend URL: http://%BUCKET_NAME%.s3-website-us-east-1.amazonaws.com
    echo 📝 Update Cognito callback URLs with the frontend URL above
    
) else if "%choice%"=="2" (
    echo 🎯 Preparing EC2 deployment...
    
    cd frontend
    npm run build
    cd ..
    
    echo ✅ Frontend built successfully!
    echo 📝 Launch EC2 instance with Amazon Linux 2 and use the User Data script from ALTERNATIVE_DEPLOYMENT_OPTIONS.md
    
) else if "%choice%"=="3" (
    echo 🎯 Preparing External Services deployment...
    
    cd frontend
    npm run build
    cd ..
    
    echo ✅ Frontend built successfully!
    echo 📝 Deploy frontend to Netlify and backend to Railway/Render
    echo 📚 See ALTERNATIVE_DEPLOYMENT_OPTIONS.md for detailed steps
    
) else (
    echo ❌ Invalid option selected
    exit /b 1
)

echo.
echo 🎉 Deployment preparation complete!
pause