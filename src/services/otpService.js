/**
 * OTP Service
 * Handles OTP-related API calls
 */
import api from './api';

/**
 * Send OTP to email
 */
export const sendOTP = async (email, type = 'register') => {
    const response = await api.post('/otp/send', { email, type });
    return response.data;
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (email, otp_code, type = 'register') => {
    const response = await api.post('/otp/verify', { email, otp_code, type });
    return response.data;
};

/**
 * Reset password with OTP
 */
export const resetPassword = async (email, otp_code, new_password) => {
    const response = await api.post('/otp/reset-password', {
        email,
        otp_code,
        new_password,
    });
    return response.data;
};

/**
 * Resend OTP code
 */
export const resendOTP = async (email, type = 'register') => {
    const response = await api.post('/otp/resend', { email, type });
    return response.data;
};

export default {
    sendOTP,
    verifyOTP,
    resetPassword,
    resendOTP,
};

