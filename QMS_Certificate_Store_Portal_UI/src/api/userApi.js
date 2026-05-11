import apiClient from './apiClient';

// Get all users
export const getAllUsers = async () => {
    const response = await apiClient.get('/master/user/get-all');
    return response.data;
};

// Get a single user by ID (for Editing)
export const getUserById = async (id) => {
    const response = await apiClient.get(`/master/user/get-by-id/${id}`);
    return response.data;
};

// Save user (Works for both Insert and Update)
export const saveUser = async (userData) => {
    const response = await apiClient.post('/master/user/save', userData);
    return response.data;
};

// Delete user
export const deleteUser = async (id) => {
    const response = await apiClient.delete(`/master/user/delete/${id}`);
    return response.data;
};
