#!/bin/bash

# QuizMaster V2 - AWS Amplify Deployment Script

echo "🚀 QuizMaster V2 - AWS Amplify Deployment"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📋 Deployment Options:"
echo "1. Frontend Only (Amplify Hosting)"
echo "2. Full Stack (Amplify + Lambda)"
echo "3. Frontend + Separate Backend"

read -p "Choose deployment option (1-3): " choice

case $choice in
    1)
        echo "🎯 Deploying Frontend Only to Amplify..."
        
        # Build frontend
        echo "📦 Building frontend..."
        cd frontend
        npm run build
        
        echo "✅ Frontend built successfully!"
        echo "📝 Next steps:"
        echo "1. Go to AWS Amplify Console"
        echo "2. Connect your GitHub repository"
        echo "3. Use the amplify.yml configuration"
        echo "4. Set environment variables in Amplify Console"
        echo "5. Deploy!"
        ;;
        
    2)
        echo "🎯 Deploying Full Stack to AWS..."
        
        # Check if Amplify CLI is installed
        if ! command -v amplify &> /dev/null; then
            echo "❌ Amplify CLI not found. Installing..."
            npm install -g @aws-amplify/cli
        fi
        
        # Initialize Amplify (if not already done)
        if [ ! -d "amplify" ]; then
            echo "🔧 Initializing Amplify project..."
            amplify init --yes
        fi
        
        # Deploy
        echo "🚀 Deploying to AWS..."
        amplify push --yes
        
        echo "✅ Deployment complete!"
        ;;
        
    3)
        echo "🎯 Deploying Frontend + Preparing Backend..."
        
        # Build frontend
        cd frontend
        npm run build
        cd ..
        
        # Prepare backend for serverless
        cd backend-vite
        
        # Install serverless if not present
        if ! command -v serverless &> /dev/null; then
            echo "📦 Installing Serverless Framework..."
            npm install -g serverless
            npm install serverless-http serverless-offline
        fi
        
        echo "✅ Ready for deployment!"
        echo "📝 Next steps:"
        echo "1. Deploy frontend to Amplify Console"
        echo "2. Deploy backend: cd backend-vite && serverless deploy"
        echo "3. Update frontend environment variables with API URL"
        echo "4. Update Cognito callback URLs"
        ;;
        
    *)
        echo "❌ Invalid option selected"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment preparation complete!"
echo "📚 See AMPLIFY_DEPLOYMENT_GUIDE.md for detailed instructions"