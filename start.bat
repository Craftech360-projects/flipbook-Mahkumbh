@echo off

REM Navigate to the flipbook folder
cd "%USERPROFILE%\Desktop\flipbook"

REM Run the application (assuming it's a Node.js app)
start cmd /k "npm start"  REM Adjust if you're using a different command to start the app

REM Wait for the application to load (you can adjust the time as needed)
timeout /t 10 /nobreak

REM Open Chrome in full-screen mode
start chrome --start-fullscreen --new-window http://localhost:3000

REM Wait for Chrome to load
timeout /t 5 /nobreak

REM Reload the page
start chrome --remote-debugging-port=9222 http://localhost:3000
timeout /t 2 /nobreak
