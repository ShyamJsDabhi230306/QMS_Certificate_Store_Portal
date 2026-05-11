import apiClient from './apiClient';

/**
 * Handles user login
 * @param {Object} credentials - contains userName and password
 */
export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post('/master/user/login', credentials);
        return response.data;
    } catch (error) {
        // Throw the error so the UI can catch it and show a message
        throw error.response?.data?.message || "Something went wrong during login";
    }
};

/**
 * Example: If you add a "forgot password" API later, 
 * you would add it here too.
 */
