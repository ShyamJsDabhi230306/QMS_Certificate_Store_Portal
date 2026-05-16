import apiClient from './apiClient';

export const userRightService = {
    getByUserId: async (idUser) => {
        const res = await apiClient.get(`/master/UserRight/get-by-user/${idUser}`);
        return res.data;
    },
    updateBulk: async (rightsList) => {
        // The path must match the [Route] and [HttpPost] in C#
        const res = await apiClient.post('/master/UserRight/update-bulk', rightsList);
        return res.data;
    },
    initialize: async (idUser) => {
        const res = await apiClient.post(`/master/UserRight/initialize/${idUser}`);
        return res.data;
    }
};
