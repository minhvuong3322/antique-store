# 🛠️ Backend Scripts

Tập hợp các scripts tiện ích cho backend Antique Store.

---

## 📋 Danh Sách Scripts

### 🔐 SSL/HTTPS Scripts

#### `generate-ssl-cert.sh` (Linux/Mac)
Tạo self-signed SSL certificate cho development.

**Usage:**
```bash
cd backend/scripts
chmod +x generate-ssl-cert.sh
./generate-ssl-cert.sh
```

**Output:**
- `backend/certs/localhost.key` - Private key (2048-bit RSA)
- `backend/certs/localhost.crt` - Certificate (valid 365 days)

---

#### `generate-ssl-cert.ps1` (Windows)
Tạo self-signed SSL certificate cho development trên Windows.

**Usage:**
```powershell
cd backend/scripts
./generate-ssl-cert.ps1
```

**Features:**
- Auto-detect OpenSSL
- Fallback to PowerShell native method
- Optional auto-trust certificate

---

#### `setup-letsencrypt.sh` (Production)
Tự động setup Let's Encrypt SSL certificate cho production.

**Requirements:**
- Domain name
- Public server with IP
- Root/sudo access
- Ports 80, 443 open

**Usage:**
```bash
cd backend/scripts
chmod +x setup-letsencrypt.sh
sudo ./setup-letsencrypt.sh
```

**What it does:**
1. Installs Certbot (if not installed)
2. Validates DNS records
3. Obtains SSL certificate
4. Configures auto-renewal
5. Sets up systemd timer or cron job

---

#### `test-https.sh` (Testing)
Kiểm tra HTTPS configuration.

**Usage:**
```bash
cd backend/scripts
chmod +x test-https.sh

# Test local
./test-https.sh https://localhost:5000

# Test production
./test-https.sh https://api.yourdomain.com
```

**Tests:**
1. Basic connectivity
2. HTTP response codes
3. SSL certificate validity
4. Certificate expiry date
5. TLS version
6. Security headers
7. Overall security posture

---

### 🗄️ Database Scripts

#### `check-migration.js`
Kiểm tra database migration status.

**Usage:**
```bash
cd backend
node scripts/check-migration.js
```

---

#### `create-admin.js`
Tạo admin user.

**Usage:**
```bash
cd backend
node scripts/create-admin.js
```

---

#### `sync-database.js`
Đồng bộ database schema với models.

**Usage:**
```bash
cd backend
node scripts/sync-database.js
```

---

#### `seed-sample-data.js`
Import dữ liệu mẫu vào database.

**Usage:**
```bash
cd backend
node scripts/seed-sample-data.js
```

---

#### `quick-seed.js`
Seed dữ liệu nhanh (tối thiểu).

**Usage:**
```bash
cd backend
node scripts/quick-seed.js
```

---

#### `fix-social-auth-column.js`
Fix social authentication columns.

**Usage:**
```bash
cd backend
node scripts/fix-social-auth-column.js
```

---

## 🔧 Workflow Examples

### Development Setup

```bash
# 1. Generate SSL certificates
cd backend/scripts
./generate-ssl-cert.sh

# 2. Setup database
cd ..
node scripts/sync-database.js
node scripts/seed-sample-data.js

# 3. Create admin user
node scripts/create-admin.js

# 4. Test HTTPS
cd scripts
./test-https.sh https://localhost:5000
```

### Production Deployment

```bash
# 1. Setup Let's Encrypt
sudo ./setup-letsencrypt.sh

# 2. Test SSL configuration
./test-https.sh https://api.yourdomain.com

# 3. Setup database
cd ..
node scripts/sync-database.js

# 4. Create admin
node scripts/create-admin.js
```

---

## 📝 Notes

### SSL Certificates

**Development:**
- Self-signed certificates chỉ cho development
- Trình duyệt sẽ warning "Not Secure"
- Cần trust certificate manually hoặc enable Chrome flag

**Production:**
- Dùng Let's Encrypt (free, auto-renewal)
- Hoặc Cloudflare SSL
- Hoặc commercial certificate

### File Permissions

SSL private keys nên có permissions 600:
```bash
chmod 600 backend/certs/*.key
chmod 644 backend/certs/*.crt
```

Production certificates:
```bash
sudo chmod -R 755 /etc/letsencrypt/live
sudo chmod 600 /etc/letsencrypt/live/*/privkey.pem
```

### Security

⚠️ **IMPORTANT:**
- NEVER commit SSL private keys to git
- Add `certs/` to `.gitignore`
- Rotate certificates regularly
- Monitor expiry dates

---

## 🆘 Troubleshooting

### "Permission Denied"

```bash
# Linux/Mac
chmod +x script-name.sh

# Windows
# Right-click → Properties → Unblock
```

### "OpenSSL not found" (Windows)

**Option 1:** Install OpenSSL
```powershell
# Via Chocolatey
choco install openssl

# Via Scoop
scoop install openssl
```

**Option 2:** Use PowerShell native method
Script sẽ tự động prompt để dùng PowerShell native.

### "Port 80 already in use" (Let's Encrypt)

```bash
# Stop the service
sudo systemctl stop nginx
# Or
sudo systemctl stop apache2

# Then run script
sudo ./setup-letsencrypt.sh
```

### SSL Test Fails

```bash
# Check if backend is running
curl http://localhost:5000/api/v1/health

# Check SSL certificate
openssl s_client -connect localhost:5000 -servername localhost

# Check logs
cd backend
npm run dev
```

---

## 📚 References

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [OpenSSL Documentation](https://www.openssl.org/docs/)
- [Nginx SSL Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)

---

**Last Updated:** 2025-10-19  
**Maintainer:** DevOps Team

