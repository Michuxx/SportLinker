import assert from "node:assert/strict";
import { test } from "node:test";
import { execFileSync } from "node:child_process";
import { INITIAL_OFFER_FILTER, prepareOfferSearch, normalizeSearchOffer, mergeOfferPages, matchesOfferSearch } from "../src/utils/offerSearch.js";

test("default search omits optional values and actor ID, and preserves the backend sort defaults", () => {
  assert.deepEqual(prepareOfferSearch(INITIAL_OFFER_FILTER), { params: { sortOption: "Players", sortOrder: "ASC" }, errors: {} });
});

test("every filter maps to the SearchOffers query contract", () => {
  const { params, errors } = prepareOfferSearch({ ...INITIAL_OFFER_FILTER, title: "  trening  ", sport: "27", level: "any", locationQuery: "Wrocław", location: { country: "Poland", state: "Lower Silesia", city: "Wrocław" }, minPlayers: "0", maxPlayers: "10", sortType: "sport", sortOrder: "DESC" });
  assert.deepEqual(errors, {});
  assert.deepEqual(params, { sortOption: "Sport", sortOrder: "DESC", search: "trening", sportId: 27, level: "Any", country: "Poland", state: "Lower Silesia", city: "Wrocław", minParticipants: 0, maxParticipants: 10 });
  assert.equal(prepareOfferSearch({ ...INITIAL_OFFER_FILTER, sortType: "location" }).params.sortOption, "Location");
});

test("unselected locations, inverted ranges and invalid participant counts are rejected before querying", () => {
  for (const [update, field] of [
    [{ locationQuery: "Wroc" }, "location"],
    [{ location: { city: "Wrocław" } }, "location"],
    [{ minPlayers: "-1" }, "minPlayers"],
    [{ maxPlayers: "1.5" }, "maxPlayers"],
    [{ minPlayers: "8", maxPlayers: "2" }, "players"],
    [{ startDate: "2026-12-10", endDate: "2026-12-01" }, "dates"],
    [{ startDate: "bad-date" }, "startDate"],
    [{ endDate: "2026-02-31" }, "endDate"],
  ]) assert.ok(prepareOfferSearch({ ...INITIAL_OFFER_FILTER, ...update }).errors[field], field);
});

test("date filters use local midnight and the next local day as exclusive end, including DST", () => {
  const url = new URL("../src/utils/offerSearch.js", import.meta.url).href;
  execFileSync(process.execPath, ["--input-type=module", "-e", `
    import assert from 'node:assert/strict';
    import { INITIAL_OFFER_FILTER, prepareOfferSearch } from ${JSON.stringify(url)};
    const { params, errors } = prepareOfferSearch({ ...INITIAL_OFFER_FILTER, startDate: '2026-10-25', endDate: '2026-10-25' });
    assert.deepEqual(errors, {});
    assert.equal(params.dateFrom, '2026-10-24T22:00:00.000Z');
    assert.equal(params.dateToExclusive, '2026-10-25T23:00:00.000Z');
  `], { env: { ...process.env, TZ: "Europe/Warsaw" }, stdio: "pipe" });
});

test("offer list DTO maps to the cards, including author, location, sport, enums and UTC timestamp", () => {
  const result = normalizeSearchOffer({ offerId: 15, title: "Trening", description: "Hala", sportId: 27, sportName: "Siatkówka", level: "Any", mode: "Private", date: "2026-12-10T18:00:00Z", city: "Wrocław", state: "Lower Silesia", authorName: "Anna", currentPeople: 2, maxPeople: 6 });
  assert.equal(result.id, 15);
  assert.equal(result.sport, "Siatkówka");
  assert.equal(result.level, "any");
  assert.equal(result.mode, "private");
  assert.equal(result.author, "Anna");
  assert.equal(result.location.displayLabel, "Wrocław, Lower Silesia");
  assert.equal(result.date, "2026-12-10T18:00:00Z");
});

test("overlapping result pages update existing rows without duplicating them or changing their order", () => {
  const first = [{ id: 1, title: "A" }, { id: 2, title: "B" }];
  assert.deepEqual(mergeOfferPages(first, [{ id: "2", title: "B updated" }, { id: 3, title: "C" }]), [{ id: 1, title: "A" }, { id: "2", title: "B updated" }, { id: 3, title: "C" }]);
  assert.equal(first[1].title, "B");
});

test("locally created offers respect committed search filters without a follow-up GET", () => {
  const offer = { id: 15, title: "Trening", description: "Hala", sportId: 27, level: "any", date: "2026-12-10T18:00:00Z", currentPeople: 1, maxPeople: 6, location: { country: "Poland", state: "Lower Silesia", city: "Wrocław" } };
  const now = Date.parse("2026-11-16T12:00:00Z");
  assert.equal(matchesOfferSearch(offer, { search: "HALA", sportId: 27, level: "Any", city: "Wrocław" }, now), true);
  for (const params of [{ search: "tenis" }, { sportId: 28 }, { city: "Katowice" }, { minParticipants: 2 }, { maxParticipants: 5 }, { dateToExclusive: offer.date }]) assert.equal(matchesOfferSearch(offer, params, now), false);
});
