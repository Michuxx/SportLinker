const normalizeLocation = (data) => ({
  city: data.city,
  country: data.country,
  displayLabel: data.displayLabel || data.name || data.city || "Nie podano lokalizacji",
  houseNumber: data.houseNumber,
  lat: data.lat,
  long: data.long,
  name: data.name,
  state: data.state,
  street: data.street,
  type: data.type,
});

export const normalizeUserOffer = (data) => ({
  ...data,
  id: data.offerId,
  sport: data.sportName,
  level: data.level.toLowerCase(),
  mode: data.mode.toLowerCase(),
  availability: data.availability === "Available" ? "open" : "closed",
  location: normalizeLocation(data),
});

export const normalizeUserRequest = (data) => ({
  ...data,
  id: data.requestId,
  status: data.status.toLowerCase(),
  user: { id: data.userId, name: data.userName },
  location: normalizeLocation(data),
});

export const normalizeSentOfferRequest = (data) => ({
  ...data,
  id: data.requestId,
  status: data.status.toLowerCase(),
  availability: data.availability === "Available" ? "open" : "closed",
  location: normalizeLocation(data),
});

const joinedOfferLevels = {
  0: "beginner",
  1: "intermediate",
  2: "expert",
  3: "any",
  beginner: "beginner",
  intermediate: "intermediate",
  expert: "expert",
  any: "any",
};

const joinedOfferAvailability = {
  0: "open",
  1: "closed",
  available: "open",
  unavailable: "closed",
};

export const normalizeJoinedOffer = (data) => ({
  ...data,
  id: data.offerId,
  title: data.offerName,
  description: data.offerDescription,
  date: data.offerDate,
  level: joinedOfferLevels[String(data.level).toLowerCase()],
  availability: joinedOfferAvailability[String(data.availability).toLowerCase()],
  location: normalizeLocation(data),
});

export const applyUserRequestDecision = (items, requestId, action) => {
  const request = items.find((item) => String(item.id) === String(requestId));
  if (!request) return items;
  return items.filter((item) => String(item.id) !== String(requestId)).map((item) =>
    action === "accept" && String(item.offerId) === String(request.offerId)
      ? { ...item, currentPeople: item.currentPeople + 1 }
      : item,
  );
};

export const rollbackUserRequestDecision = (items, previous, requestId, action) => {
  const request = previous.find((item) => String(item.id) === String(requestId));
  if (!request || items.some((item) => String(item.id) === String(requestId))) return items;
  const restored = items.map((item) =>
    action === "accept" && String(item.offerId) === String(request.offerId)
      ? { ...item, currentPeople: item.currentPeople - 1 }
      : item,
  );
  if (!restored.some((item) => item.id === requestId)) {
    restored.splice(previous.indexOf(request), 0, request);
  }
  return restored;
};
