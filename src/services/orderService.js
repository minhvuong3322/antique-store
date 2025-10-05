import api from './api';

export const orderService = {
    // Tạo đơn hàng
    createOrder: async (orderData) => {
        return await api.post('/orders', orderData);
    },

    // Lấy lịch sử đơn hàng
    getOrders: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await api.get(`/orders?${queryString}`);
    },

    // Lấy chi tiết đơn hàng
    getOrderById: async (id) => {
        return await api.get(`/orders/${id}`);
    },

    // Hủy đơn hàng
    cancelOrder: async (id) => {
        return await api.put(`/orders/${id}/cancel`);
    },

    // Admin: Lấy tất cả đơn hàng
    getAllOrders: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await api.get(`/orders/admin/all?${queryString}`);
    },

    // Admin: Cập nhật trạng thái
    updateOrderStatus: async (id, status) => {
        return await api.put(`/orders/${id}/status`, { status });
    },
};



