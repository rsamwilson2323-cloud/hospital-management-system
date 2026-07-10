@echo off
SETLOCAL EnableDelayedExpansion
title HMS - Hospital Management System
color 0B

set "API_PORT=5000"
set "FRONTEND_PORT=3000"
set "NODE_OPTIONS=--dns-result-order=ipv4first"

echo.
echo  ================================================
echo   HOSPITAL MANAGEMENT SYSTEM
echo  ================================================
echo.

:: ════════════════════════════════════════════════════
::  STEP 1 - Find Node.js
:: ════════════════════════════════════════════════════
echo  [1/4] Locating Node.js...
set "NODE_DIR="

for /f "delims=" %%P in ('where node 2^>nul') do (
    if not defined NODE_DIR set "NODE_DIR=%%~dpP"
)
if not defined NODE_DIR (
    for /f "delims=" %%P in ('powershell -NoProfile -Command ^
      "Get-Command node -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source" 2^>nul') do (
        set "NODE_DIR=%%~dpP"
    )
)
if not defined NODE_DIR (
    for /f "tokens=2*" %%A in ('reg query "HKLM\SOFTWARE\Node.js" /v InstallPath 2^>nul') do set "NODE_DIR=%%B\"
)
if not defined NODE_DIR (
    for /f "tokens=2*" %%A in ('reg query "HKLM\SOFTWARE\WOW6432Node\Node.js" /v InstallPath 2^>nul') do set "NODE_DIR=%%B\"
)
if not defined NODE_DIR (
    for %%D in ("%ProgramFiles%\nodejs" "%ProgramFiles(x86)%\nodejs" "%LOCALAPPDATA%\Programs\nodejs" "C:\nodejs") do (
        if not defined NODE_DIR if exist "%%~D\node.exe" set "NODE_DIR=%%~D\"
    )
)
if not defined NODE_DIR (
    echo  [ERROR] Node.js not found. Install from https://nodejs.org then run hms.bat again.
    start "" "https://nodejs.org"
    pause & exit /b 1
)
set "PATH=!NODE_DIR!;!PATH!"
echo        [OK] Node.js: !NODE_DIR!

:: Find pnpm
set "PNPM_OK=0"
where pnpm >nul 2>&1 && set "PNPM_OK=1"
if "!PNPM_OK!"=="0" (
    for /f "delims=" %%P in ('powershell -NoProfile -Command ^
      "Get-Command pnpm -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source" 2^>nul') do (
        set "PATH=%%~dpP;!PATH!" & set "PNPM_OK=1"
    )
)
if "!PNPM_OK!"=="0" (
    for %%D in ("%APPDATA%\npm" "%LOCALAPPDATA%\pnpm") do (
        if exist "%%~D\pnpm.cmd" ( set "PATH=%%~D;!PATH!" & set "PNPM_OK=1" )
    )
)
if "!PNPM_OK!"=="0" (
    echo        pnpm not found, installing...
    call "!NODE_DIR!npm.cmd" install -g pnpm
    set "PATH=%APPDATA%\npm;!PATH!"
)
echo        [OK] pnpm ready.
echo.

:: ════════════════════════════════════════════════════
::  STEP 2 - Install packages (first time only)
:: ════════════════════════════════════════════════════
if not exist "node_modules" (
    echo  [2/4] Installing packages - first time takes 5-10 minutes...
    echo        Do NOT close this window.
    echo.
    call pnpm approve-builds --all >nul 2>&1
    call pnpm install --no-frozen-lockfile
    if !ERRORLEVEL! neq 0 (
        echo        Retrying after approving build scripts...
        call pnpm approve-builds --all >nul 2>&1
        call pnpm install --no-frozen-lockfile
        if !ERRORLEVEL! neq 0 (
            echo  [ERROR] Install failed. See errors above.
            pause & exit /b 1
        )
    )
    call pnpm run typecheck:libs >nul 2>&1
    echo.
    echo        [OK] Packages installed.
    echo.
) else (
    echo  [2/4] Packages already installed - skipping.
    echo.
)

:: ════════════════════════════════════════════════════
::  STEP 3 - Build API server
:: ════════════════════════════════════════════════════
echo  [3/4] Building API server...
call pnpm --filter @workspace/api-server run build
if !ERRORLEVEL! neq 0 (
    echo  [ERROR] Build failed. See errors above.
    pause & exit /b 1
)
echo        [OK] Build done.
echo.

:: ════════════════════════════════════════════════════
::  STEP 4 - Start servers
:: ════════════════════════════════════════════════════
echo  [4/4] Starting servers...

:: --- API server window ---
:: NOTE: Do NOT use | in any echo line here - it breaks the bat
(
echo @echo off
echo title HMS - API Server
echo color 09
echo cd /d "%~dp0"
echo set PORT=%API_PORT%
echo set NODE_ENV=development
echo set NODE_OPTIONS=--dns-result-order=ipv4first
echo echo.
echo echo  HMS API Server - port %API_PORT%
echo echo  Do not close this window.
echo echo.
echo "!NODE_DIR!node.exe" --enable-source-maps artifacts\api-server\dist\index.mjs
echo echo.
echo echo  API server stopped.
echo pause
) > _api.bat
start "HMS - API Server" cmd /k "%~dp0_api.bat"

echo        API server starting...
timeout /t 8 /nobreak >nul

:: --- Frontend window ---
:: NOTE: Do NOT use | in any echo line here - it breaks the bat
(
echo @echo off
echo title HMS - Frontend
echo color 0E
echo cd /d "%~dp0"
echo set PORT=%FRONTEND_PORT%
echo set API_PORT=%API_PORT%
echo set BASE_PATH=/
echo set NODE_OPTIONS=--dns-result-order=ipv4first
echo echo.
echo echo  HMS Frontend - port %FRONTEND_PORT%
echo echo  Do not close this window.
echo echo.
echo call pnpm --filter @workspace/hms run dev
echo echo.
echo echo  Frontend stopped.
echo pause
) > _frontend.bat
start "HMS - Frontend" cmd /k "%~dp0_frontend.bat"

echo        Frontend starting (waiting 25 seconds)...
timeout /t 25 /nobreak >nul

:: ── Get local IP ─────────────────────────────────────
set "LOCAL_IP=your-local-ip"
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /i "IPv4"') do (
    set "R=%%A" & set "LOCAL_IP=!R:~1!" & goto :GotIP
)
:GotIP

start "" "http://127.0.0.1:%FRONTEND_PORT%"

cls
echo.
echo  ====================================================
echo    HOSPITAL MANAGEMENT SYSTEM  --  RUNNING!
echo  ====================================================
echo.
echo    On this PC :  http://127.0.0.1:%FRONTEND_PORT%
echo.
echo    On network :  http://!LOCAL_IP!:%FRONTEND_PORT%
echo    (phones and other PCs on the same Wi-Fi)
echo.
echo    Data is saved in the  data\  folder as JSON files.
echo    No database needed.
echo.
echo    To stop: close the API and Frontend windows.
echo    To restart: run hms.bat again.
echo  ====================================================
echo.
pause
ENDLOCAL
