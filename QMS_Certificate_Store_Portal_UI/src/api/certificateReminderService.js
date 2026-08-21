// import apiClient from './apiClient';

// export const certificateReminderService = {

//     // =====================================
//     // GET PENDING REMINDERS
//     // =====================================
//     getPendingReminders: () =>
//         apiClient
//             .get(
//                 '/transaction/CertificateReminder/pending-reminders'
//             )
//             .then(res => res.data),
// };


import apiClient from "./apiClient";

export const certificateReminderService = {
  getPendingReminders: async () => {
    const response = await apiClient.get(
      "/transaction/CertificateReminder/pending-reminders"
    );

    return response.data;
  },

  getByCertificateId: async (idCertificate) => {
    const response = await apiClient.get(
      `/transaction/CertificateReminder/by-certificate/${idCertificate}`
    );

    return response.data;
  },

  add: async (payload) => {
    const response = await apiClient.post(
      "/transaction/CertificateReminder/save",
      payload
    );

    return response.data;
  },

// this is the method for the number we are do add 
  getCustomContacts: async (idReminder) => {
  const response = await apiClient.get(
    `/transaction/Certificate/custom-contacts/${idReminder}`
  );

  return response.data;
},

saveCustomContact: async (payload) => {
  const response = await apiClient.post(
    "/transaction/Certificate/save-custom-contact",
    payload
  );

  return response.data;
},

deleteCustomContact: async (idCustom) => {
  const response = await apiClient.delete(
    `/transaction/Certificate/delete-custom-contact/${idCustom}`
  );

  return response.data;
},


update: async (idReminder, payload) => {
  const response = await apiClient.put(
    `/transaction/CertificateReminder/update/${idReminder}`,
    payload
  );

  return response.data;
},

delete: async (idReminder) => {
  const response = await apiClient.delete(
    `/transaction/CertificateReminder/delete/${idReminder}`
  );

  return response.data;
},

};