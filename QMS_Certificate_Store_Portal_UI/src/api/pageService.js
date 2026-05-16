import apiClient from './apiClient';

export const pageService = {
    getAll: async () => {
        const res = await apiClient.get('/master/Page/get-all');
        return res.data;
    },
    getById: async (id) => {
        const res = await apiClient.get(`/master/Page/get-by-id/${id}`);
        return res.data;
    },
    save: async (data) => {
        const res = await apiClient.post('/master/Page/save', data);
        return res.data;
    },
    delete: async (id) => {
        const res = await apiClient.delete(`/master/Page/delete/${id}`);
        return res.data;
    }
};
