import apiClient from "./apiClient";

const confirmed = (response) => {
  if (response.data !== true) {
    const error = new Error("Serwer nie potwierdził operacji.");
    error.response = response;
    throw error;
  }
  return response.data;
};

const conversationService = {
  async getConversations({ signal } = {}) {
    const response = await apiClient.get("/Conversation", { signal });
    return response.data;
  },
  async getMessages(id, { signal, cursor, pageSize = 30 } = {}) {
    const response = await apiClient.get(`/Conversation/${id}/messages`, {
      signal,
      params: { pageSize, ...(cursor ? { beforeSendAt: cursor.sendAt, beforeId: cursor.id } : {}) },
    });
    return response.data;
  },
  async createPrivate(body, { signal } = {}) {
    const response = await apiClient.post("/Conversation/private", body, { signal });
    if (!Number.isInteger(response.data?.conversationId) || response.data.conversationId <= 0) {
      const error = new Error("Brak identyfikatora rozmowy w odpowiedzi serwera.");
      error.response = response;
      throw error;
    }
    return response.data.conversationId;
  },
  async sendMessage(body, { signal } = {}) {
    return confirmed(await apiClient.post("/Conversation/messages", body, { signal }));
  },
  async deleteHistory(id, { signal } = {}) {
    return confirmed(await apiClient.delete(`/Conversation/${id}/history`, { signal }));
  },
};

export default conversationService;
