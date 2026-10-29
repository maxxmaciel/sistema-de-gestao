@echo off
rem Acha o Maven: primeiro no PATH, depois o que ja existe nesta maquina (~\.m2\wrapper).
setlocal
where mvn >nul 2>nul
if not errorlevel 1 goto :path_mvn

set "LOCAL_MVN=%USERPROFILE%\.m2\wrapper\dists\gestao-maven-3.9.11\apache-maven-3.9.11\bin\mvn.cmd"
if exist "%LOCAL_MVN%" goto :local_mvn

echo [erro] Maven nao encontrado. Instale o Maven 3.9+ e coloque o mvn no PATH.
exit /b 1

:path_mvn
call mvn %*
exit /b %errorlevel%

:local_mvn
call "%LOCAL_MVN%" %*
exit /b %errorlevel%
