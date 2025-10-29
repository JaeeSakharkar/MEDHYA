@echo off
echo 🧪 Lambda Test Script for QuizMaster V2
echo ========================================

set /p LAMBDA_URL="Enter your Lambda URL (e.g., https://abc123.execute-api.us-east-1.amazonaws.com/prod): "

if "%LAMBDA_URL%"=="" (
    echo ❌ Lambda URL is required
    pause
    exit /b 1
)

echo.
echo 🔍 Testing Lambda endpoints...
echo.

echo 1. Health Check Test:
echo ----------------------
curl -s "%LAMBDA_URL%/"
echo.

echo 2. Status Check Test:
echo ---------------------
curl -s "%LAMBDA_URL%/status"
echo.

echo 3. CORS Test (OPTIONS):
echo -----------------------
curl -s -X OPTIONS "%LAMBDA_URL%/" -H "Origin: http://localhost:8081"
echo.

set /p JWT_TOKEN="Enter JWT token (optional, press Enter to skip auth tests): "

if not "%JWT_TOKEN%"=="" (
    echo.
    echo 4. Authentication Test:
    echo ----------------------
    curl -s "%LAMBDA_URL%/test-auth" -H "Authorization: Bearer %JWT_TOKEN%"
    echo.
    
    echo 5. Get Quizzes Test:
    echo -------------------
    curl -s "%LAMBDA_URL%/quizzes" -H "Authorization: Bearer %JWT_TOKEN%"
    echo.
    
    echo 6. Get User Profile Test:
    echo ------------------------
    curl -s "%LAMBDA_URL%/users/profile" -H "Authorization: Bearer %JWT_TOKEN%"
    echo.
)

echo ✅ Lambda testing complete!
echo.
echo 📝 Next steps:
echo 1. If health check works: ✅ Lambda is deployed correctly
echo 2. If auth tests work: ✅ Cognito integration is working
echo 3. Update your frontend VITE_API_BASE_URL to: %LAMBDA_URL%
echo 4. Update Cognito callback URLs if needed

pause