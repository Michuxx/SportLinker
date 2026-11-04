import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeUserOffer, normalizeUserRequest, normalizeSentOfferRequest, normalizeJoinedOffer, applyUserRequestDecision, rollbackUserRequestDecision } from "../src/utils/userOfferLists.js";

test("user offers map API enums, sport, location and identity to existing cards", () => {
  const data = { offerId: 14, title: "Tenis", level: "Any", mode: "Public", availability: "Available", sportName: "Tenis", date: "2026-12-01T18:00:00Z", city: "Wrocław", lat: 51.1, long: 17.1, currentPeople: 1, maxPeople: 4 };
  const result = normalizeUserOffer(data);
  assert.equal(result.id, 14);
  assert.equal(result.sport, "Tenis");
  assert.equal(result.level, "any");
  assert.equal(result.mode, "public");
  assert.equal(result.availability, "open");
  assert.equal(result.location.displayLabel, "Wrocław");
  assert.equal(result.location.lat, 51.1);
  assert.equal(result.date, data.date);
  assert.equal(normalizeUserOffer({ ...data, availability: "Unavailable" }).availability, "closed");
});

test("request, offer and applicant IDs remain distinct", () => {
  const result = normalizeUserRequest({ requestId: 8, offerId: 14, userId: 32, userName: "Anna", offerTitle: "Tenis", status: "Pending", sport: "Tenis", displayLabel: "Wrocław, Hala" });
  assert.equal(result.id, 8);
  assert.equal(result.offerId, 14);
  assert.equal(result.user.id, 32);
  assert.equal(result.user.name, "Anna");
  assert.equal(result.offerTitle, "Tenis");
  assert.equal(result.status, "pending");
  assert.equal(result.location.displayLabel, "Wrocław, Hala");
});

test("sent requests map request and offer IDs, title, availability and request status", () => {
  const data = { requestId: 6, offerId: 19, title: "Trening", sport: "Tenis", status: "Rejected", availability: "Unavailable", currentPeople: 3, maxPeople: 3, date: "2026-12-01T18:00:00Z", city: "Wrocław", name: "Hala" };
  const result = normalizeSentOfferRequest(data);
  assert.equal(result.id, 6);
  assert.equal(result.offerId, 19);
  assert.equal(result.title, "Trening");
  assert.equal(result.sport, "Tenis");
  assert.equal(result.status, "rejected");
  assert.equal(result.availability, "closed");
  assert.equal(result.currentPeople, 3);
  assert.equal(result.location.displayLabel, "Hala");
  assert.equal(result.date, data.date);
  const pending = normalizeSentOfferRequest({ ...data, status: "Pending", availability: "Available" });
  assert.equal(pending.status, "pending");
  assert.equal(pending.availability, "open");
});

const requests = [
  { id: 8, offerId: 14, currentPeople: 1, maxPeople: 2 },
  { id: 9, offerId: 14, currentPeople: 1, maxPeople: 2 },
  { id: 10, offerId: 15, currentPeople: 2, maxPeople: 5 },
];

test("joined offers map dedicated DTO fields, sport, level and availability to cards", () => {
  const data = {
    offerId: 42,
    offerName: "Wieczorny trening",
    offerDescription: "Spotkanie w hali",
    offerDate: "2026-12-01T18:00:00Z",
    currentPeople: 2,
    maxPeople: 4,
    sport: "Siatkówka",
    level: "Intermediate",
    availability: "Available",
    city: "Wrocław",
    country: "Poland",
    name: "Hala",
    street: "Sportowa",
    displayLabel: "Wrocław, ul. Sportowa, Hala",
    lat: 51.1,
    long: 17.1,
  };
  const original = structuredClone(data);
  const result = normalizeJoinedOffer(data);
  assert.equal(result.id, 42);
  assert.equal(result.title, data.offerName);
  assert.equal(result.description, data.offerDescription);
  assert.equal(result.date, data.offerDate);
  assert.equal(result.currentPeople, 2);
  assert.equal(result.maxPeople, 4);
  assert.equal(result.location.displayLabel, data.displayLabel);
  assert.equal(result.location.lat, 51.1);
  assert.equal(result.location.long, 17.1);
  assert.equal(result.sport, "Siatkówka");
  assert.equal(result.level, "intermediate");
  assert.equal(result.availability, "open");
  for (const field of ["mode", "status"]) {
    assert.equal(result[field], undefined);
  }
  assert.deepEqual(data, original);
});

test("joined offers map every API level and unavailable offers to existing tag types", () => {
  for (const [level, expected] of [["Beginner", "beginner"], ["Intermediate", "intermediate"], ["Expert", "expert"], ["Any", "any"]]) {
    const result = normalizeJoinedOffer({ offerId: 1, level, availability: "Unavailable" });
    assert.equal(result.level, expected);
    assert.equal(result.availability, "closed");
  }
});

test("joined offer locations support city-only data and absent labels", () => {
  assert.equal(normalizeJoinedOffer({ offerId: 1, city: "Katowice" }).location.displayLabel, "Katowice");
  assert.equal(normalizeJoinedOffer({ offerId: 2 }).location.displayLabel, "Nie podano lokalizacji");
});

test("joined offer tags support numeric enums and case-insensitive enum names", () => {
  for (const [level, expected] of [[0, "beginner"], [1, "intermediate"], [2, "expert"], [3, "any"], ["Beginner", "beginner"], ["any", "any"]]) {
    assert.equal(normalizeJoinedOffer({ level }).level, expected);
  }
  for (const [availability, expected] of [[0, "open"], [1, "closed"], ["Available", "open"], ["Unavailable", "closed"], ["available", "open"]]) {
    assert.equal(normalizeJoinedOffer({ availability }).availability, expected);
  }
});

test("accepting updates all cards of the same offer; rollback restores them", () => {
  const result = applyUserRequestDecision(requests, 8, "accept");
  assert.deepEqual(result.map((item) => [item.id, item.currentPeople]), [[9, 2], [10, 2]]);
  assert.deepEqual(rollbackUserRequestDecision(result, requests, 8, "accept"), requests);
  assert.equal(requests.length, 3);
  assert.equal(requests[1].currentPeople, 1);
  assert.equal(result[0].maxPeople - result[0].currentPeople, 0);
  assert.equal(result[0].currentPeople >= result[0].maxPeople, true);
});

test("subsequent acceptances keep other cards in sync and rollback restores only the failed step", () => {
  const previous = [
    { id: 1, offerId: 10, currentPeople: 1, maxPeople: 3 },
    { id: 2, offerId: 10, currentPeople: 1, maxPeople: 3 },
    { id: 3, offerId: 10, currentPeople: 1, maxPeople: 3 },
  ];
  const first = applyUserRequestDecision(previous, "1", "accept");
  assert.equal(first[0].currentPeople, 2);
  const second = applyUserRequestDecision(first, 2, "accept");
  assert.equal(second[0].currentPeople, 3);
  const restored = rollbackUserRequestDecision(second, first, 2, "accept");
  assert.deepEqual(restored, first);
  assert.deepEqual(rollbackUserRequestDecision(restored, first, 2, "accept"), first);
  assert.equal(applyUserRequestDecision(first, 99, "accept"), first);
});

test("rejecting removes only that request and rollback restores its position", () => {
  const result = applyUserRequestDecision(requests, 9, "reject");
  assert.deepEqual(result.map((item) => item.id), [8, 10]);
  assert.equal(result[0].currentPeople, 1);
  assert.deepEqual(rollbackUserRequestDecision(result, requests, 9, "reject"), requests);
});
