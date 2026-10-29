@echo off
rem Sobe o pacote buildado (front + back no mesmo jar): http://localhost:8080
cd /d "%~dp0"
if not exist "backend\target\framework-generico.jar" (
  echo Jar nao encontrado. Rode build.cmd primeiro.
  exit /b 1
)
java -jar "backend\target\framework-generico.jar"
