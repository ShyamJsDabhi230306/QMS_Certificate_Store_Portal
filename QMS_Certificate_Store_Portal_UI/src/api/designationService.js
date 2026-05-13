import apiClient from '../api/apiClient';

export const designationService = {
    getAll: async () => {
        const response = await apiClient.get('/master/Designation/get-all');
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`/master/Designation/get-by-id/${id}`);
        return response.data;
    },
    save: async (data) => {
        const response = await apiClient.post('/master/Designation/save', data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/master/Designation/delete/${id}`);
        return response.data;
    }
};
