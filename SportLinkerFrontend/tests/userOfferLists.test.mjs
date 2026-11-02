import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeUserOffer, normalizeUserRequest, applyUserRequestDecision, rollbackUserRequestDecision } from "../src/utils/userOfferLists.js";

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

const requests = [
  { id: 8, offerId: 14, currentPeople: 1, maxPeople: 2 },
  { id: 9, offerId: 14, currentPeople: 1, maxPeople: 2 },
  { id: 10, offerId: 15, currentPeople: 2, maxPeople: 5 },
];

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
