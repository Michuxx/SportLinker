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

export const applyUserRequestDecision = (items, requestId, action) => {
  const request = items.find((item) => item.id === requestId);
  return items.filter((item) => item.id !== requestId).map((item) =>
    action === "accept" && item.offerId === request?.offerId
      ? { ...item, currentPeople: item.currentPeople + 1 }
      : item,
  );
};

export const rollbackUserRequestDecision = (items, previous, requestId, action) => {
  const request = previous.find((item) => item.id === requestId);
  if (!request) return items;
  const restored = items.map((item) =>
    action === "accept" && item.offerId === request.offerId
      ? { ...item, currentPeople: item.currentPeople - 1 }
      : item,
  );
  if (!restored.some((item) => item.id === requestId)) {
    restored.splice(previous.indexOf(request), 0, request);
  }
  return restored;
};
