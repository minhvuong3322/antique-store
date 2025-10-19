#!/bin/bash

# ==============================================================================
# Let's Encrypt SSL Certificate Setup Script
# ==============================================================================
# Script này giúp tự động setup SSL certificate cho production
# ==============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Let's Encrypt SSL Setup${NC}"
echo -e "${GREEN}========================================${NC}"

# Kiểm tra quyền root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Script này cần quyền root. Chạy với sudo.${NC}"
    exit 1
fi

# Nhập domain
echo -e "\n${YELLOW}Nhập domain của bạn (ví dụ: api.antiquestore.vn):${NC}"
read -r DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Domain không được để trống!${NC}"
    exit 1
fi

# Nhập email
echo -e "\n${YELLOW}Nhập email của bạn (cho Let's Encrypt notifications):${NC}"
read -r EMAIL

if [ -z "$EMAIL" ]; then
    echo -e "${RED}❌ Email không được để trống!${NC}"
    exit 1
fi

echo -e "\n${BLUE}Domain: ${YELLOW}$DOMAIN${NC}"
echo -e "${BLUE}Email: ${YELLOW}$EMAIL${NC}"
echo -e "\n${YELLOW}Bạn có chắc chắn? (y/n):${NC}"
read -r CONFIRM

if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo -e "${RED}Đã hủy.${NC}"
    exit 0
fi

# Kiểm tra Certbot
echo -e "\n${YELLOW}Kiểm tra Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Certbot chưa được cài đặt. Đang cài đặt...${NC}"
    
    # Detect OS
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        
        if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
            apt update
            apt install -y certbot python3-certbot-nginx
        elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
            yum install -y certbot python3-certbot-nginx
        else
            echo -e "${RED}❌ OS không được hỗ trợ. Vui lòng cài Certbot thủ công.${NC}"
            exit 1
        fi
    fi
fi

echo -e "${GREEN}✅ Certbot đã sẵn sàng${NC}"

# Kiểm tra DNS
echo -e "\n${YELLOW}Kiểm tra DNS record...${NC}"
DOMAIN_IP=$(dig +short "$DOMAIN" | tail -n1)
SERVER_IP=$(curl -s ifconfig.me)

echo -e "${BLUE}Domain IP: ${YELLOW}$DOMAIN_IP${NC}"
echo -e "${BLUE}Server IP: ${YELLOW}$SERVER_IP${NC}"

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    echo -e "${RED}⚠️  WARNING: Domain IP không khớp với Server IP!${NC}"
    echo -e "${YELLOW}Đảm bảo DNS A record của $DOMAIN trỏ về $SERVER_IP${NC}"
    echo -e "\n${YELLOW}Bạn có muốn tiếp tục? (y/n):${NC}"
    read -r CONTINUE
    if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# Kiểm tra port 80/443
echo -e "\n${YELLOW}Kiểm tra port 80 và 443...${NC}"
if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 80 đang được sử dụng. Dừng service?${NC}"
    SERVICE=$(lsof -Pi :80 -sTCP:LISTEN | grep LISTEN | awk '{print $1}' | head -1)
    echo -e "${BLUE}Service đang chạy: ${YELLOW}$SERVICE${NC}"
    echo -e "${YELLOW}Dừng $SERVICE? (y/n):${NC}"
    read -r STOP_SERVICE
    if [[ $STOP_SERVICE =~ ^[Yy]$ ]]; then
        if [[ "$SERVICE" == "nginx" ]]; then
            systemctl stop nginx
        elif [[ "$SERVICE" == "apache2" ]]; then
            systemctl stop apache2
        else
            echo -e "${RED}Vui lòng dừng service thủ công: $SERVICE${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Certbot cần port 80 để xác thực. Đã hủy.${NC}"
        exit 1
    fi
fi

# Tạo certificate
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Đang tạo SSL certificate...${NC}"
echo -e "${GREEN}========================================${NC}"

certbot certonly --standalone \
    -d "$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --preferred-challenges http

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}✅ SSL Certificate đã được tạo thành công!${NC}"
    echo -e "${GREEN}========================================${NC}"
    
    echo -e "\n${BLUE}📁 Certificate Location:${NC}"
    echo -e "   Private Key: ${YELLOW}/etc/letsencrypt/live/$DOMAIN/privkey.pem${NC}"
    echo -e "   Certificate: ${YELLOW}/etc/letsencrypt/live/$DOMAIN/fullchain.pem${NC}"
    echo -e "   Chain: ${YELLOW}/etc/letsencrypt/live/$DOMAIN/chain.pem${NC}"
    
    # Cập nhật .env
    echo -e "\n${YELLOW}Cập nhật backend/.env:${NC}"
    echo -e "${BLUE}ENABLE_SSL=true${NC}"
    echo -e "${BLUE}SSL_KEY_PATH=/etc/letsencrypt/live/$DOMAIN/privkey.pem${NC}"
    echo -e "${BLUE}SSL_CERT_PATH=/etc/letsencrypt/live/$DOMAIN/fullchain.pem${NC}"
    
    # Setup auto-renewal
    echo -e "\n${YELLOW}Setup auto-renewal...${NC}"
    
    # Test renewal
    certbot renew --dry-run
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Auto-renewal test thành công${NC}"
        
        # Enable timer
        if systemctl list-unit-files | grep -q certbot.timer; then
            systemctl enable certbot.timer
            systemctl start certbot.timer
            echo -e "${GREEN}✅ Certbot timer đã được kích hoạt${NC}"
        else
            # Setup cron job
            echo -e "${YELLOW}Setup cron job cho auto-renewal...${NC}"
            CRON_CMD="0 0,12 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'"
            (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
            echo -e "${GREEN}✅ Cron job đã được tạo${NC}"
        fi
    fi
    
    # Start lại service
    if systemctl is-active --quiet nginx; then
        echo -e "\n${YELLOW}Khởi động lại Nginx...${NC}"
        systemctl start nginx
        echo -e "${GREEN}✅ Nginx đã được khởi động${NC}"
    fi
    
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}🎉 Setup hoàn tất!${NC}"
    echo -e "${GREEN}========================================${NC}"
    
    echo -e "\n${YELLOW}Next Steps:${NC}"
    echo -e "1. Cập nhật backend/.env với SSL paths ở trên"
    echo -e "2. Cập nhật nginx.conf với domain: $DOMAIN"
    echo -e "3. Restart services"
    echo -e "4. Test: ${BLUE}curl -I https://$DOMAIN${NC}"
    
else
    echo -e "\n${RED}❌ Lỗi khi tạo certificate!${NC}"
    echo -e "${YELLOW}Kiểm tra:${NC}"
    echo -e "1. DNS record đã trỏ đúng chưa?"
    echo -e "2. Port 80 có mở không?"
    echo -e "3. Firewall có block không?"
    exit 1
fi

exit 0

