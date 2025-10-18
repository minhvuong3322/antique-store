import api from './api';

export const warrantyService = {
    // Get all warranties with filters
    getAllWarranties: (params = {}) => {
        return api.get('/warranties', { params });
    },

    // Get warranty by ID
    getWarrantyById: (id) => {
        return api.get(`/warranties/${id}`);
    },

    // Get warranty by code (for customer lookup)
    getWarrantyByCode: (code) => {
        return api.get(`/warranties/lookup/${code}`);
    },

    // Create new warranty
    createWarranty: (data) => {
        return api.post('/warranties', data);
    },

    // Update warranty
    updateWarranty: (id, data) => {
        return api.put(`/warranties/${id}`, data);
    },

    // Update warranty status
    updateWarrantyStatus: (id, status, notes = '') => {
        return api.put(`/warranties/${id}/status`, { status, admin_notes: notes });
    },

    // Delete warranty
    deleteWarranty: (id) => {
        return api.delete(`/warranties/${id}`);
    },

    // Get warranties by order
    getWarrantiesByOrder: (orderId) => {
        return api.get(`/warranties/order/${orderId}`);
    }
};
