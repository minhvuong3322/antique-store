# ==============================================================================
# SSL Certificate Generator for Development (Windows PowerShell)
# ==============================================================================
# Tạo self-signed SSL certificate cho môi trường development
# Chứng chỉ này KHÔNG được tin tưởng mặc định bởi trình duyệt
# và chỉ nên sử dụng cho development/testing
# ==============================================================================

Write-Host "========================================" -ForegroundColor Green
Write-Host "SSL Certificate Generator (Windows)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Tạo thư mục certs nếu chưa có
$certDir = "..\certs"
if (-not (Test-Path $certDir)) {
    New-Item -ItemType Directory -Path $certDir | Out-Null
}

# Kiểm tra OpenSSL
$openssl = $null
try {
    $openssl = Get-Command openssl -ErrorAction Stop
} catch {
    Write-Host "`n❌ Lỗi: OpenSSL không được tìm thấy!" -ForegroundColor Red
    Write-Host "`nCài đặt OpenSSL:" -ForegroundColor Yellow
    Write-Host "1. Download từ: https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor White
    Write-Host "2. Hoặc dùng Chocolatey: choco install openssl" -ForegroundColor White
    Write-Host "3. Hoặc dùng Scoop: scoop install openssl" -ForegroundColor White
    Write-Host "`nHoặc sử dụng phương pháp PowerShell native (không cần OpenSSL):" -ForegroundColor Cyan
    
    # Phương pháp 2: Dùng PowerShell native (không cần OpenSSL)
    $useNative = Read-Host "`nBạn có muốn tạo certificate bằng PowerShell native? (Y/N)"
    if ($useNative -eq 'Y' -or $useNative -eq 'y') {
        Write-Host "`nĐang tạo certificate bằng PowerShell..." -ForegroundColor Yellow
        
        $cert = New-SelfSignedCertificate `
            -Subject "CN=localhost" `
            -DnsName "localhost", "*.localhost", "127.0.0.1" `
            -KeyAlgorithm RSA `
            -KeyLength 2048 `
            -NotAfter (Get-Date).AddDays(365) `
            -CertStoreLocation "Cert:\CurrentUser\My" `
            -FriendlyName "Antique Store Development Certificate" `
            -HashAlgorithm SHA256 `
            -KeyUsage DigitalSignature, KeyEncipherment, DataEncipherment `
            -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1")
        
        # Export certificate
        $certPath = Join-Path $certDir "localhost.crt"
        $keyPath = Join-Path $certDir "localhost.key"
        $pfxPath = Join-Path $certDir "localhost.pfx"
        $password = ConvertTo-SecureString -String "dev123" -Force -AsPlainText
        
        # Export to PFX
        Export-PfxCertificate -Cert $cert -FilePath $pfxPath -Password $password | Out-Null
        
        # Export to PEM (certificate)
        $certBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
        $certPem = "-----BEGIN CERTIFICATE-----`n" + [System.Convert]::ToBase64String($certBytes, [System.Base64FormattingOptions]::InsertLineBreaks) + "`n-----END CERTIFICATE-----"
        $certPem | Out-File -FilePath $certPath -Encoding ASCII
        
        Write-Host "`n✅ Certificate đã được tạo!" -ForegroundColor Green
        Write-Host "📁 Certificate: $certPath" -ForegroundColor Cyan
        Write-Host "📁 PFX: $pfxPath (password: dev123)" -ForegroundColor Cyan
        Write-Host "`n⚠️  Lưu ý: PowerShell không thể export private key dưới dạng PEM" -ForegroundColor Yellow
        Write-Host "Để sử dụng với Node.js, cần dùng PFX format hoặc cài OpenSSL" -ForegroundColor Yellow
        
        # Trust certificate
        $trustCert = Read-Host "`nBạn có muốn trust certificate này? (cần quyền Administrator) (Y/N)"
        if ($trustCert -eq 'Y' -or $trustCert -eq 'y') {
            $store = New-Object System.Security.Cryptography.X509Certificates.X509Store("Root", "LocalMachine")
            $store.Open("ReadWrite")
            $store.Add($cert)
            $store.Close()
            Write-Host "✅ Certificate đã được trust!" -ForegroundColor Green
        }
        
        exit 0
    }
    exit 1
}

Write-Host "`n✅ OpenSSL đã được tìm thấy: $($openssl.Source)" -ForegroundColor Green

# Thông tin certificate
$country = "VN"
$state = "HCM"
$city = "Ho Chi Minh"
$organization = "Antique Store"
$commonName = "localhost"
$daysValid = 365

Write-Host "`nĐang tạo SSL certificate..." -ForegroundColor Yellow

# Kiểm tra xem đã có certificate chưa
$keyPath = Join-Path $certDir "localhost.key"
$crtPath = Join-Path $certDir "localhost.crt"

if ((Test-Path $keyPath) -and (Test-Path $crtPath)) {
    Write-Host "`n⚠️  Certificate đã tồn tại!" -ForegroundColor Yellow
    $recreate = Read-Host "Bạn có muốn tạo lại? (Y/N)"
    if ($recreate -ne 'Y' -and $recreate -ne 'y') {
        Write-Host "Giữ nguyên certificate hiện tại." -ForegroundColor Green
        exit 0
    }
}

# Tạo private key
Write-Host "`nBước 1: Tạo private key..." -ForegroundColor Yellow
& openssl genrsa -out $keyPath 2048

# Tạo self-signed certificate
Write-Host "Bước 2: Tạo self-signed certificate..." -ForegroundColor Yellow
& openssl req -new -x509 `
    -key $keyPath `
    -out $crtPath `
    -days $daysValid `
    -subj "/C=$country/ST=$state/L=$city/O=$organization/CN=$commonName" `
    -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1,IP:0.0.0.0"

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Lỗi khi tạo certificate!" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✅ Certificate đã được tạo thành công!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "📁 Location:" -ForegroundColor White
Write-Host "   Private Key: $keyPath" -ForegroundColor Cyan
Write-Host "   Certificate: $crtPath" -ForegroundColor Cyan
Write-Host "`n📅 Valid: $daysValid days" -ForegroundColor White

Write-Host "`n⚠️  QUAN TRỌNG:" -ForegroundColor Yellow
Write-Host "   Đây là self-signed certificate, trình duyệt sẽ cảnh báo" -ForegroundColor White
Write-Host "   'Not Secure' hoặc 'Certificate Invalid'" -ForegroundColor White

Write-Host "`n🔧 Để trust certificate:" -ForegroundColor Green
Write-Host "`n   Cách 1 - Import vào Trusted Root (cần quyền Administrator):" -ForegroundColor Yellow
Write-Host "   Import-Certificate -FilePath '$crtPath' -CertStoreLocation Cert:\LocalMachine\Root" -ForegroundColor White

Write-Host "`n   Cách 2 - Thông qua trình duyệt:" -ForegroundColor Yellow
Write-Host "   1. Mở Chrome/Edge, truy cập https://localhost:5000" -ForegroundColor White
Write-Host "   2. Click 'Advanced' → 'Proceed to localhost (unsafe)'" -ForegroundColor White

Write-Host "`n   Cách 3 - Enable Chrome flag:" -ForegroundColor Yellow
Write-Host "   chrome://flags/#allow-insecure-localhost → Enable" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Green

# Hỏi có muốn trust certificate không
$trust = Read-Host "`nBạn có muốn trust certificate này ngay bây giờ? (cần quyền Administrator) (Y/N)"
if ($trust -eq 'Y' -or $trust -eq 'y') {
    # Kiểm tra quyền Administrator
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    
    if ($isAdmin) {
        Import-Certificate -FilePath $crtPath -CertStoreLocation Cert:\LocalMachine\Root
        Write-Host "✅ Certificate đã được trust!" -ForegroundColor Green
    } else {
        Write-Host "❌ Cần quyền Administrator để trust certificate!" -ForegroundColor Red
        Write-Host "Chạy lại PowerShell với quyền Administrator và thực hiện lệnh:" -ForegroundColor Yellow
        Write-Host "Import-Certificate -FilePath '$crtPath' -CertStoreLocation Cert:\LocalMachine\Root" -ForegroundColor White
    }
}

Write-Host "`n✅ Setup hoàn tất!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Hiển thị thông tin certificate
Write-Host "`nThông tin Certificate:" -ForegroundColor Yellow
& openssl x509 -in $crtPath -noout -subject -issuer -dates

exit 0

