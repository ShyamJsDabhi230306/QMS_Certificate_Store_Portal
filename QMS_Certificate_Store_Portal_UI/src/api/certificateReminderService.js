import apiClient from './apiClient';

export const certificateReminderService = {

    // =====================================
    // GET PENDING REMINDERS
    // =====================================
    getPendingReminders: () =>
        apiClient
            .get(
                '/transaction/CertificateReminder/pending-reminders'
            )
            .then(res => res.data),
};