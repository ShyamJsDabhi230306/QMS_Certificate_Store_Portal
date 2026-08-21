import apiClient from "./apiClient";

export const airaCompanyService = {
  syncCompanies: async () => {
    const response = await apiClient.post(
      "/master/aira-company/sync"
    );

    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get(
      "/master/aira-company/get-all"
    );

    return response.data;
  },

 getFromAira: async () => {
    const response = await apiClient.get(
      "/master/aira-company/aira-list"
    );

    return response.data;
  },

  // Save only the selected company into QMS
  syncSelectedCompany: async (idCompany) => {
    const response = await apiClient.post(
      "/master/aira-company/sync-selected",
      {
        idCompany: Number(idCompany),
      }
    );

    return response.data;
  },
};