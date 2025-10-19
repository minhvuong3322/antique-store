import api from './api';

export const adminService = {
    // Dashboard Overview
    getDashboardOverview: () => {
        return api.get('/admin/dashboard/overview');
    },

    // Recent Activities
    getRecentActivities: (limit = 20) => {
        return api.get('/admin/dashboard/recent-activities', { params: { limit } });
    },

    // Comprehensive analytics
    getComprehensiveAnalytics: () => {
        return api.get('/admin/dashboard/analytics');
    },

    // Revenue statistics
    getRevenueStatistics: (period = 'month') => {
        return api.get('/admin/dashboard/revenue', { params: { period } });
    },

    // Top products
    getTopProducts: (limit = 10) => {
        return api.get('/admin/dashboard/top-products', { params: { limit } });
    },

    // Orders by status
    getOrdersByStatus: () => {
        return api.get('/admin/dashboard/orders-by-status');
    },

    // Category statistics
    getCategoryStatistics: () => {
        return api.get('/admin/dashboard/categories-stats');
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

    deleteUser: (id) => {
        return api.delete(`/admin/users/${id}`);
    }
};
