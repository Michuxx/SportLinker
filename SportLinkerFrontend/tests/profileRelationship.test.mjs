import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeProfileRelationship, prepareFriendAction, applyFriendAction } from "../src/utils/profileRelationship.js";

test("profile relationships support API enum names and numbers, unknown states hide actions", () => {
  const expected = ["anonymous", "self", "none", "friends", "requestsent", "requestreceived"];
  ["Anonymous", "Self", "None", "Friends", "RequestSent", "RequestReceived"].forEach((value, index) => {
    assert.equal(normalizeProfileRelationship(value), expected[index]);
    assert.equal(normalizeProfileRelationship(index), expected[index]);
  });
  for (const value of [null, undefined, "unknown", -1, 99]) assert.equal(normalizeProfileRelationship(value), "anonymous");
});

test("sending uses only the recipient ID, accepting and rejecting use only the request ID", () => {
  assert.deepEqual(prepareFriendAction("send", { relationship: "None", userId: "12", friendRequestId: 99, viewerId: 3 }), { receiverId: 12 });
  for (const action of ["accept", "reject"]) {
    assert.deepEqual(prepareFriendAction(action, { relationship: "RequestReceived", userId: 12, friendRequestId: 99, viewerId: 3 }), { friendRequestId: 99 });
  }
});

test("invalid IDs and actions outside the current relationship cannot send requests", () => {
  for (const id of [null, undefined, 0, -1, 1.5, "bad"]) {
    assert.equal(prepareFriendAction("send", { relationship: "none", userId: id }), null);
    assert.equal(prepareFriendAction("accept", { relationship: "requestreceived", friendRequestId: id }), null);
  }
  for (const relationship of ["anonymous", "self", "friends", "requestsent", "requestreceived"]) {
    assert.equal(prepareFriendAction("send", { relationship, userId: 12 }), null);
  }
  assert.equal(prepareFriendAction("accept", { relationship: "RequestSent", friendRequestId: 99 }), null);
  assert.equal(prepareFriendAction("cancel", { relationship: "RequestReceived", friendRequestId: 99 }), null);
  assert.equal(prepareFriendAction("delete", { relationship: "None", userId: 12 }), null);
});

test("successful actions update the relationship locally and preserve profile data", () => {
  const profile = { userName: "Anna", relationship: "requestreceived", friendRequestId: 99, favouriteSports: [{ id: 1, name: "Tenis" }] };
  for (const [action, relationship] of [["send", "requestsent"], ["accept", "friends"], ["reject", "none"], ["cancel", "none"], ["delete", "none"]]) {
    const updated = applyFriendAction(profile, action, 123);
    assert.equal(updated.relationship, relationship);
    assert.equal(updated.friendRequestId, action === "send" ? 123 : null);
    assert.equal(updated.userName, profile.userName);
    assert.deepEqual(updated.favouriteSports, profile.favouriteSports);
  }
  assert.equal(profile.friendRequestId, 99);
  assert.equal(profile.relationship, "requestreceived");
});

test("the ID returned by send allows cancellation immediately without a profile reload", () => {
  const sent = applyFriendAction({ userId: 12, relationship: "none", friendRequestId: null }, "send", 123);
  assert.deepEqual(prepareFriendAction("cancel", sent), { requestId: 123 });
  const cancelled = applyFriendAction(sent, "cancel", true);
  assert.equal(cancelled.relationship, "none");
  assert.equal(cancelled.friendRequestId, null);
  assert.deepEqual(prepareFriendAction("send", cancelled), { receiverId: 12 });
});

test("cancel uses the request ID and deleting a friend uses the viewed user ID", () => {
  assert.deepEqual(prepareFriendAction("cancel", { relationship: "RequestSent", friendRequestId: "99", userId: 12, viewerId: 3 }), { requestId: 99 });
  assert.deepEqual(prepareFriendAction("delete", { relationship: "Friends", userId: "12", friendRequestId: 99, viewerId: 3 }), { friendId: 12 });
  for (const id of [null, undefined, 0, -1, 1.5, "bad"]) {
    assert.equal(prepareFriendAction("cancel", { relationship: "requestsent", friendRequestId: id }), null);
    assert.equal(prepareFriendAction("delete", { relationship: "friends", userId: id }), null);
  }
});
