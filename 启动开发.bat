@echo off
chcp 65001 >nul
title 新疆数据可视化大屏 - 开发模式
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
    echo [错误] 未检测到 npm，请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

if not exist node_modules (
    echo 首次运行，安装依赖中...
    call npm install
)

echo 启动开发服务器: http://localhost:8080/#/gdMap
call npm run dev
pause
