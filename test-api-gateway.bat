@echo off
echo 🧪 API Gateway Test Script
echo =========================

set /p API_URL="Enter your API Gateway URL: "

if "%API_URL%"=="" (
    echo ❌ API Gateway URL is required
    echo Example: https://abc123def.execute-api.us-east-1.amazonaws.com/prod
    pause
    exit /b 1
)

echo.
echo 🔍 Testing API Gateway endpoints...
echo Base URL: %API_URL%
echo.

echo 1. Health Check Test:
echo ----------------------
curl -s "%API_URL%/" -w "\nStatus Code: %%{http_code}\n"
echo.

echo 2. Status Check Test:
echo ---------------------
curl -s "%API_URL%/status" -w "\nStatus Code: %%{http_code}\n"
echo.

echo 3. CORS Preflight Test:
echo -----------------------
curl -s -X OPTIONS "%API_URL%/" ^
  -H "Origin: http://localhost:8081" ^
  -H "Access-Control-Request-Method: GET" ^
  -w "\nStatus Code: %%{http_code}\n"
echo.

echo 4. Invalid Endpoint Test:
echo -------------------------
curl -s "%API_URL%/invalid-endpoint" -w "\nStatus Code: %%{http_code}\n"
echo.

set /p JWT_TOKEN="Enter JWT token for auth tests (or press Enter to skip): "

if not "%JWT_TOKEN%"=="" (
    echo.
    echo 5. Authentication Test:
    echo ----------------------
    curl -s "%API_URL%/test-auth" ^
      -H "Authorization: Bearer %JWT_TOKEN%" ^
      -w "\nStatus Code: %%{http_code}\n"
    echo.
    
    echo 6. Get Quizzes Test:
    echo -------------------
    curl -s "%API_URL%/quizzes" ^
      -H "Authorization: Bearer %JWT_TOKEN%" ^
      -w "\nStatus Code: %%{http_code}\n"
    echo.
    
    echo 7. Get User Profile Test:
    echo ------------------------
    curl -s "%API_URL%/users/profile" ^
      -H "Authorization: Bearer %JWT_TOKEN%" ^
      -w "\nStatus Code: %%{http_code}\n"
    echo.
) else (
    echo ⏭️ Skipping authentication tests
)

echo ✅ API Gateway testing complete!
echo.
echo 📊 Expected Results:
echo - Health check: 200 status with JSON response
echo - Status check: 200 status with system info
echo - CORS test: 200 status with CORS headers
echo - Invalid endpoint: 404 status
echo - Auth tests: 200 status if JWT is valid, 401 if invalid
echo.

echo 📝 If tests pass:
echo 1. ✅ API Gateway is configured correctly
echo 2. ✅ Lambda integration is working
echo 3. ✅ CORS is enabled
echo 4. ✅ Ready to update frontend with this URL
echo.

echo 🔗 Your API Gateway URL: %API_URL%
pause