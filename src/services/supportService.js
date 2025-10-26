import api from './api';

/**
 * Support Service
 */
const supportService = {
    // Create support message
    createMessage: async (messageData) => {
        const response = await api.post('/support', messageData);
        return response.data;
    },

    // Get user's support messages
    getMyMessages: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/support/my-messages?${queryString}`);
        return response.data;
    },

    // Get message by ID
    getMessageById: async (id) => {
        const response = await api.get(`/support/${id}`);
        return response.data;
    }
};

export default supportService;

