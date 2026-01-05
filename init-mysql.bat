@echo off
chcp 65001 >nul
echo ========================================
echo MySQL 数据库初始化脚本
echo ========================================
echo.
echo 数据库信息：
echo   主机: 117.50.226.140:3306
echo   数据库: dify
echo   用户: root
echo.
echo 即将创建以下表：
echo   - mcp_quiz_tasks
echo   - mcp_quiz_task_logs
echo.
echo ========================================
echo.

set /p confirm="确认执行？(Y/N): "
if /i not "%confirm%"=="Y" (
    echo 已取消操作
    pause
    exit /b
)

echo.
echo 正在连接数据库并执行建表脚本...
echo.

mysql -h 117.50.226.140 -P 3306 -u root -pTyAdmin@2026 dify < recreate-tables-mysql.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo 数据库初始化成功！
    echo ========================================
) else (
    echo.
    echo ========================================
    echo 数据库初始化失败！请检查错误信息
    echo ========================================
)

echo.
pause
