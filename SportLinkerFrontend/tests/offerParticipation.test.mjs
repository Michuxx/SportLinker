import assert from "node:assert/strict";
import { test } from "node:test";
import { applyOfferExit, rollbackOfferExit } from "../src/utils/offerParticipation.js";

const offer = {
  id: 8,
  title: "Wspólny trening",
  status: "accepted",
  availability: "Unavailable",
  maxPeople: 3,
  authorId: 1,
  members: [
    { id: 1, name: "Autor" },
    { id: 2, name: "Jan" },
    { id: 3, name: "Anna" },
  ],
  requests: [
    { id: 4, name: "Ola" },
    { id: 5, name: "Adam" },
    { id: 6, name: "Ewa" },
  ],
};

test("deleting a participant immediately frees one place without changing backend availability", () => {
  const before = structuredClone(offer);
  const updated = applyOfferExit(offer, "2", "delete");
  assert.deepEqual(updated.members, [offer.members[0], offer.members[2]]);
  assert.equal(updated.maxPeople - updated.members.length, 1);
  assert.equal(updated.availability, "Unavailable");
  assert.equal(updated.status, "accepted");
  assert.equal(updated.authorId, 1);
  assert.equal(updated.requests, offer.requests);
  assert.deepEqual(offer, before);
});

test("leaving removes the current participant and clears their accepted status", () => {
  const updated = applyOfferExit(offer, 2, "leave");
  assert.deepEqual(updated.members.map((member) => member.id), [1, 3]);
  assert.equal(updated.status, null);
  assert.equal(updated.availability, offer.availability);
  assert.equal(updated.requests, offer.requests);
});

test("canceling a request clears its status without changing participants or availability", () => {
  const previous = { ...offer, status: "pending" };
  const updated = applyOfferExit(previous, "5", "cancel");
  assert.deepEqual(updated.requests, [offer.requests[0], offer.requests[2]]);
  assert.equal(updated.status, null);
  assert.equal(updated.members, previous.members);
  assert.equal(updated.availability, previous.availability);
  assert.equal(previous.requests.length, 3);
  assert.equal(previous.status, "pending");
});

test("failed deletion restores only the removed participant in their original order", () => {
  const optimistic = applyOfferExit(offer, 2, "delete");
  const current = {
    ...optimistic,
    title: "Nowy tytuł",
    status: "pending",
    members: [...optimistic.members, { id: 9, name: "Nowy uczestnik" }],
  };
  const restored = rollbackOfferExit(current, offer, "2", "delete");
  assert.deepEqual(restored.members.map((member) => member.id), [1, 2, 3, 9]);
  assert.equal(restored.members[1], offer.members[1]);
  assert.equal(restored.title, "Nowy tytuł");
  assert.equal(restored.status, "pending");
  assert.equal(restored.requests, current.requests);
  assert.equal(current.members.length, 3);
});

test("failed leave restores membership and the previous status", () => {
  const optimistic = applyOfferExit(offer, 2, "leave");
  const restored = rollbackOfferExit(optimistic, offer, 2, "leave");
  assert.deepEqual(restored, offer);
  assert.equal(restored.members[1], offer.members[1]);
});

test("failed cancellation restores the request order and status while preserving unrelated edits", () => {
  const previous = { ...offer, status: "rejected" };
  const optimistic = applyOfferExit(previous, 5, "cancel");
  const current = { ...optimistic, title: "Nowy tytuł", maxPeople: 4 };
  const restored = rollbackOfferExit(current, previous, "5", "cancel");
  assert.deepEqual(restored.requests, previous.requests);
  assert.equal(restored.status, "rejected");
  assert.equal(restored.title, "Nowy tytuł");
  assert.equal(restored.maxPeople, 4);
  assert.equal(restored.members, current.members);
});

test("repeated rollback does not duplicate a participant or request with mixed ID types", () => {
  const removed = applyOfferExit(offer, "2", "delete");
  const restored = rollbackOfferExit(removed, offer, 2, "delete");
  const repeated = rollbackOfferExit({
    ...restored,
    members: restored.members.map((member) => member.id === 2 ? { ...member, id: "2" } : member),
  }, offer, 2, "delete");
  assert.equal(repeated.members.length, 3);

  const canceled = applyOfferExit(offer, 5, "cancel");
  const requestRestored = rollbackOfferExit(canceled, offer, "5", "cancel");
  const requestRepeated = rollbackOfferExit(requestRestored, offer, 5, "cancel");
  assert.equal(requestRepeated.requests, requestRestored.requests);
  assert.equal(requestRepeated.requests.length, 3);
});

test("rollback never invents a participant or request absent from the previous state", () => {
  const removed = applyOfferExit(offer, 99, "delete");
  const restored = rollbackOfferExit(removed, offer, "99", "delete");
  assert.equal(restored.members, removed.members);
  assert.deepEqual(restored.members, offer.members);

  const canceled = applyOfferExit(offer, 99, "cancel");
  const requestRestored = rollbackOfferExit(canceled, offer, "99", "cancel");
  assert.equal(requestRestored.requests, canceled.requests);
  assert.deepEqual(requestRestored.requests, offer.requests);
});
