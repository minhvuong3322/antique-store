import api from './api';

export const paymentService = {
    // Lấy thông tin payment theo order ID
    getPaymentByOrderId: async (orderId) => {
        return await api.get(`/payments/order/${orderId}`);
    },

    // Check payment status theo order ID hoặc order number
    checkPaymentStatus: async (identifier) => {
        return await api.get(`/payments/status/${identifier}`);
    },

    // Xử lý thanh toán
    processPayment: async (orderId, paymentMethod = 'COD') => {
        return await api.post('/payments/process', {
            order_id: orderId,
            payment_method: paymentMethod
        });
    },

    // Tạo link thanh toán VNPay
    createVNPayPayment: async (orderId) => {
        return await api.post('/payments/vnpay/create', {
            order_id: orderId
        });
    },

    // Tạo link thanh toán Momo
    createMomoPayment: async (orderId) => {
        return await api.post('/payments/momo/create', {
            order_id: orderId
        });
    },

    // Polling để check payment status (sử dụng khi chờ thanh toán)
    pollPaymentStatus: async (identifier, options = {}) => {
        const {
            maxAttempts = 60, // 60 lần
            interval = 2000, // Mỗi 2 giây
            onUpdate = null, // Callback khi có update
            onComplete = null, // Callback khi completed
            onError = null // Callback khi failed
        } = options;

        let attempts = 0;

        const poll = async () => {
            try {
                attempts++;
                const response = await paymentService.checkPaymentStatus(identifier);
                const paymentStatus = response.data?.data?.payment?.payment_status;
                
                if (onUpdate) {
                    onUpdate(paymentStatus, response.data.data);
                }

                if (paymentStatus === 'completed') {
                    if (onComplete) {
                        onComplete(response.data.data);
                    }
                    return { success: true, data: response.data.data };
                }

                if (paymentStatus === 'failed') {
                    if (onError) {
                        onError(response.data.data);
                    }
                    return { success: false, error: 'Payment failed', data: response.data.data };
                }

                // Nếu chưa completed và chưa vượt quá max attempts
                if (attempts < maxAttempts) {
                    setTimeout(poll, interval);
                } else {
                    // Timeout
                    if (onError) {
                        onError({ error: 'Timeout waiting for payment' });
                    }
                    return { success: false, error: 'Timeout', attempts };
                }
            } catch (error) {
                console.error('Poll payment status error:', error);
                if (onError) {
                    onError(error);
                }
                return { success: false, error };
            }
        };

        return poll();
    }
};

