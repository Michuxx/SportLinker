import assert from "node:assert/strict";
import { test } from "node:test";
import { collectChatImages } from "../src/utils/chatImages.js";

const base = { user: { id: 2 }, friends: [], conversations: [], messages: [], activeChat: null };

test("collects actual user IDs for profile photos, never conversation or friendship IDs", () => {
  const result = collectChatImages({ ...base,
    friends: [{ id: 99, userId: 12 }],
    conversations: [{ id: 150, type: "private", recipientUserId: 12 }, { id: 200, type: "group" }],
    messages: [{ id: 300, senderId: 13 }, { id: 301, senderId: 12 }, { senderId: null }],
  });
  assert.deepEqual(result.ids, ["12", "13", "2"]);
  assert.deepEqual(result.known, {});
});

test("reuses images already returned by the API and separates own and other senders", () => {
  const result = collectChatImages({ ...base,
    user: { id: 2, profileImage: "/own.webp" },
    friends: [{ userId: 12, imageUrl: "/friend.webp" }],
    conversations: [{ type: "private", recipientUserId: 13, imageUrl: "/recipient.webp" }],
    messages: [{ senderId: 14, senderImageUrl: "/sender.webp" }],
  });
  assert.deepEqual(result.known, { 2: "/own.webp", 12: "/friend.webp", 13: "/recipient.webp", 14: "/sender.webp" });
});

test("finds a private recipient while lists are still loading and ignores deleted/invalid senders", () => {
  const result = collectChatImages({ ...base,
    activeChat: { id: 150, type: "private", recipientUserId: 12 },
    messages: [{ senderId: null }, { senderId: 0 }, { senderId: -1 }, { senderId: "bad" }],
  });
  assert.deepEqual(result.ids, ["12", "2"]);
});

test("empty DTO photo fields do not discard an image already known from another source", () => {
  const result = collectChatImages({ ...base,
    friends: [{ userId: 12, imageUrl: "/friend.webp" }],
    activeChat: { type: "private", recipientUserId: 12, imageUrl: null },
    messages: [{ senderId: 12, senderImageUrl: "" }],
  });
  assert.equal(result.known[12], "/friend.webp");
});
