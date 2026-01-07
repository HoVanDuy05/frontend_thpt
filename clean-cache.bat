@echo off
echo Stopping Node.js processes...
taskkill /F /IM node.exe
taskkill /F /IM npm.cmd

echo.
echo Waiting for processes to release locks...
timeout /t 3 /nobreak

echo.
echo Cleaning .next cache...
rmdir /s /q .next

echo.
echo Done! Please run "npm run dev" again.
pause
