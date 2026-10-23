const normalizePerson = (person) => ({ ...person, id: person.userId });

export const normalizeOfferDetails = (data) => ({
  ...data,
  id: data.offerId,
  level: data.level?.toLowerCase(),
  mode: data.mode?.toLowerCase(),
  status: data.status?.toLowerCase() ?? null,
  location: {
    city: data.city,
    country: data.country,
    displayLabel: data.displayLabel || data.city || "",
    houseNumber: data.houseNumber,
    lat: data.lat,
    long: data.long,
    name: data.name,
    state: data.state,
    street: data.street,
    type: data.type,
  },
  author: normalizePerson(data.author),
  members: (data.members ?? []).map(normalizePerson),
  requests: (data.requests ?? []).map(normalizePerson),
});
