@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo ============================================================
echo   KINDLE E-INK DASHBOARD - LOCAL LAN WEB SERVER (PORT 8080)
echo ============================================================
echo.
echo Dia chi IP may tinh cua ban trong mang Wi-Fi (IPv4):
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"IPv4 Address" /C:"IPv4"') do (
    for /f "tokens=*" %%b in ("%%a") do echo   --^> http://%%b:8080
)
echo.
echo Tren may tinh, ban co the mo: http://localhost:8080
echo Tren Kindle E-Ink (cung Wi-Fi), mo Trinh duyet Web va nhap dia chi IPv4 o tren.
echo Nhan Ctrl + C de tat may chu.
echo ============================================================
echo.

where python >nul 2>nul
if %errorlevel%==0 (
    python -m http.server 8080 --bind 0.0.0.0
    goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 (
    py -m http.server 8080 --bind 0.0.0.0
    goto :eof
)

where npx >nul 2>nul
if %errorlevel%==0 (
    npx --yes serve -l 8080
    goto :eof
)

echo [LOI] Khong tim thay Python hoac Node/npx de chay may chu HTTP.
pause
