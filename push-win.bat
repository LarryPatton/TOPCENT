@echo off
setlocal enabledelayedexpansion

REM Windows：双击运行（CMD 窗口会打开）
REM 作用：提示输入提交说明，然后自动 add/commit/push

cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] 找不到 git。请先安装 Git for Windows，并确保 git 在 PATH 里。
  pause
  exit /b 1
)

for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "BRANCH=%%b"
if "%BRANCH%"=="" (
  echo [ERROR] 当前目录不是 Git 仓库，或无法读取分支信息。
  pause
  exit /b 1
)

set "HAS_CHANGES="
for /f "delims=" %%l in ('git status --porcelain') do (
  set "HAS_CHANGES=1"
  goto :after_status
)
:after_status

if not defined HAS_CHANGES (
  echo 工作区没有改动，无需提交。
  pause
  exit /b 0
)

set "MSG="
set /p MSG=请输入提交说明（可留空自动生成）：
if "%MSG%"=="" (
  for /f "delims=" %%t in ('powershell -NoProfile -Command "Get-Date -Format ''yyyy-MM-dd HH:mm:ss''"') do set "TS=%%t"
  set "MSG=chore: auto push %TS%"
)

echo 当前分支：%BRANCH%
echo 提交信息：%MSG%

git add -A

git diff --cached --quiet
if not errorlevel 1 (
  echo 没有可提交的变更（可能都被 .gitignore 忽略了）。
  pause
  exit /b 0
)

git commit -m "%MSG%"
if errorlevel 1 (
  echo [ERROR] commit 失败，请检查上方输出。
  pause
  exit /b 1
)

git push origin %BRANCH%
if errorlevel 1 (
  echo [ERROR] push 失败，请检查上方输出（通常是权限/登录问题）。
  pause
  exit /b 1
)

echo 完成。
pause

