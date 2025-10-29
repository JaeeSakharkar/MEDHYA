#!/bin/bash

# Script to help extract AWS credentials for GitHub Secrets

echo "🔑 AWS Credentials for GitHub Secrets"
echo "===================================="

echo "📋 Getting your current AWS credentials..."

# Check if AWS CLI is configured
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install and configure it first."
    exit 1
fi

# Get caller identity to verify credentials work
echo "🔍 Verifying AWS credentials..."
CALLER_IDENTITY=$(aws sts get-caller-identity 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "❌ AWS credentials not configured or expired."
    echo "Please run 'aws configure' with your lab credentials."
    exit 1
fi

echo "✅ AWS credentials verified!"
echo "$CALLER_IDENTITY"

echo ""
echo "📝 GitHub Secrets Configuration"
echo "==============================="

echo ""
echo "Add these secrets to your GitHub repository:"
echo "(Go to Settings → Secrets and variables → Actions → New repository secret)"

echo ""
echo "🔐 AWS Credentials:"
echo "-------------------"

# Extract credentials from AWS CLI config
AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)
AWS_SESSION_TOKEN=$(aws configure get aws_session_token)

if [ -n "$AWS_ACCESS_KEY_ID" ]; then
    echo "AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID"
else
    echo "AWS_ACCESS_KEY_ID: (not found in config - check your lab credentials)"
fi

if [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY"
else
    echo "AWS_SECRET_ACCESS_KEY: (not found in config - check your lab credentials)"
fi

if [ -n "$AWS_SESSION_TOKEN" ]; then
    echo "AWS_SESSION_TOKEN: $AWS_SESSION_TOKEN"
else
    echo "AWS_SESSION_TOKEN: (not found - may not be needed for your setup)"
fi

echo ""
echo "🪣 S3 Configuration:"
echo "-------------------"
BUCKET_NAME="quizmaster-v2-$(whoami)-$(date +%s)"
echo "S3_BUCKET_NAME: $BUCKET_NAME"

echo ""
echo "🔐 Cognito Configuration:"
echo "------------------------"
echo "COGNITO_POOL_ID: us-east-1_RsOYVRSJu"
echo "COGNITO_CLIENT_ID: 6npa9g9it0o66diikabm29j9je"
echo "COGNITO_DOMAIN: medhya.auth.us-east-1.amazoncognito.com"

echo ""
echo "🌐 Frontend Environment Variables:"
echo "---------------------------------"
echo "VITE_COGNITO_DOMAIN: medhya.auth.us-east-1.amazoncognito.com"
echo "VITE_COGNITO_CLIENT_ID: 6npa9g9it0o66diikabm29j9je"
echo "VITE_REDIRECT_URI: (will be auto-generated)"
echo "VITE_LOGOUT_URI: (will be auto-generated)"
echo "VITE_API_BASE_URL: (will be auto-generated)"

echo ""
echo "📋 Next Steps:"
echo "1. Copy the values above to GitHub Secrets"
echo "2. Push your code to GitHub"
echo "3. GitHub Actions will automatically deploy your app!"

echo ""
echo "🔗 Useful Links:"
echo "- GitHub Secrets: https://github.com/yourusername/yourrepo/settings/secrets/actions"
echo "- AWS Console: https://console.aws.amazon.com/"
echo "- Cognito Console: https://console.aws.amazon.com/cognito/"