@echo off
title HMS - Frontend
color 0E
cd /d "D:\main coding\hospital-management-system\"
set PORT=3000
set API_PORT=5000
set BASE_PATH=/
set NODE_OPTIONS=--dns-result-order=ipv4first
echo.
echo  HMS Frontend - port 3000
echo  Do not close this window.
echo.
call pnpm --filter @workspace/hms run dev
echo.
echo  Frontend stopped.
pause
