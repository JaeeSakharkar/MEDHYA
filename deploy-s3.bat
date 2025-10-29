@echo off
echo ========================================
echo   QuizMaster V2 - S3 Deployment
echo ========================================
echo.

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: AWS CLI is not installed or not in PATH
    echo Please install AWS CLI first: https://aws.amazon.com/cli/
    pause
    exit /b 1
)

REM Set your S3 bucket name here
set BUCKET_NAME=your-quizmaster-bucket-name

echo Building frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

echo.
echo Uploading to S3 bucket: %BUCKET_NAME%
echo.

REM Upload all files from dist folder to S3
aws s3 sync dist/ s3://%BUCKET_NAME%/ --delete

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Deployment Successful!
    echo ========================================
    echo.
    echo Your app is now available at:
    echo http://%BUCKET_NAME%.s3-website-us-east-1.amazonaws.com
    echo.
    echo Or if you have CloudFront:
    echo https://your-cloudfront-domain.cloudfront.net
    echo.
) else (
    echo.
    echo ERROR: Deployment failed
    echo Please check your AWS credentials and bucket permissions
)

cd ..
pause