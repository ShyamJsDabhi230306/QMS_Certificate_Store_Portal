import apiClient from './apiClient';

export const userRightService = {

    // =====================================
    // GET RIGHTS BY DESIGNATION
    // =====================================

    getByDesignationId: async (idDesignation) => {

        try {

            const response = await apiClient.get(
                `/master/UserRight/get-by-designation/${idDesignation}`
            );

            return response.data;

        } catch (error) {

            console.error(
                'GET RIGHTS ERROR',
                error
            );

            return {
                success: false,
                message: 'Failed to load rights'
            };

        }

    },

    // =====================================
    // UPDATE BULK RIGHTS
    // =====================================

    updateBulk: async (rightsList) => {

        try {

            console.log(
                'UPDATE BULK PAYLOAD',
                rightsList
            );

            const response = await apiClient.post(
                '/master/UserRight/update-bulk',
                rightsList
            );

            return response.data;

        } catch (error) {

            console.error(
                'UPDATE BULK ERROR',
                error.response?.data || error.message
            );

            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update rights'
            };

        }

    },

    // =====================================
    // INITIALIZE RIGHTS
    // =====================================

    initialize: async (idDesignation) => {

        try {

            const response = await apiClient.post(
                `/master/UserRight/initialize/${idDesignation}`
            );

            return response.data;

        } catch (error) {

            console.error(
                'INITIALIZE RIGHTS ERROR',
                error
            );

            return {
                success: false,
                message: 'Failed to initialize rights'
            };

        }

    },



    getForUser: async (idUser) => {
        try {
            const response = await apiClient.get(
                `/master/UserRight/get-for-user/${idUser}`
            );
            return response.data;
        } catch (error) {
            console.error(
                'GET FOR USER ERROR',
                error.response?.data || error.message
            );
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to load user rights'
            };
        }
    },

    saveForUser: async (right) => {
        try {
            const response = await apiClient.post(
                "/master/UserRight/save-for-user",
                right
            );
            return response.data;
        } catch (error) {
            console.error(
                'SAVE FOR USER ERROR',
                error.response?.data || error.message
            );
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to save user rights'
            };
        }
    },

    removeUserOverride: async (idUser, idPage) => {
        try {
            const response = await apiClient.post(
                "/master/UserRight/remove-user-override",
                {
                    idUser,
                    idPage
                }
            );
            return response.data;
        } catch (error) {
            console.error(
                'REMOVE USER OVERRIDE ERROR',
                error.response?.data || error.message
            );
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to remove user override'
            };
        }
    }

    



};