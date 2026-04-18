import api from './api';

export const productService = {
    // Lấy danh sách sản phẩm
    getProducts: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await api.get(`/products?${queryString}`);
    },

    // Lấy sản phẩm nổi bật
    getFeaturedProducts: async (limit = 8) => {
        return await api.get(`/products/featured?limit=${limit}`);
    },

    // Lấy chi tiết sản phẩm
    getProductById: async (id) => {
        return await api.get(`/products/${id}`);
    },

    // Tạo sản phẩm (Admin)
    createProduct: async (productData) => {
        return await api.post('/products', productData);
    },

    // Cập nhật sản phẩm (Admin)
    updateProduct: async (id, productData) => {
        return await api.put(`/products/${id}`, productData);
    },

    // Xóa sản phẩm (Admin)
    deleteProduct: async (id) => {
        return await api.delete(`/products/${id}`);
    },
};



