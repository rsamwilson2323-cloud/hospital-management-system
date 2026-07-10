@echo off
title HMS - API Server
color 09
cd /d "D:\main coding\hospital-management-system\"
set PORT=5000
set NODE_ENV=development
set NODE_OPTIONS=--dns-result-order=ipv4first
echo.
echo  HMS API Server - port 5000
echo  Do not close this window.
echo.
"C:\Program Files\nodejs\node.exe" --enable-source-maps artifacts\api-server\dist\index.mjs
echo.
echo  API server stopped.
pause
