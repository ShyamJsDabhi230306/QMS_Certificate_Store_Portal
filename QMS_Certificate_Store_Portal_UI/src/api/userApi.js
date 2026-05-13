import apiClient from './apiClient';

export const userApi = {
    // 🔍 Get all users
    getAll: async () => {
        const response = await apiClient.get('/master/user/get-all');
        return response.data;
    },

    // 🔍 Get a single user by ID (for Editing)
    getById: async (id) => {
        const response = await apiClient.get(`/master/user/get-by-id/${id}`);
        return response.data;
    },

    // 💾 Save user (Works for both Insert and Update)
    save: async (userData) => {
        const response = await apiClient.post('/master/user/save', userData);
        return response.data;
    },

    // 🗑️ Delete user
    delete: async (id) => {
        const response = await apiClient.delete(`/master/user/delete/${id}`);
        return response.data;
    }
};
