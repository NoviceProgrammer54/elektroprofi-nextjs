# ELEKTROPROFI Next.js — автозапуск сервера и туннеля (PRODUCTION)
# Запускает процессы НЕЗАВИСИМО — живут после закрытия этого окна

$BUN   = "C:\Users\Disain1\.bun\bin\bun.exe"
$CF    = "C:\Users\Disain1\.bun\bin\cloudflared.exe"
$DIR   = "C:\Users\Disain1\Downloads\elektroprofi-nextjs"
$PORT  = 3000
$TOKEN = "8778478556:AAFQqoMMRaR3s28U4E8xnAoA_x5_H7nL_WU"
$CHAT  = "1053228226"
$LOG   = "$DIR\tunnel.log"
$CF_OUT = "$env:TEMP\cf-nextjs-output.txt"

function Send-Telegram($text) {
    $body = @{ chat_id = $CHAT; text = $text; parse_mode = "HTML" } | ConvertTo-Json -Compress
    try {
        Invoke-RestMethod "https://api.telegram.org/bot$TOKEN/sendMessage" `
            -Method POST -ContentType "application/json" -Body $body -ErrorAction Stop | Out-Null
    } catch { "[$(Get-Date)] Telegram error: $_" | Add-Content $LOG }
}

"[$(Get-Date)] ===== Starting ELEKTROPROFI Next.js (PRODUCTION) =====" | Out-File $LOG -Encoding UTF8

# 1. Убиваем старые процессы
Get-Process -Name "bun","node","cloudflared" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# 2. Запускаем production сервер (bun run start)
"[$(Get-Date)] Starting Next.js production server on port $PORT..." | Add-Content $LOG
$devProc = Start-Process -FilePath $BUN -ArgumentList "run start" `
    -WorkingDirectory $DIR `
    -WindowStyle Hidden `
    -PassThru
"[$(Get-Date)] Next.js PID: $($devProc.Id)" | Add-Content $LOG

# Ждём готовности (production запускается быстрее)
$ready = $false
for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Seconds 1
    $test = Test-NetConnection -ComputerName localhost -Port $PORT -WarningAction SilentlyContinue -InformationLevel Quiet
    if ($test) { $ready = $true; break }
}

if ($ready) {
    "[$(Get-Date)] Production server ready!" | Add-Content $LOG
} else {
    "[$(Get-Date)] Server not responding yet, continuing..." | Add-Content $LOG
}

# 3. Запускаем cloudflared
"[$(Get-Date)] Starting cloudflared -> http://localhost:$PORT..." | Add-Content $LOG
if (Test-Path $CF_OUT) { Remove-Item $CF_OUT -Force }
$cfProc = Start-Process -FilePath $CF `
    -ArgumentList "tunnel --url http://localhost:$PORT" `
    -WindowStyle Hidden `
    -RedirectStandardError $CF_OUT `
    -PassThru
"[$(Get-Date)] cloudflared PID: $($cfProc.Id)" | Add-Content $LOG

# Ждём URL туннеля
$url = $null
for ($i = 0; $i -lt 40; $i++) {
    Start-Sleep -Seconds 1
    if (Test-Path $CF_OUT) {
        $content = Get-Content $CF_OUT -Raw -ErrorAction SilentlyContinue
        if ($content -match "(https://[a-z0-9\-]+\.trycloudflare\.com)") {
            $url = $Matches[1]; break
        }
    }
}

# 4. Сохраняем PIDs
@{ dev = $devProc.Id; cf = $cfProc.Id } | ConvertTo-Json | Out-File "$DIR\pids.json" -Encoding UTF8

# 5. Telegram
if ($url) {
    "[$(Get-Date)] Tunnel URL: $url" | Add-Content $LOG
    $msg = @"
🟢 <b>ELEKTROPROFI запущен!</b> (Production)

🌐 Публичная ссылка:
<b>$url</b>

📌 Разделы:
• <a href="$url/admin">$url/admin</a>
• <a href="$url/electricians">$url/electricians</a>
• <a href="$url/events">$url/events</a>
• <a href="$url/hiring">$url/hiring</a>
"@
    Send-Telegram $msg
    Write-Host "✅ Сайт доступен: $url"
    Write-Host "📱 Ссылка отправлена в Telegram"
} else {
    "[$(Get-Date)] ERROR: Tunnel URL not received" | Add-Content $LOG
    Send-Telegram "⚠️ Сервер запущен, но туннель не ответил."
    Write-Host "❌ Туннель не ответил"
}

Write-Host "Процессы работают в фоне."
