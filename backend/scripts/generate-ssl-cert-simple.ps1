# ==============================================================================
# SSL Certificate Generator for Development (Windows PowerShell)
# Simplified version
# ==============================================================================

Write-Host "========================================" -ForegroundColor Green
Write-Host "SSL Certificate Generator (Windows)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Create certs directory
$certDir = "..\certs"
if (-not (Test-Path $certDir)) {
    New-Item -ItemType Directory -Path $certDir | Out-Null
    Write-Host "Created directory: $certDir" -ForegroundColor Green
}

# Certificate info
$country = "VN"
$state = "HCM"
$city = "Ho Chi Minh"
$organization = "Antique Store"
$commonName = "localhost"
$daysValid = 365

$keyPath = Join-Path $certDir "localhost.key"
$crtPath = Join-Path $certDir "localhost.crt"

Write-Host ""
Write-Host "Creating SSL certificate..." -ForegroundColor Yellow

# Check if certificate already exists
if ((Test-Path $keyPath) -and (Test-Path $crtPath)) {
    Write-Host ""
    Write-Host "Certificate already exists!" -ForegroundColor Yellow
    $recreate = Read-Host "Do you want to recreate it? (Y/N)"
    if ($recreate -ne 'Y' -and $recreate -ne 'y') {
        Write-Host "Keeping existing certificate." -ForegroundColor Green
        exit 0
    }
}

# Check for OpenSSL
Write-Host ""
Write-Host "Checking for OpenSSL..." -ForegroundColor Yellow

$opensslPath = $null
try {
    $opensslCmd = Get-Command openssl -ErrorAction Stop
    $opensslPath = $opensslCmd.Source
    Write-Host "OpenSSL found: $opensslPath" -ForegroundColor Green
} catch {
    Write-Host "OpenSSL not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install OpenSSL:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor White
    Write-Host "2. Or use Chocolatey: choco install openssl" -ForegroundColor White
    Write-Host "3. Or use Scoop: scoop install openssl" -ForegroundColor White
    Write-Host ""
    Write-Host "OR use PowerShell built-in method (creates PFX only):" -ForegroundColor Cyan
    Write-Host "New-SelfSignedCertificate -DnsName localhost -CertStoreLocation Cert:\CurrentUser\My" -ForegroundColor White
    exit 1
}

# Generate private key
Write-Host ""
Write-Host "Step 1: Creating private key..." -ForegroundColor Yellow
$result = & openssl genrsa -out $keyPath 2048 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error creating private key!" -ForegroundColor Red
    Write-Host $result
    exit 1
}
Write-Host "Private key created successfully" -ForegroundColor Green

# Generate self-signed certificate
Write-Host ""
Write-Host "Step 2: Creating self-signed certificate..." -ForegroundColor Yellow
$subj = "/C=$country/ST=$state/L=$city/O=$organization/CN=$commonName"
$san = "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1,IP:0.0.0.0"

$result = & openssl req -new -x509 -key $keyPath -out $crtPath -days $daysValid -subj $subj -addext $san 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error creating certificate!" -ForegroundColor Red
    Write-Host $result
    exit 1
}
Write-Host "Certificate created successfully" -ForegroundColor Green

# Success message
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Certificate created successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Location:" -ForegroundColor White
Write-Host "  Private Key: $keyPath" -ForegroundColor Cyan
Write-Host "  Certificate: $crtPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Valid for: $daysValid days" -ForegroundColor White

# Trust certificate instructions
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "IMPORTANT: Trust the Certificate" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Browsers will show 'Not Secure' warning for self-signed certificates." -ForegroundColor White
Write-Host ""
Write-Host "Option 1 - Chrome Flag (Easiest):" -ForegroundColor Green
Write-Host "  1. Open chrome://flags/#allow-insecure-localhost" -ForegroundColor White
Write-Host "  2. Set to 'Enabled'" -ForegroundColor White
Write-Host "  3. Restart Chrome" -ForegroundColor White
Write-Host ""
Write-Host "Option 2 - Import Certificate (Administrator required):" -ForegroundColor Green
Write-Host "  Import-Certificate -FilePath '$crtPath' -CertStoreLocation Cert:\LocalMachine\Root" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 3 - Accept in Browser:" -ForegroundColor Green
Write-Host "  Visit https://localhost:5000" -ForegroundColor White
Write-Host "  Click 'Advanced' -> 'Proceed to localhost (unsafe)'" -ForegroundColor White

# Ask to trust now
Write-Host ""
$trust = Read-Host "Do you want to trust this certificate now? (requires Administrator) (Y/N)"
if ($trust -eq 'Y' -or $trust -eq 'y') {
    # Check for Administrator
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    
    if ($isAdmin) {
        try {
            Import-Certificate -FilePath $crtPath -CertStoreLocation Cert:\LocalMachine\Root | Out-Null
            Write-Host ""
            Write-Host "Certificate trusted successfully!" -ForegroundColor Green
        } catch {
            Write-Host ""
            Write-Host "Error trusting certificate:" -ForegroundColor Red
            Write-Host $_.Exception.Message
        }
    } else {
        Write-Host ""
        Write-Host "ERROR: Administrator rights required!" -ForegroundColor Red
        Write-Host "Please run PowerShell as Administrator and execute:" -ForegroundColor Yellow
        Write-Host "Import-Certificate -FilePath '$crtPath' -CertStoreLocation Cert:\LocalMachine\Root" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Show certificate info
Write-Host "Certificate Information:" -ForegroundColor Yellow
& openssl x509 -in $crtPath -noout -subject -issuer -dates

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update backend/.env:" -ForegroundColor White
Write-Host "   ENABLE_SSL=true" -ForegroundColor Gray
Write-Host "2. Start backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "3. Start frontend: npm run dev" -ForegroundColor White
Write-Host "4. Visit: https://localhost:5173" -ForegroundColor White

exit 0

