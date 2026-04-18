import api from './api';

export const authService = {
    // Đăng ký
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    },

    // Đăng nhập
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    },

    // Đăng xuất
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Không redirect tự động ở đây, để component tự xử lý
    },

    // Lấy thông tin user hiện tại
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Kiểm tra đã đăng nhập
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Lấy profile
    getProfile: async () => {
        return await api.get('/auth/profile');
    },

    // Cập nhật profile
    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData);
        if (response.success) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    },

    // Đổi mật khẩu
    changePassword: async (passwords) => {
        return await api.put('/auth/change-password', passwords);
    },

    // Đăng nhập với Google và Facebook
    loginWithSocial: async (idToken) => {
        // Endpoint này sẽ gọi đến hàm handleSocialLogin ở backend
        const response = await api.post('/auth/social-login', { idToken }); 
        
        if (response.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    },
};



