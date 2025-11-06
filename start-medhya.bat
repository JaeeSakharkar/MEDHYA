@echo off
echo 🏥 Starting MEDHYA Medical Education Platform...
echo.

echo ✅ Step 1: Starting Backend (MongoDB + Express)...
start "MEDHYA Backend" cmd /k "cd backend && npm run dev"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo ✅ Step 2: Starting Frontend (React + Vite)...
start "MEDHYA Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo 🎉 MEDHYA is starting up!
echo.
echo 📱 Frontend will be available at: http://localhost:8081
echo 🔧 Backend API will be available at: http://localhost:5000
echo 🍃 MongoDB Atlas database connected
echo.
echo 💡 Both terminals will open automatically
echo 🔄 Hot reload is enabled for development
echo.
echo Press any key to close this window...
pause >nul