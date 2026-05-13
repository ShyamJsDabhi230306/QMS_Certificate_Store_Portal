import apiClient from '../api/apiClient';

export const departmentService = {
    getAll: async () => {
        const response = await apiClient.get('/master/Department/get-all');
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`/master/Department/get-by-id/${id}`);
        return response.data;
    },
    save: async (data) => {
        const response = await apiClient.post('/master/Department/save', data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/master/Department/delete/${id}`);
        return response.data;
    }
};
