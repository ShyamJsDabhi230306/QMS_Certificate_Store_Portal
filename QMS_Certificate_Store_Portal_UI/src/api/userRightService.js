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
                error
            );

            return {
                success: false,
                message: 'Failed to update rights'
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

    }

};