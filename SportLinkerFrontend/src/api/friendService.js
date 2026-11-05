import apiClient from "./apiClient";

const sendAction = async (action, body, { signal } = {}) => {
  const response = await apiClient.post(`/Friend/${action}`, body, { signal });
  if (response.data !== true) {
    const error = new Error("Operacja nie została potwierdzona przez serwer.");
    error.response = response;
    throw error;
  }
  return response.data;
};

const friendService = {
  send: (body, options) => sendAction("send", body, options),
  accept: (body, options) => sendAction("accept", body, options),
  reject: (body, options) => sendAction("reject", body, options),
};

export default friendService;
