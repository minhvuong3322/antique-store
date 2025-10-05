import api from './api';

export const cartService = {
    // Lấy giỏ hàng
    getCart: async () => {
        return await api.get('/cart');
    },

    // Thêm vào giỏ hàng
    addToCart: async (product_id, quantity = 1) => {
        return await api.post('/cart', { product_id, quantity });
    },

    // Cập nhật số lượng
    updateCartItem: async (id, quantity) => {
        return await api.put(`/cart/${id}`, { quantity });
    },

    // Xóa khỏi giỏ hàng
    removeFromCart: async (id) => {
        return await api.delete(`/cart/${id}`);
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: async () => {
        return await api.delete('/cart');
    },
};



