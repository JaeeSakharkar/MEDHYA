@echo off
echo 🔑 AWS Credentials for GitHub Secrets
echo ====================================

echo 📋 Getting your current AWS credentials...

aws sts get-caller-identity >nul 2>&1
if errorlevel 1 (
    echo ❌ AWS credentials not configured or expired.
    echo Please run 'aws configure' with your lab credentials.
    pause
    exit /b 1
)

echo ✅ AWS credentials verified!
aws sts get-caller-identity

echo.
echo 📝 GitHub Secrets Configuration
echo ===============================

echo.
echo Add these secrets to your GitHub repository:
echo (Go to Settings → Secrets and variables → Actions → New repository secret)

echo.
echo 🔐 AWS Credentials:
echo -------------------

for /f "tokens=*" %%i in ('aws configure get aws_access_key_id') do set AWS_ACCESS_KEY_ID=%%i
for /f "tokens=*" %%i in ('aws configure get aws_secret_access_key') do set AWS_SECRET_ACCESS_KEY=%%i
for /f "tokens=*" %%i in ('aws configure get aws_session_token') do set AWS_SESSION_TOKEN=%%i

if defined AWS_ACCESS_KEY_ID (
    echo AWS_ACCESS_KEY_ID: %AWS_ACCESS_KEY_ID%
) else (
    echo AWS_ACCESS_KEY_ID: (not found in config - check your lab credentials)
)

if defined AWS_SECRET_ACCESS_KEY (
    echo AWS_SECRET_ACCESS_KEY: %AWS_SECRET_ACCESS_KEY%
) else (
    echo AWS_SECRET_ACCESS_KEY: (not found in config - check your lab credentials)
)

if defined AWS_SESSION_TOKEN (
    echo AWS_SESSION_TOKEN: %AWS_SESSION_TOKEN%
) else (
    echo AWS_SESSION_TOKEN: (not found - may not be needed for your setup)
)

echo.
echo 🪣 S3 Configuration:
echo -------------------
set BUCKET_NAME=quizmaster-v2-%USERNAME%-%RANDOM%
echo S3_BUCKET_NAME: %BUCKET_NAME%

echo.
echo 🔐 Cognito Configuration:
echo ------------------------
echo COGNITO_POOL_ID: us-east-1_RsOYVRSJu
echo COGNITO_CLIENT_ID: 6npa9g9it0o66diikabm29j9je
echo COGNITO_DOMAIN: medhya.auth.us-east-1.amazoncognito.com

echo.
echo 🌐 Frontend Environment Variables:
echo ---------------------------------
echo VITE_COGNITO_DOMAIN: medhya.auth.us-east-1.amazoncognito.com
echo VITE_COGNITO_CLIENT_ID: 6npa9g9it0o66diikabm29j9je
echo VITE_REDIRECT_URI: (will be auto-generated)
echo VITE_LOGOUT_URI: (will be auto-generated)
echo VITE_API_BASE_URL: (will be auto-generated)

echo.
echo 📋 Next Steps:
echo 1. Copy the values above to GitHub Secrets
echo 2. Push your code to GitHub
echo 3. GitHub Actions will automatically deploy your app!

echo.
echo 🔗 Useful Links:
echo - GitHub Secrets: https://github.com/yourusername/yourrepo/settings/secrets/actions
echo - AWS Console: https://console.aws.amazon.com/
echo - Cognito Console: https://console.aws.amazon.com/cognito/

pause