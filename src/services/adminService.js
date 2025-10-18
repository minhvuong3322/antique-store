import api from './api';

export const adminService = {
    // Dashboard Statistics
    getDashboardStats: () => {
        return api.get('/admin/dashboard-stats');
    },

    // Comprehensive analytics
    getComprehensiveAnalytics: () => {
        return api.get('/admin/analytics');
    },

    // Revenue statistics
    getRevenueStatistics: (period = 'month') => {
        return api.get('/admin/revenue', { params: { period } });
    },

    // Top products
    getTopProducts: (limit = 10) => {
        return api.get('/admin/top-products', { params: { limit } });
    },

    // Orders by status
    getOrdersByStatus: () => {
        return api.get('/admin/orders-by-status');
    },

    // User Management
    getAllUsers: (params = {}) => {
        return api.get('/admin/users', { params });
    },

    getUserById: (id) => {
        return api.get(`/admin/users/${id}`);
    },

    updateUser: (id, data) => {
        return api.put(`/admin/users/${id}`, data);
    },

    updateUserRole: (id, role) => {
        return api.put(`/admin/users/${id}/role`, { role });
    },

    deactivateUser: (id) => {
        return api.put(`/admin/users/${id}/deactivate`);
    },

    deleteUser: (id) => {
        return api.delete(`/admin/users/${id}`);
    }
};
