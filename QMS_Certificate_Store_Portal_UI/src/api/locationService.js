import apiClient from '../api/apiClient';

export const locationService = {
    // 🔍 Get all locations for the list
    getAll: async () => {
        const response = await apiClient.get('/master/Location/get-all');
        return response.data;
    },

    // 🔍 Get a single location by ID for editing
    getById: async (id) => {
        const response = await apiClient.get(`/master/Location/get-by-id/${id}`);
        return response.data;
    },

    // 💾 Save or Update a location
    save: async (data) => {
        const response = await apiClient.post('/master/Location/save', data);
        return response.data;
    },

    // 🗑️ Delete a location
    delete: async (id) => {
        const response = await apiClient.delete(`/master/Location/delete/${id}`);
        return response.data;
    }
};
