@echo off
setlocal
echo ===============================================================
echo   Starting St. Thomas Pharmacy Management System (Pure Java)
echo ===============================================================

set "JAVA_BIN=C:\Users\YADHU\OneDrive\Documents\openjdk-24.0.1_windows-x64_bin\jdk-24.0.1\bin"
if exist "%JAVA_BIN%\java.exe" (
    set "JAVA_CMD=%JAVA_BIN%\java.exe"
) else (
    set "JAVA_CMD=java"
)

"%JAVA_CMD%" -cp bin com.pharmacy.Main

endlocal
pause
