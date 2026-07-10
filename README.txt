========================================
  HOSPITAL MANAGEMENT SYSTEM
  How to run on your PC
========================================

BEFORE YOU START - Install these once:
  1. Node.js  →  https://nodejs.org  (click "LTS", install it)
  2. ngrok    →  https://ngrok.com/download  (extract ngrok.exe anywhere in PATH)
  3. Make sure PostgreSQL 18 is installed at D:\PostgreSQL18

----------------------------------------
FIRST TIME ONLY - Run setup.bat
----------------------------------------
  1. Double-click  setup.bat
  2. Click "Yes" when Windows asks for admin permission
  3. Wait 5-10 minutes for packages to install
  4. You will see "SETUP COMPLETE" when done
  5. Close the window

  You only need to do this once.
  Next time, go straight to step below.

----------------------------------------
EVERY TIME - Run start.bat
----------------------------------------
  1. Double-click  start.bat
  2. Click "Yes" for admin permission
  3. Wait about 30 seconds
  4. Browser opens automatically
  5. Keep all black CMD windows open!

----------------------------------------
YOUR LINKS (after start.bat finishes)
----------------------------------------
  Network:  http://10.50.49.53:3000
  Public:   your ngrok link (shown in the window)

  Both links show the SAME data.
  Any change made on one link appears on the other.

----------------------------------------
NGROK SETUP (for public link)
----------------------------------------
  1. Sign up free at https://dashboard.ngrok.com
  2. Go to  https://dashboard.ngrok.com/authtokens
  3. Copy your auth token
  4. Open start.bat in Notepad
  5. Find this line:
       set "NGROK_TOKEN=PASTE_YOUR_NGROK_AUTHTOKEN_HERE"
  6. Replace PASTE_YOUR_NGROK_AUTHTOKEN_HERE with your token
  7. Save the file and run start.bat again

----------------------------------------
IF SOMETHING GOES WRONG
----------------------------------------
  "PostgreSQL not running"
    → Open services.msc (Win+R, type services.msc)
    → Find "postgresql-x64-18", right-click → Start
    → Run start.bat again

  "pnpm not found" or packages failing
    → Run setup.bat again

  "ERR_NGROK_8012" or ngrok error
    → The app is not running yet, wait longer
    → Or run setup.bat first, then start.bat

  App loads but no data
    → Run setup.bat (it will seed the sample data)

========================================
