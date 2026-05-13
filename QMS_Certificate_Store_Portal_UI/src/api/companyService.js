import apiClient from '../api/apiClient';

export const companyService = {
    // 🔍 Get all companies for the list
    getAll: async () => {
        const response = await apiClient.get('/master/Company/get-all');
        return response.data;
    },

    // 🔍 Get a single company by ID for editing
    getById: async (id) => {
        const response = await apiClient.get(`/master/Company/get-by-id/${id}`);
        return response.data;
    },

    // 💾 Save or Update a company
    save: async (data) => {
        const response = await apiClient.post('/master/Company/save', data);
        return response.data;
    },

    // 🗑️ Delete a company
    delete: async (id) => {
        const response = await apiClient.delete(`/master/Company/delete/${id}`);
        return response.data;
    }
};
