import { parseApiDate, toLocalDateFields } from "./dateTime.js";

export const INITIAL_OFFER_FILTER = { title: "", sport: "all", location: null, locationQuery: "", level: "all", startDate: "", endDate: "", minPlayers: "", maxPlayers: "", sortType: "players", sortOrder: "ASC" };
const levels = { beginner: "Beginner", intermediate: "Intermediate", expert: "Expert", any: "Any" };
const sorts = { players: "Players", location: "Location", sport: "Sport" };

export const prepareOfferSearch = (filter) => {
  const errors = {};
  const params = { sortOption: sorts[filter.sortType], sortOrder: filter.sortOrder };
  const search = filter.title.trim();
  if (search) params.search = search;
  if (search.length > 200) errors.title = "Wpisz maksymalnie 200 znaków.";
  if (filter.sport !== "all") {
    params.sportId = Number(filter.sport);
    if (!Number.isInteger(params.sportId) || params.sportId <= 0) errors.sport = "Wybierz poprawną dyscyplinę.";
  }
  if (filter.level !== "all") {
    params.level = levels[filter.level];
    if (!params.level) errors.level = "Wybierz poprawny poziom.";
  }
  if (filter.locationQuery.trim() && !filter.location) errors.location = "Wybierz miasto z podpowiedzi.";
  if (filter.location) {
    const { country, state, city, name } = filter.location;
    if (!country || !(city || name || state)) errors.location = "Wybierz miasto z podpowiedzi.";
    else Object.assign(params, { country, ...(state ? { state } : {}), ...((city || name) ? { city: city || name } : {}) });
  }
  const boundary = (value, field, exclusive = false) => {
    const date = new Date(`${value}T00:00:00`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || toLocalDateFields(date).date !== value) {
      errors[field] = "Wybierz poprawną datę.";
      return;
    }
    if (exclusive) date.setDate(date.getDate() + 1);
    return date.toISOString();
  };
  if (filter.startDate) params.dateFrom = boundary(filter.startDate, "startDate");
  if (filter.endDate) params.dateToExclusive = boundary(filter.endDate, "endDate", true);
  if (filter.startDate && filter.endDate && filter.startDate > filter.endDate) errors.dates = "Data końcowa nie może być wcześniejsza niż początkowa.";
  for (const [field, param] of [["minPlayers", "minParticipants"], ["maxPlayers", "maxParticipants"]]) {
    if (filter[field] !== "" && filter[field] != null) {
      const value = Number(filter[field]);
      if (!Number.isInteger(value) || value < 0) errors[field] = "Liczba uczestników musi być nieujemną liczbą całkowitą.";
      else params[param] = value;
    }
  }
  if (params.minParticipants != null && params.maxParticipants != null && params.minParticipants > params.maxParticipants) errors.players = "Maksymalna liczba uczestników nie może być mniejsza od minimalnej.";
  return { params, errors };
};

export const normalizeSearchOffer = (data) => ({
  ...data,
  id: data.offerId,
  sport: data.sportName,
  level: typeof data.level === "number" ? ["beginner", "intermediate", "expert", "any"][data.level] : data.level?.toLowerCase(),
  mode: typeof data.mode === "number" ? ["public", "private"][data.mode] : data.mode?.toLowerCase(),
  author: data.authorName,
  location: { city: data.city, state: data.state, displayLabel: data.displayLabel || [data.city, data.state].filter(Boolean).join(", ") || "Nie podano lokalizacji" },
});

export const mergeOfferPages = (current, incoming) => {
  const result = new Map(current.map((offer) => [String(offer.id), offer]));
  incoming.forEach((offer) => result.set(String(offer.id), offer));
  return [...result.values()];
};

// Newly created offers can be displayed without refetching the search results.
export const matchesOfferSearch = (offer, params, now = Date.now()) => {
  const date = parseApiDate(offer.date).getTime();
  return date >= now
    && (!params.search || `${offer.title} ${offer.description}`.toLocaleLowerCase().includes(params.search.toLocaleLowerCase()))
    && (params.sportId == null || Number(offer.sportId) === params.sportId)
    && (!params.level || offer.level?.toLowerCase() === params.level.toLowerCase())
    && (!params.country || offer.location?.country === params.country)
    && (!params.state || offer.location?.state === params.state)
    && (!params.city || (offer.location?.city || offer.location?.name) === params.city)
    && (!params.dateFrom || date >= Date.parse(params.dateFrom))
    && (!params.dateToExclusive || date < Date.parse(params.dateToExclusive))
    && (params.minParticipants == null || offer.currentPeople >= params.minParticipants)
    && (params.maxParticipants == null || offer.maxPeople <= params.maxParticipants);
};
