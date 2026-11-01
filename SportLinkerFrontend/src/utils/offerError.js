export const getOfferErrorType = (error) => {
  const code = error.response?.data?.message?.code || error.response?.data?.code;
  if (error.response?.status === 404 || code === "OFFER_NOT_FOUND") return "notFound";
  if (!error.response || error.code === "ERR_NETWORK") return "connection";
  return "server";
};
