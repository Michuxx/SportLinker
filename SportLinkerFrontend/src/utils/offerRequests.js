export const normalizeOfferRequests = (requests) => requests.map((request) => ({
  id: request.userId,
  playerId: request.userId,
  name: request.name,
  image: request.userImage,
}));
