import api from './api';

export const supplierService = {
    // Get all suppliers
    getAllSuppliers: (params = {}) => {
        return api.get('/suppliers', { params });
    },

    // Get active suppliers only
    getActiveSuppliers: () => {
        return api.get('/suppliers/active');
    },

    // Get supplier by ID
    getSupplierById: (id) => {
        return api.get(`/suppliers/${id}`);
    },

    // Create new supplier
    createSupplier: (data) => {
        return api.post('/suppliers', data);
    },

    // Update supplier
    updateSupplier: (id, data) => {
        return api.put(`/suppliers/${id}`, data);
    },

    // Delete supplier
    deleteSupplier: (id) => {
        return api.delete(`/suppliers/${id}`);
    },

    // Get products by supplier
    getSupplierProducts: (id) => {
        return api.get(`/suppliers/${id}/products`);
    },

    // Add product to supplier
    addProductToSupplier: (supplierId, productId, supplyPrice, isPrimary = false) => {
        return api.post(`/suppliers/${supplierId}/products`, {
            product_id: productId,
            supply_price: supplyPrice,
            is_primary: isPrimary
        });
    },

    // Remove product from supplier
    removeProductFromSupplier: (supplierId, productId) => {
        return api.delete(`/suppliers/${supplierId}/products/${productId}`);
    }
};
