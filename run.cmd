
%echo off
echo ". . . Start install Autonext . . ."
@REM taskkill /F /IM chrome.exe /T > nul
set autonext_dir=%cd%
echo ". . . Done . . ."
@REM EXIT
call ./chrome_path.bat

@REM taskkill /F /IM chrome.exe /T > nul




