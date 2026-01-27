@echo off
REM ============================================================
REM Initial Sync Script for Windows
REM Run this once after cloning to populate skills
REM ============================================================

echo ============================================================
echo DEVKIT AGENT ASSISTANT - INITIAL SYNC
echo ============================================================

REM Create temp directory
if not exist "%TEMP%\devkit-sync" mkdir "%TEMP%\devkit-sync"

echo.
echo [1/4] Cloning antigravity-awesome-skills...
git clone --depth 1 https://github.com/sickn33/antigravity-awesome-skills.git "%TEMP%\devkit-sync\antigravity"

echo.
echo [2/4] Cloning agent-assistant...
git clone --depth 1 https://github.com/hainamchung/agent-assistant.git "%TEMP%\devkit-sync\agent-assistant"

echo.
echo [3/4] Cloning skill-rule...
git clone --depth 1 https://github.com/ngxtm/skill-rule.git "%TEMP%\devkit-sync\skill-rule"

echo.
echo [4/4] Running sync...
python scripts\sync_skills.py --primary "%TEMP%\devkit-sync\antigravity\skills" --secondary "%TEMP%\devkit-sync\agent-assistant\skills" --target .\skills

echo.
echo Copying agents and commands from agent-assistant...
xcopy /E /I /Y "%TEMP%\devkit-sync\agent-assistant\agents" .\agents
xcopy /E /I /Y "%TEMP%\devkit-sync\agent-assistant\commands" .\commands
xcopy /E /I /Y "%TEMP%\devkit-sync\agent-assistant\matrix-skills" .\matrix-skills

echo.
echo Copying rules from skill-rule...
xcopy /E /I /Y "%TEMP%\devkit-sync\skill-rule\rules" .\rules

echo.
echo Updating matrix indexes...
python scripts\update_matrix.py

echo.
echo ============================================================
echo SYNC COMPLETE!
echo ============================================================
echo.
echo Next steps:
echo   1. Review the synced content
echo   2. Commit and push to your repository
echo   3. Configure npm publishing (add NPM_TOKEN secret)
echo.

pause
