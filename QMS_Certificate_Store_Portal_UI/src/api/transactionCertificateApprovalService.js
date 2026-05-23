import apiClient from './apiClient';

export const transactionCertificateApprovalService = {
    // 🔍 Get all pending certificates awaiting approval
    getPending: () => apiClient.get('/transaction/TransactionCertificateApproval/pending').then(res => res.data),

    // ⚡ Process approval (Approve / Reject decision)
    process: (data) => apiClient.post('/transaction/TransactionCertificateApproval/process', data).then(res => res.data),

    // 🔄 Change Status (Reject ↔ Approve status override)
    changeStatus: (data) => apiClient.put('/transaction/TransactionCertificateApproval/change-status', data).then(res => res.data),
     getHistory: () =>
        apiClient
            .get('/transaction/TransactionCertificateApproval/history')
            .then(res => res.data),
    
};
