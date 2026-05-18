import axiosInstance from './apiClient';

export const certificateTypeService = {
    // 🔍 Get all certificate types
    getAll: () => axiosInstance.get('/master/CertificateType/get-all').then(res => res.data),

    // 🔍 Get a single certificate type by ID for editing
    getById: (id) => axiosInstance.get(`/master/CertificateType/get-by-id/${id}`).then(res => res.data),

    // 💾 Save or Update a certificate type
    save: (data) => axiosInstance.post('/master/CertificateType/save', data).then(res => res.data),

    // 🗑️ Delete a certificate type
    delete: (id) => axiosInstance.delete(`/master/CertificateType/delete/${id}`).then(res => res.data),
};
