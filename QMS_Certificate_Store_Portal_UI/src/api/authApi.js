// import apiClient from './apiClient';

// /**
//  * Handles user login
//  * @param {Object} credentials - contains userName and password
//  */
// export const loginUser = async (credentials) => {
//     try {
//         const response = await apiClient.post('/master/user/login', credentials);
//         return response.data;
//     } catch (error) {
//         // Throw the error so the UI can catch it and show a message
//         throw error.response?.data?.message || "Something went wrong during login";
//     }
// };

import apiClient from './apiClient';

/**
 * Existing local login.
 * Keep this temporarily until Aira OTP login is fully completed.
 */
export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post(
            '/master/user/login',
            credentials
        );

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            'Something went wrong during login.'
        );
    }
};

/**
 * Sends employee code and password to QMS backend.
 * QMS backend then calls Aira and sends OTP.
 */
export const sendOtp = async (employeeCode, password) => {
    try {
        const response = await apiClient.post(
            '/auth/otp/send',
            {
                employeeCode,
                password
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            'Unable to send OTP. Please try again.'
        );
    }
};



export const verifyOtp = async (idUser, otp, employeeCode) => {
    try {
        const response = await apiClient.post(
            '/auth/otp/verify',
            {
                idUser,
                otp,
                employeeCode
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            'Unable to verify OTP. Please try again.'
        );
    }
};