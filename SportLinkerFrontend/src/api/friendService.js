import apiClient from "./apiClient";

const sendAction = async (action, body, { signal } = {}) => {
  const response = action === "delete"
    ? await apiClient.delete("/Friend/delete", { data: body, signal })
    : await apiClient.post(`/Friend/${action}`, body, { signal });
  const isSuccess = action === "send"
    ? Number.isInteger(response.data) && response.data > 0
    : response.data === true;
  if (!isSuccess) {
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
  cancel: (body, options) => sendAction("cancel", body, options),
  delete: (body, options) => sendAction("delete", body, options),
};

export default friendService;
