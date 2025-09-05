echo off


echo Installing dependencies...
call npm install

echo.
echo Starting Ananya's CloudWeb Server...
echo.
echo Frontend : http://localhost:8000
echo API Health Check: http://localhost:8000/api/health
echo API Recommendations: http://localhost:8000/api/recommendations
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js

pause
