@echo off
chcp 65001 > nul
cls

echo ======================================
echo Medical Training Platform
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if server\node_modules exists
if not exist "server\node_modules" (
    echo [INFO] Installing server dependencies...
    
    REM Check if archive exists
    if exist "server-node_modules.tar.gz" (
        echo Extracting dependencies from archive...
        tar -xzf server-node_modules.tar.gz -C server
    ) else (
        echo Installing dependencies from npm...
        cd server
        call npm install --production
        cd ..
    )
)

REM Check if dist directory exists
if not exist "dist" (
    echo [ERROR] dist directory not found
    echo Make sure all files are extracted properly
    pause
    exit /b 1
)

REM Start the server
echo [INFO] Starting server...
echo.
cd server
start /B node serve.js
cd ..

echo.
echo ✓ Server started successfully!
echo.
echo Access the application:
echo   Local:   http://localhost:3000
echo   Network: http://%COMPUTERNAME%:3000
echo.
echo Press Ctrl+C to stop the server
echo.

pause
