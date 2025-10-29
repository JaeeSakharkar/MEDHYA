@echo off
echo ========================================
echo   API Gateway Debug Script
echo ========================================
echo.

REM Set your API Gateway URL here
set API_URL=https://p0r3ff73bh.execute-api.us-east-1.amazonaws.com/prod

echo Testing API Gateway endpoints...
echo API URL: %API_URL%
echo.

echo 1. Testing health check endpoint...
curl -v -X GET "%API_URL%/"
echo.
echo.

echo 2. Testing status endpoint...
curl -v -X GET "%API_URL%/status"
echo.
echo.

echo 3. Testing CORS preflight...
curl -v -X OPTIONS "%API_URL%/quizzes" ^
  -H "Origin: http://localhost:8081" ^
  -H "Access-Control-Request-Method: GET" ^
  -H "Access-Control-Request-Headers: Authorization"
echo.
echo.

echo 4. Testing without authentication (should fail)...
curl -v -X GET "%API_URL%/quizzes"
echo.
echo.

echo ========================================
echo   Authentication Required Tests
echo ========================================
echo.
echo Please provide your JWT token for authenticated tests.
echo You can get this from your browser's developer tools:
echo 1. Login to your app
echo 2. Open Developer Tools ^> Application ^> Local Storage
echo 3. Look for auth token or check Network tab for Authorization header
echo.

set /p JWT_TOKEN="Enter your JWT token (or press Enter to skip): "

if "%JWT_TOKEN%"=="" (
    echo Skipping authenticated tests...
    goto :end
)

echo.
echo 5. Testing authentication...
curl -v -X GET "%API_URL%/test-auth" ^
  -H "Authorization: Bearer %JWT_TOKEN%"
echo.
echo.

echo 6. Testing quizzes endpoint...
curl -v -X GET "%API_URL%/quizzes" ^
  -H "Authorization: Bearer %JWT_TOKEN%"
echo.
echo.

echo 7. Testing users endpoint (admin only)...
curl -v -X GET "%API_URL%/users" ^
  -H "Authorization: Bearer %JWT_TOKEN%"
echo.
echo.

echo 8. Testing scores endpoint (admin only)...
curl -v -X GET "%API_URL%/scores/all" ^
  -H "Authorization: Bearer %JWT_TOKEN%"
echo.
echo.

:end
echo ========================================
echo   Debug Complete
echo ========================================
echo.
echo If you see errors, check:
echo 1. CloudWatch logs for your Lambda function
echo 2. API Gateway configuration
echo 3. Lambda function permissions
echo 4. DynamoDB table exists and has correct permissions
echo.
echo For detailed debugging, see API_GATEWAY_DEBUG_GUIDE.md
echo.
pause