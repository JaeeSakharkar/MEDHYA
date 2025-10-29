@echo off
echo 🚀 QuizMaster V2 - AWS Amplify Deployment
echo ==========================================

echo 📋 Deployment Options:
echo 1. Frontend Only (Amplify Hosting)
echo 2. Full Stack (Amplify + Lambda)  
echo 3. Frontend + Separate Backend

set /p choice="Choose deployment option (1-3): "

if "%choice%"=="1" (
    echo 🎯 Deploying Frontend Only to Amplify...
    
    echo 📦 Building frontend...
    cd frontend
    npm run build
    cd ..
    
    echo ✅ Frontend built successfully!
    echo 📝 Next steps:
    echo 1. Go to AWS Amplify Console
    echo 2. Connect your GitHub repository
    echo 3. Use the amplify.yml configuration
    echo 4. Set environment variables in Amplify Console
    echo 5. Deploy!
    
) else if "%choice%"=="2" (
    echo 🎯 Deploying Full Stack to AWS...
    
    echo 🔧 Initializing Amplify project...
    amplify init --yes
    
    echo 🚀 Deploying to AWS...
    amplify push --yes
    
    echo ✅ Deployment complete!
    
) else if "%choice%"=="3" (
    echo 🎯 Deploying Frontend + Preparing Backend...
    
    cd frontend
    npm run build
    cd ..
    
    cd backend-vite
    npm install serverless-http serverless-offline
    cd ..
    
    echo ✅ Ready for deployment!
    echo 📝 Next steps:
    echo 1. Deploy frontend to Amplify Console
    echo 2. Deploy backend: cd backend-vite ^&^& serverless deploy
    echo 3. Update frontend environment variables with API URL
    echo 4. Update Cognito callback URLs
    
) else (
    echo ❌ Invalid option selected
    exit /b 1
)

echo.
echo 🎉 Deployment preparation complete!
echo 📚 See AMPLIFY_DEPLOYMENT_GUIDE.md for detailed instructions
pause