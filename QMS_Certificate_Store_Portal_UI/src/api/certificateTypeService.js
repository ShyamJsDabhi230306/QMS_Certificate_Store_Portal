import apiClient from './apiClient';

export const certificateTypeService = {
    // 🔍 Get all certificate types
    getAll: () => apiClient.get('/master/CertificateType/get-all').then(res => res.data),

    // 🔍 Get a single certificate type by ID for editing
    getById: (id) => apiClient.get(`/master/CertificateType/get-by-id/${id}`).then(res => res.data),

    // 💾 Save or Update a certificate type
    save: (data) => apiClient.post('/master/CertificateType/save', data).then(res => res.data),

    // 🗑️ Delete a certificate type
    delete: (id) => apiClient.delete(`/master/CertificateType/delete/${id}`).then(res => res.data),
};
