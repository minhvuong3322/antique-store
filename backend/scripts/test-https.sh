#!/bin/bash

# ==============================================================================
# HTTPS Configuration Test Script
# ==============================================================================
# Script này kiểm tra cấu hình HTTPS của backend
# ==============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}HTTPS Configuration Test${NC}"
echo -e "${GREEN}========================================${NC}"

# Default values
BACKEND_URL="${1:-http://localhost:5000}"
API_PREFIX="${2:-/api/v1}"
FULL_URL="${BACKEND_URL}${API_PREFIX}/health"

echo -e "\n${BLUE}Testing URL: ${YELLOW}${FULL_URL}${NC}"

# ============================================
# Test 1: Basic Connectivity
# ============================================
echo -e "\n${YELLOW}[1/7] Testing Basic Connectivity...${NC}"

if curl -s -o /dev/null -w "%{http_code}" --max-time 5 "${FULL_URL}" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server is reachable${NC}"
else
    echo -e "${RED}❌ Cannot reach server${NC}"
    echo -e "${YELLOW}   Make sure backend is running${NC}"
    exit 1
fi

# ============================================
# Test 2: HTTP Response
# ============================================
echo -e "\n${YELLOW}[2/7] Testing HTTP Response...${NC}"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${FULL_URL}")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ HTTP Status: ${HTTP_CODE}${NC}"
else
    echo -e "${RED}❌ HTTP Status: ${HTTP_CODE}${NC}"
fi

# ============================================
# Test 3: HTTPS Protocol Check
# ============================================
echo -e "\n${YELLOW}[3/7] Checking Protocol...${NC}"

if [[ $BACKEND_URL == https://* ]]; then
    echo -e "${GREEN}✅ Using HTTPS${NC}"
    
    # Test SSL Certificate
    echo -e "\n${YELLOW}[4/7] Testing SSL Certificate...${NC}"
    
    # Extract domain and port
    DOMAIN=$(echo "$BACKEND_URL" | sed -e 's|^https://||' -e 's|/.*||' -e 's|:.*||')
    PORT=$(echo "$BACKEND_URL" | sed -e 's|^https://[^:]*||' -e 's|/.*||' -e 's|:||')
    PORT=${PORT:-443}
    
    echo -e "${BLUE}   Domain: ${YELLOW}${DOMAIN}${NC}"
    echo -e "${BLUE}   Port: ${YELLOW}${PORT}${NC}"
    
    # Check certificate
    if openssl s_client -connect "${DOMAIN}:${PORT}" -servername "${DOMAIN}" < /dev/null 2>&1 | grep -q "Verify return code: 0"; then
        echo -e "${GREEN}✅ Valid SSL Certificate${NC}"
    else
        VERIFY_CODE=$(openssl s_client -connect "${DOMAIN}:${PORT}" -servername "${DOMAIN}" < /dev/null 2>&1 | grep "Verify return code" || echo "Unknown")
        echo -e "${YELLOW}⚠️  SSL Certificate Warning: ${VERIFY_CODE}${NC}"
        
        if [[ $DOMAIN == "localhost" ]] || [[ $DOMAIN == "127.0.0.1" ]]; then
            echo -e "${BLUE}   This is expected for self-signed certificates${NC}"
        fi
    fi
    
    # Certificate expiry
    echo -e "\n${YELLOW}[5/7] Checking Certificate Expiry...${NC}"
    EXPIRY=$(echo | openssl s_client -connect "${DOMAIN}:${PORT}" -servername "${DOMAIN}" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    
    if [ -n "$EXPIRY" ]; then
        echo -e "${BLUE}   Expires: ${YELLOW}${EXPIRY}${NC}"
        
        # Calculate days left
        if [[ "$OSTYPE" == "darwin"* ]]; then
            EXPIRY_EPOCH=$(date -j -f "%b %d %T %Y %Z" "$EXPIRY" +%s 2>/dev/null || echo "0")
        else
            EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || echo "0")
        fi
        
        NOW_EPOCH=$(date +%s)
        DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))
        
        if [ "$DAYS_LEFT" -gt 30 ]; then
            echo -e "${GREEN}✅ Certificate valid for ${DAYS_LEFT} days${NC}"
        elif [ "$DAYS_LEFT" -gt 7 ]; then
            echo -e "${YELLOW}⚠️  Certificate expires in ${DAYS_LEFT} days${NC}"
        else
            echo -e "${RED}❌ Certificate expires in ${DAYS_LEFT} days - RENEW NOW!${NC}"
        fi
    fi
    
    # SSL/TLS Version
    echo -e "\n${YELLOW}[6/7] Checking SSL/TLS Version...${NC}"
    TLS_VERSION=$(curl -s --tlsv1.2 --tls-max 1.3 -I "${FULL_URL}" 2>&1 | grep -i "SSL connection" || echo "Unknown")
    if [ "$TLS_VERSION" != "Unknown" ]; then
        echo -e "${GREEN}✅ ${TLS_VERSION}${NC}"
    else
        echo -e "${BLUE}   TLS version check skipped (curl may not support this)${NC}"
    fi
    
else
    echo -e "${YELLOW}⚠️  Using HTTP (not HTTPS)${NC}"
    echo -e "${BLUE}   SSL tests skipped${NC}"
fi

# ============================================
# Test 7: Security Headers
# ============================================
echo -e "\n${YELLOW}[7/7] Checking Security Headers...${NC}"

HEADERS=$(curl -s -I "${FULL_URL}")

# Check HSTS
if echo "$HEADERS" | grep -qi "Strict-Transport-Security"; then
    echo -e "${GREEN}✅ HSTS Header present${NC}"
else
    if [[ $BACKEND_URL == https://* ]]; then
        echo -e "${YELLOW}⚠️  HSTS Header missing${NC}"
    fi
fi

# Check X-Content-Type-Options
if echo "$HEADERS" | grep -qi "X-Content-Type-Options"; then
    echo -e "${GREEN}✅ X-Content-Type-Options present${NC}"
else
    echo -e "${YELLOW}⚠️  X-Content-Type-Options missing${NC}"
fi

# Check X-Frame-Options
if echo "$HEADERS" | grep -qi "X-Frame-Options"; then
    echo -e "${GREEN}✅ X-Frame-Options present${NC}"
else
    echo -e "${YELLOW}⚠️  X-Frame-Options missing${NC}"
fi

# ============================================
# Summary
# ============================================
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Test Summary${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${BLUE}URL Tested: ${YELLOW}${FULL_URL}${NC}"
echo -e "${BLUE}HTTP Status: ${YELLOW}${HTTP_CODE}${NC}"

if [[ $BACKEND_URL == https://* ]]; then
    echo -e "${BLUE}Protocol: ${GREEN}HTTPS ✅${NC}"
    
    echo -e "\n${YELLOW}Recommendations:${NC}"
    
    if [[ $DOMAIN == "localhost" ]] || [[ $DOMAIN == "127.0.0.1" ]]; then
        echo -e "• This is a development environment with self-signed certificate"
        echo -e "• Trust the certificate in your browser for testing"
        echo -e "• Use Let's Encrypt for production"
    else
        echo -e "• Ensure certificate auto-renewal is configured"
        echo -e "• Monitor certificate expiry"
        echo -e "• Keep security headers up to date"
    fi
else
    echo -e "${BLUE}Protocol: ${YELLOW}HTTP ⚠️${NC}"
    echo -e "\n${YELLOW}Recommendations:${NC}"
    echo -e "• Enable HTTPS for production"
    echo -e "• Set ENABLE_SSL=true in backend/.env"
    echo -e "• Configure SSL certificates"
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Test completed${NC}"
echo -e "${GREEN}========================================${NC}"

# Additional tests (optional)
echo -e "\n${BLUE}For more detailed SSL testing:${NC}"
echo -e "• SSL Labs: ${YELLOW}https://www.ssllabs.com/ssltest/${NC}"
echo -e "• SecurityHeaders: ${YELLOW}https://securityheaders.com/${NC}"
echo -e "• testssl.sh: ${YELLOW}https://testssl.sh/${NC}"

exit 0

