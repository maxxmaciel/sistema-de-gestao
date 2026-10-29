@echo off
rem Backend em modo dev: http://localhost:8080 (API em /api). Dados mockados recriados a cada start.
cd /d "%~dp0backend"
call "%~dp0scripts\mvn.cmd" -q -B compile exec:java
