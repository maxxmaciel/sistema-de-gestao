@echo off
rem Front em modo dev: http://localhost:5173 (o Vite manda /api para o backend em :8080).
cd /d "%~dp0frontend"
if not exist node_modules (
  call npm install || exit /b 1
)
call npm run dev
