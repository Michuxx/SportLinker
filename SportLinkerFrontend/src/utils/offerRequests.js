export const normalizeOfferRequests = (requests) => requests.map((request) => ({
  id: request.userId,
  playerId: request.userId,
  name: request.name,
  image: request.userImage,
}));

export const applyOfferRequestDecision = (offer, request, action, joinDate) => {
  const requests = offer.requests.filter((item) => String(item.id) !== String(request.id));
  if (action === "reject") return { ...offer, requests };

  const alreadyJoined = offer.members.some((member) => String(member.id) === String(request.id));
  const members = alreadyJoined ? offer.members : [
    ...offer.members,
    {
      id: request.id,
      userId: request.id,
      name: request.name,
      image: request.image,
      joinDate,
    },
  ];
  return {
    ...offer,
    requests,
    members,
    availability: members.length >= offer.maxPeople ? "Unavailable" : offer.availability,
  };
};

export const rollbackOfferRequestAcceptance = (offer, previousOffer, request) => {
  const sameUser = (item) => String(item.id) === String(request.id);
  const wasMember = previousOffer.members.some(sameUser);
  const members = wasMember ? offer.members : offer.members.filter((member) => !sameUser(member));
  const requests = [...offer.requests];
  if (!requests.some(sameUser)) {
    const originalIndex = previousOffer.requests.findIndex(sameUser);
    requests.splice(originalIndex < 0 ? requests.length : originalIndex, 0, request);
  }
  return {
    ...offer,
    members,
    requests,
    availability: members.length >= offer.maxPeople ? "Unavailable" : previousOffer.availability,
  };
};
