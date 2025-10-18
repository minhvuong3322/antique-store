import api from './api';

export const warehouseService = {
    // Get all warehouse logs
    getAllLogs: (params = {}) => {
        return api.get('/warehouse/logs', { params });
    },

    // Get logs by product
    getLogsByProduct: (productId) => {
        return api.get(`/warehouse/logs/product/${productId}`);
    },

    // Get current stock for a product
    getCurrentStock: (productId) => {
        return api.get(`/warehouse/stock/${productId}`);
    },

    // Import products (nhập kho)
    importProducts: (data) => {
        return api.post('/warehouse/import', data);
    },

    // Export products (xuất kho)
    exportProducts: (data) => {
        return api.post('/warehouse/export', data);
    },

    // Adjust stock (điều chỉnh tồn kho)
    adjustStock: (data) => {
        return api.post('/warehouse/adjust', data);
    },

    // Log warehouse movement
    logWarehouseMovement: (data) => {
        return api.post('/warehouse/log', data);
    },

    // Update stock quantity
    updateStockQuantity: (productId, quantity, notes = '') => {
        return api.put(`/warehouse/stock/${productId}`, { quantity, notes });
    },

    // Get low stock products
    getLowStockProducts: (threshold = 10) => {
        return api.get('/warehouse/low-stock', { params: { threshold } });
    },

    // Get warehouse statistics
    getWarehouseStatistics: () => {
        return api.get('/warehouse/statistics');
    }
};
