-- =====================================================
-- TABLE: OTPS (One-Time Password)
-- Purpose: Store OTP codes for email verification, password reset
-- =====================================================

CREATE TABLE
IF NOT EXISTS otps
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR
(255) NOT NULL,
    otp_code VARCHAR
(6) NOT NULL,
    type ENUM
('register', 'reset_password', 'verify_email') NOT NULL DEFAULT 'register',
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_otps_email (email),
    INDEX idx_otps_code (otp_code),
    INDEX idx_otps_expires (expires_at),
    INDEX idx_otps_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment
ALTER TABLE otps COMMENT = 'Store OTP codes for authentication and verification';

