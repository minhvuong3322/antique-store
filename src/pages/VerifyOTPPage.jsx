/**
 * Verify OTP Page
 * User enters 6-digit OTP code
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../services/otpService';
import { getErrorMessage } from '../utils/errorHandler';

const VerifyOTPPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, type } = location.state || {};

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = [
        useRef(null), useRef(null), useRef(null),
        useRef(null), useRef(null), useRef(null)
    ];

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
            return;
        }

        // Countdown timer for resend
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer, email, navigate]);

    const handleChange = (index, value) => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only take last character
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs[index + 1].current?.focus();
        }

        // Auto-submit when all 6 digits are entered
        if (index === 5 && value) {
            const fullOtp = newOtp.join('');
            if (fullOtp.length === 6) {
                handleVerify(fullOtp);
            }
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = pastedData.split('');
        while (newOtp.length < 6) newOtp.push('');
        setOtp(newOtp);

        // Auto-verify if 6 digits pasted
        if (pastedData.length === 6) {
            handleVerify(pastedData);
        }
    };

    const handleVerify = async (otpCode = otp.join('')) => {
        if (otpCode.length !== 6) {
            setError('Vui lòng nhập đầy đủ 6 số');
            return;
        }

        setError('');
        setLoading(true);

        try {
            await verifyOTP(email, otpCode, type);

            // Navigate to reset password page
            navigate('/reset-password', {
                state: { email, otp_code: otpCode }
            });
        } catch (err) {
            setError(getErrorMessage(err));
            setOtp(['', '', '', '', '', '']);
            inputRefs[0].current?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setLoading(true);

        try {
            await resendOTP(email, type);
            setResendTimer(60);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            inputRefs[0].current?.focus();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Nhập Mã OTP
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Mã xác thực đã được gửi đến
                        </p>
                        <p className="text-purple-600 dark:text-purple-400 font-medium mt-1">
                            {email}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-700 dark:text-red-300 text-center">{error}</p>
                        </div>
                    )}

                    {/* OTP Input */}
                    <div className="mb-8">
                        <div className="flex justify-center gap-3" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    disabled={loading}
                                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:opacity-50"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Verify Button */}
                    <button
                        onClick={() => handleVerify()}
                        disabled={loading || otp.join('').length !== 6}
                        className="w-full py-3 px-4 rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                    >
                        {loading ? 'Đang xác thực...' : 'Xác Thực'}
                    </button>

                    {/* Resend OTP */}
                    <div className="mt-6 text-center">
                        {canResend ? (
                            <button
                                onClick={handleResend}
                                disabled={loading}
                                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm transition"
                            >
                                Gửi lại mã OTP
                            </button>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Gửi lại sau {resendTimer} giây
                            </p>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                        💡 Mã OTP có hiệu lực trong 5 phút
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTPPage;

