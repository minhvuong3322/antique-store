import axios from 'axios';

// Base URL của backend API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Tạo axios instance
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Thêm token vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Xử lý lỗi chung
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn hoặc không hợp lệ
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Chỉ redirect nếu không phải trang login/register
            if (!window.location.pathname.includes('/login') &&
                !window.location.pathname.includes('/register')) {
                window.location.href = '/login';
            }
        }
        
        // Đảm bảo luôn reject với error object có message
        const errorData = error.response?.data || {};
        const errorMessage = errorData.message || error.message || 'Đã xảy ra lỗi không xác định';
        
        // Tạo error object với message đầy đủ
        const rejectedError = {
            ...errorData,
            message: errorMessage,
            status: error.response?.status,
        };
        
        return Promise.reject(rejectedError);
    }
);

export default api;



