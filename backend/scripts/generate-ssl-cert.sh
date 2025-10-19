#!/bin/bash

# ==============================================================================
# SSL Certificate Generator for Development
# ==============================================================================
# Tạo self-signed SSL certificate cho môi trường development
# Chứng chỉ này KHÔNG được tin tưởng mặc định bởi trình duyệt
# và chỉ nên sử dụng cho development/testing
# ==============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SSL Certificate Generator${NC}"
echo -e "${GREEN}========================================${NC}"

# Tạo thư mục certs nếu chưa có
CERT_DIR="../certs"
mkdir -p "$CERT_DIR"

# Thông tin certificate
COUNTRY="VN"
STATE="HCM"
CITY="Ho Chi Minh"
ORGANIZATION="Antique Store"
COMMON_NAME="localhost"
DAYS_VALID=365

echo -e "\n${YELLOW}Đang tạo SSL certificate...${NC}"

# Kiểm tra xem đã có certificate chưa
if [ -f "$CERT_DIR/localhost.key" ] && [ -f "$CERT_DIR/localhost.crt" ]; then
    echo -e "${YELLOW}Certificate đã tồn tại!${NC}"
    read -p "Bạn có muốn tạo lại? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}Giữ nguyên certificate hiện tại.${NC}"
        exit 0
    fi
fi

# Tạo private key (2048-bit RSA)
echo -e "${YELLOW}Bước 1: Tạo private key...${NC}"
openssl genrsa -out "$CERT_DIR/localhost.key" 2048

# Tạo certificate signing request (CSR) và self-signed certificate
echo -e "${YELLOW}Bước 2: Tạo self-signed certificate...${NC}"
openssl req -new -x509 \
    -key "$CERT_DIR/localhost.key" \
    -out "$CERT_DIR/localhost.crt" \
    -days $DAYS_VALID \
    -subj "/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORGANIZATION/CN=$COMMON_NAME" \
    -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1,IP:0.0.0.0"

# Set permissions
chmod 600 "$CERT_DIR/localhost.key"
chmod 644 "$CERT_DIR/localhost.crt"

echo -e "\n${GREEN}✅ Certificate đã được tạo thành công!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "📁 Location:"
echo -e "   Private Key: ${YELLOW}$CERT_DIR/localhost.key${NC}"
echo -e "   Certificate: ${YELLOW}$CERT_DIR/localhost.crt${NC}"
echo -e "\n📅 Valid: ${YELLOW}$DAYS_VALID days${NC}"
echo -e "\n${YELLOW}⚠️  QUAN TRỌNG:${NC}"
echo -e "   Đây là self-signed certificate, trình duyệt sẽ cảnh báo"
echo -e "   'Not Secure' hoặc 'Certificate Invalid'"
echo -e "\n${GREEN}🔧 Để trust certificate:${NC}"
echo -e "\n   ${YELLOW}Windows:${NC}"
echo -e "   1. Mở Chrome/Edge, truy cập https://localhost:5000"
echo -e "   2. Click 'Advanced' → 'Proceed to localhost (unsafe)'"
echo -e "   Hoặc:"
echo -e "   PowerShell (as Admin):"
echo -e "   Import-Certificate -FilePath '$CERT_DIR/localhost.crt' -CertStoreLocation Cert:\\LocalMachine\\Root"
echo -e "\n   ${YELLOW}Mac:${NC}"
echo -e "   sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain $CERT_DIR/localhost.crt"
echo -e "\n   ${YELLOW}Linux (Ubuntu/Debian):${NC}"
echo -e "   sudo cp $CERT_DIR/localhost.crt /usr/local/share/ca-certificates/"
echo -e "   sudo update-ca-certificates"
echo -e "\n   ${YELLOW}Chrome Flag:${NC}"
echo -e "   chrome://flags/#allow-insecure-localhost → Enable"
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup hoàn tất!${NC}"
echo -e "${GREEN}========================================${NC}"

# Hiển thị thông tin certificate
echo -e "\n${YELLOW}Thông tin Certificate:${NC}"
openssl x509 -in "$CERT_DIR/localhost.crt" -noout -text | grep -E "(Subject:|Issuer:|Not Before|Not After|DNS:)"

exit 0

