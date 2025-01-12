@echo off
REM Set the path to the folder
set folderPath=%USERPROFILE%\Desktop\flipbook-Mahakumbh

REM Navigate to the folder
cd /d "%folderPath%"
if %errorlevel% neq 0 (
    echo Failed to navigate to %folderPath%. Make sure the folder exists.
    exit /b 1
)

REM Perform git pull
git pull
if %errorlevel% neq 0 (
    echo Failed to pull updates from the repository. Please check your git configuration.
    exit /b 1
)

REM Display success message
echo Git pull successful.
pause
