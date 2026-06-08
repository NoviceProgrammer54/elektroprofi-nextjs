# ELEKTROPROFI — пересборка и перезапуск
# Запускать когда внес изменения в код

$BUN = "C:\Users\Disain1\.bun\bin\bun.exe"
$DIR = "C:\Users\Disain1\Downloads\elektroprofi-nextjs"

Write-Host "🔨 Пересборка Next.js..." -ForegroundColor Cyan
Set-Location $DIR
& $BUN run build
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Сборка не удалась!" -ForegroundColor Red; exit 1 }

Write-Host "✅ Сборка успешна!" -ForegroundColor Green
Write-Host "🚀 Перезапуск сервера и туннеля..." -ForegroundColor Cyan
& powershell.exe -ExecutionPolicy Bypass -File "$DIR\start-tunnel.ps1"
