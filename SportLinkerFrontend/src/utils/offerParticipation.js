const sameUser = (item, userId) => String(item.id) === String(userId);

export const applyOfferExit = (offer, userId, action) => {
  if (action === "cancel") {
    return {
      ...offer,
      status: null,
      requests: offer.requests.filter((request) => !sameUser(request, userId)),
    };
  }
  return {
    ...offer,
    members: offer.members.filter((member) => !sameUser(member, userId)),
    status: action === "leave" ? null : offer.status,
  };
};

const restoreUser = (current, previous, userId) => {
  const index = previous.findIndex((item) => sameUser(item, userId));
  if (index < 0 || current.some((item) => sameUser(item, userId))) return current;
  const restored = [...current];
  restored.splice(index, 0, previous[index]);
  return restored;
};

export const rollbackOfferExit = (offer, previousOffer, userId, action) => {
  if (action === "cancel") {
    return {
      ...offer,
      status: previousOffer.status,
      requests: restoreUser(offer.requests, previousOffer.requests, userId),
    };
  }
  return {
    ...offer,
    members: restoreUser(offer.members, previousOffer.members, userId),
    status: action === "leave" ? previousOffer.status : offer.status,
  };
};
