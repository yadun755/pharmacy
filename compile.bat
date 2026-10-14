@echo off
setlocal
echo ===============================================================
echo   Compiling St. Thomas Pharmacy Management System (Java SE)
echo ===============================================================

set "JAVA_BIN=C:\Users\YADHU\OneDrive\Documents\openjdk-24.0.1_windows-x64_bin\jdk-24.0.1\bin"
if exist "%JAVA_BIN%\javac.exe" (
    set "JAVAC_CMD=%JAVA_BIN%\javac.exe"
) else (
    set "JAVAC_CMD=javac"
)

if not exist bin mkdir bin

echo Compiling Java source files...
"%JAVAC_CMD%" -d bin -encoding UTF-8 src\com\pharmacy\model\*.java src\com\pharmacy\storage\*.java src\com\pharmacy\service\*.java src\com\pharmacy\web\*.java src\com\pharmacy\ui\*.java src\com\pharmacy\Main.java

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Compilation completed successfully into bin/
) else (
    echo [ERROR] Compilation failed with error code %ERRORLEVEL%
)

endlocal
