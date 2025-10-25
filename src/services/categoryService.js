import api from './api';

export const categoryService = {
    // Lấy danh sách danh mục
    getAll: async () => {
        return await api.get('/categories');
    },

    // Lấy danh mục theo ID
    getCategoryById: async (id, params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await api.get(`/categories/${id}?${queryString}`);
    },

    // Tạo danh mục (Admin)
    createCategory: async (categoryData) => {
        return await api.post('/categories', categoryData);
    },

    // Cập nhật danh mục (Admin)
    updateCategory: async (id, categoryData) => {
        return await api.put(`/categories/${id}`, categoryData);
    },

    // Xóa danh mục (Admin)
    deleteCategory: async (id) => {
        return await api.delete(`/categories/${id}`);
    },
};



