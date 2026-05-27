import apiClient from './apiClient';

export const certificateService = {
    // 🔍 Get all certificates
    getAll: () => apiClient.get('/transaction/Certificate/get-all').then(res => res.data),

    // 🔍 Get a single certificate by ID (loads lookups & child reminders automatically!)
    getById: (id) => apiClient.get(`/transaction/Certificate/get-by-id/${id}`).then(res => res.data),

    // 💾 Save or Update a certificate (sends certificate details and reminders array)
    save: (data) => apiClient.post('/transaction/Certificate/save', data).then(res => res.data),

    // 🗑️ Delete a certificate
    delete: (id) => apiClient.delete(`/transaction/Certificate/delete/${id}`).then(res => res.data),

    // 📂 Upload Certificate File Attachment
    upload: (formData) => apiClient.post('/transaction/Certificate/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => res.data),

    // 📊 Get Dashboard Statistics
    getDashboardStats: () => apiClient.get('/transaction/Certificate/dashboard-stats').then(res => res.data),
   
    
    
};
