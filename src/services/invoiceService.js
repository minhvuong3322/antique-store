import api from './api';

export const invoiceService = {
    // Get all invoices
    getAllInvoices: (params = {}) => {
        return api.get('/invoices', { params });
    },

    // Get invoice by ID
    getInvoiceById: (id) => {
        return api.get(`/invoices/${id}`);
    },

    // Create invoice (generate from order)
    createInvoice: (data) => {
        return api.post('/invoices', data);
    },

    // Generate invoice from order
    generateInvoice: (orderId, notes = '') => {
        return api.post('/invoices/generate', { order_id: orderId, notes });
    },

    // Update invoice
    updateInvoice: (id, data) => {
        return api.put(`/invoices/${id}`, data);
    },

    // Update invoice status
    updateInvoiceStatus: (id, status) => {
        return api.put(`/invoices/${id}/status`, { status });
    },

    // Send invoice via email
    sendInvoiceEmail: (id) => {
        return api.post(`/invoices/${id}/send-email`);
    },

    // Download invoice PDF
    downloadInvoicePDF: (id) => {
        return api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
    },

    // Get invoices by order
    getInvoiceByOrder: (orderId) => {
        return api.get(`/invoices/order/${orderId}`);
    }
};
