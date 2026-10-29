import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeOfferRequests, applyOfferRequestDecision, rollbackOfferRequestAcceptance } from "../src/utils/offerRequests.js";

test("offer request identities and images map to the modal cards", () => {
  const response = [{ userId: 23, name: "Jan", userImage: "/profiles/jan.webp" }];
  assert.deepEqual(normalizeOfferRequests(response), [{
    id: 23, playerId: 23, name: "Jan", image: "/profiles/jan.webp",
  }]);
  assert.equal(response[0].id, undefined);
});

test("empty lists and missing profile images are supported", () => {
  assert.deepEqual(normalizeOfferRequests([]), []);
  assert.equal(normalizeOfferRequests([{ userId: 2, name: "Anna", userImage: null }])[0].image, null);
});

const request = { id: 23, playerId: 23, name: "Jan", image: "/profiles/jan.webp" };
const offer = {
  id: 1, sportId: 7, status: null, maxPeople: 2, availability: "Available",
  members: [{ id: 2 }], requests: [request, { id: 24, name: "Anna" }],
};
const joinDate = "2026-10-29T12:00:00Z";

test("accepting removes only the selected request and fills the final place", () => {
  const updated = applyOfferRequestDecision(offer, request, "accept", joinDate);
  assert.deepEqual(updated.requests, [{ id: 24, name: "Anna" }]);
  assert.deepEqual(updated.members[1], {
    id: 23, userId: 23, name: "Jan", image: "/profiles/jan.webp", joinDate,
  });
  assert.equal(updated.members.length, 2);
  assert.equal(updated.availability, "Unavailable");
  assert.equal(updated.maxPeople - updated.members.length, 0);
  assert.equal(updated.status, null);
  assert.equal(updated.sportId, 7);
  assert.equal(offer.members.length, 1);
  assert.equal(offer.requests.length, 2);
});

test("rejecting leaves membership and availability unchanged", () => {
  const updated = applyOfferRequestDecision(offer, { ...request, id: "23" }, "reject", joinDate);
  assert.deepEqual(updated.requests, [{ id: 24, name: "Anna" }]);
  assert.equal(updated.members, offer.members);
  assert.equal(updated.availability, "Available");
});

test("accepting with places remaining preserves availability and never duplicates a member", () => {
  const updated = applyOfferRequestDecision({ ...offer, maxPeople: 3 }, request, "accept", joinDate);
  assert.equal(updated.availability, "Available");
  const repeated = applyOfferRequestDecision(updated, { ...request, id: "23" }, "accept", joinDate);
  assert.equal(repeated.members, updated.members);
  assert.equal(repeated.members.length, 2);
});

test("failed acceptance restores the request, free places and availability", () => {
  const optimistic = applyOfferRequestDecision(offer, request, "accept", joinDate);
  assert.equal(optimistic.members.length, 2);
  assert.equal(optimistic.availability, "Unavailable");
  const restored = rollbackOfferRequestAcceptance(optimistic, offer, request);
  assert.deepEqual(restored, offer);
});

test("rollback preserves unrelated changes and existing membership", () => {
  const previous = { ...offer, members: [...offer.members, { id: 23 }] };
  const optimistic = applyOfferRequestDecision(previous, request, "accept", joinDate);
  const restored = rollbackOfferRequestAcceptance({ ...optimistic, title: "Nowy tytuł" }, previous, request);
  assert.equal(restored.title, "Nowy tytuł");
  assert.equal(restored.members.length, 2);
  assert.equal(restored.requests.length, 2);
  assert.equal(restored.availability, "Unavailable");
  const repeated = rollbackOfferRequestAcceptance(restored, previous, request);
  assert.equal(repeated.requests.length, 2);
});
