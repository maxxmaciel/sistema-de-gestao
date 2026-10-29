@echo off
rem Build completo: front dentro do backend + jar executavel unico.
setlocal

echo [1/2] Front: typecheck + vite build (sai em backend\src\main\resources\public)
cd /d "%~dp0frontend"
if not exist node_modules (
  call npm install || exit /b 1
)
call npm run build || exit /b 1

echo [2/2] Back: mvn package (gera backend\target\framework-generico.jar)
cd /d "%~dp0backend"
call "%~dp0scripts\mvn.cmd" -q -B package || exit /b 1

echo.
echo Pronto: backend\target\framework-generico.jar
echo Rode start.cmd e abra http://localhost:8080
