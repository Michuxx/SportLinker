import assert from "node:assert/strict";
import { test } from "node:test";
import { applyOfferJoin } from "../src/utils/offerJoin.js";

const offer = { id: 1, mode: "public", status: null, maxPeople: 2, members: [{ id: 2 }] };
const user = { id: 3, name: "Jan", profileImage: "/profiles/jan.webp" };
const joinDate = "2026-10-25T12:00:00Z";

test("public join updates participants, status and free places without changing the previous state", () => {
  const joined = applyOfferJoin(offer, user, joinDate);
  assert.equal(joined.status, "accepted");
  assert.equal(joined.members.length, 2);
  assert.equal(joined.maxPeople - joined.members.length, 0);
  assert.deepEqual(joined.members[1], {
    id: 3, userId: 3, name: "Jan", image: "/profiles/jan.webp", joinDate,
  });
  assert.equal(offer.members.length, 1);
  assert.equal(offer.status, null);
});

test("private join sets pending status and leaves participant and place counts unchanged", () => {
  const joined = applyOfferJoin({ ...offer, mode: "private" }, user, joinDate);
  assert.equal(joined.status, "pending");
  assert.equal(joined.members, offer.members);
  assert.equal(joined.maxPeople - joined.members.length, 1);
});

test("reapplying a confirmed join never duplicates participants", () => {
  const joined = applyOfferJoin(offer, user, joinDate);
  const repeated = applyOfferJoin(joined, { ...user, id: "3" }, joinDate);
  assert.equal(repeated.members, joined.members);
  assert.equal(repeated.members.length, 2);
});
