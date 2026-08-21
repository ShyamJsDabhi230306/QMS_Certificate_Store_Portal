// import apiClient from './apiClient';

// export const userApi = {
//     // 🔍 Get all users
//     getAll: async () => {
//         const response = await apiClient.get('/master/user/get-all');
//         return response.data;
//     },

//     // 🔍 Get a single user by ID (for Editing)
//     getById: async (id) => {
//         const response = await apiClient.get(`/master/user/get-by-id/${id}`);
//         return response.data;
//     },

//     // 💾 Save user (Works for both Insert and Update)
//     save: async (userData) => {
//         const response = await apiClient.post('/master/user/save', userData);
//         return response.data;
//     },

//     // 🗑️ Delete user
//     delete: async (id) => {
//         const response = await apiClient.delete(`/master/user/delete/${id}`);
//         return response.data;
//     },

//     getForRights: async () => {
//     const response = await apiClient.get(
//         "/master/user/get-for-rights"
//     );

//     return response.data;
// },


//     getAiraEmployees: async () => {
//     const response = await apiClient.get(
//         "/master/user/aira-employees"
//     );

//     return response.data;
// },

// saveFromAira: async (userData) => {
//     const response = await apiClient.post(
//         "/master/user/save-from-aira",
//         userData
//     );

//     return response.data;
// },



// };


import apiClient from "./apiClient";

export const userApi = {
    getAll: async () => {
        const response = await apiClient.get(
            "/master/user/get-all"
        );

        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(
            `/master/user/get-by-id/${id}`
        );

        return response.data;
    },

    save: async (userData) => {
        const response = await apiClient.post(
            "/master/user/save",
            userData
        );

        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(
            `/master/user/delete/${id}`
        );

        return response.data;
    },

    getForRights: async (search = "") => {
        const response = await apiClient.get(
            "/master/user/get-for-rights",
            {
                params: {
                    search
                }
            }
        );

        return response.data;
    },

    getAiraEmployees: async () => {
        const response = await apiClient.get(
            "/master/user/aira-employees"
        );

        return response.data;
    },

    saveFromAira: async (idUserManagement) => {
        const response = await apiClient.post(
            "/master/user/save-from-aira",
            {
                idUserManagement
            }
        );

        return response.data;
    },

    importBulk: async (idUserManagement) => {
        const response = await apiClient.post(
            "/master/user/import-bulk",
            {
                idUserManagement
            }
        );

        return response.data;
    },

    assignDesignation: async (
        idUserManagement,
        idDesignation
    ) => {
        const response = await apiClient.post(
            "/master/user/assign-designation",
            {
                idUserManagement,
                idDesignation
            }
        );

        return response.data;
    }
};