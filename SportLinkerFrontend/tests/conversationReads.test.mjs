import assert from "node:assert/strict";
import { test } from "node:test";
import { hasReadMessage, mergeReadStates, getMessageReaders, normalizeReadState } from "../src/utils/conversationReads.js";
import { initialMessagingState, messagingReducer as reduce } from "../src/utils/messagingState.js";
import { normalizeConversation, normalizeMessagesPage } from "../src/utils/messaging.js";

const msg = (id, extra = {}) => ({ id, senderId: 12, senderName: "Anna", timestamp: `2026-11-16T12:${String(id).padStart(2, "0")}:00Z`, text: `Wiadomość ${id}`, ...extra });
const receipt = (id, extra = {}) => ({ conversationId: 8, participantId: 1, userId: 2, joinedAt: "2026-11-16T10:00:00Z", leftAt: null, lastReadMessageId: id, lastReadMessageSendAt: msg(id).timestamp, lastReadAt: "2026-11-16T13:00:00Z", ...extra });
const chat = (extra = {}) => normalizeConversation({ id: 8, type: "Private", name: "Anna", recipientUserId: 12, unreadCount: 0, ...extra });
const start = (extra = {}) => ({ ...initialMessagingState(2), conversations: [chat(extra)] });
const receive = (state, message, conversationId = 8) => reduce(state, { type: "message/received", userId: 2, conversationId, message });
const read = (state, value) => reduce(state, { type: "conversation/read", userId: 2, read: value });
const page = (state, items, readStates = [], older = false) => reduce(state, { type: "thread/success", key: "conversation:8", older, page: { items, readStates, hasMore: false, cursor: null } });

test("read cursors use timestamp then ID, including equal timestamps and UTC without suffix", () => {
  const cursor = receipt(4, { lastReadMessageSendAt: "2026-11-16T12:04:00" });
  assert.equal(hasReadMessage(cursor, msg(4)), true);
  assert.equal(hasReadMessage(cursor, msg(3, { id: 99 })), true);
  assert.equal(hasReadMessage(cursor, msg(4, { id: 5 })), false);
  assert.equal(hasReadMessage(cursor, msg(5, { id: 1 })), false);
  assert.equal(hasReadMessage(cursor, msg("local:x")), false);
});

test("readers are unique, exclude viewer and sender and respect each participation interval", () => {
  const reads = [receipt(5), receipt(5, { userId: 12, participantId: 2 }), receipt(5, { userId: 13, participantId: 3, leftAt: msg(4).timestamp }), receipt(5, { userId: 14, participantId: 4, joinedAt: msg(4).timestamp })];
  assert.deepEqual(getMessageReaders(msg(3), reads, 2).map((r) => r.userId), [13]);
  assert.deepEqual(getMessageReaders(msg(4), reads, 2).map((r) => r.userId), [14]);
  assert.equal(getMessageReaders(msg(3), [...reads, { ...reads[2], participantId: 5 }], 2).length, 1);
});

test("older HTTP snapshots and duplicate receipts cannot regress a live read cursor or reopen a period", () => {
  const newest = receipt(5, { leftAt: "2026-11-16T14:00:00Z" });
  const merged = mergeReadStates([newest], [receipt(2), receipt(5)]);
  assert.equal(merged[0].lastReadMessageId, 5);
  assert.equal(merged[0].leftAt, newest.leftAt);
  assert.equal(normalizeMessagesPage({ items: [], readStates: [newest] }).readStates.length, 1);
});

test("incomplete read events are ignored rather than causing repeated read POSTs", () => {
  assert.deepEqual(mergeReadStates([], [receipt(5, { lastReadMessageSendAt: null })]), []);
});

test("ParticipantId zero resolves only against one matching conversation, user and precise join time", () => {
  const incoming = receipt(5, { participantId: 0, joinedAt: "2026-11-10T10:33:43.9360102Z" });
  const snapshot = { ...incoming, participantId: 91, lastReadMessageId: null, lastReadMessageSendAt: null };
  assert.equal(normalizeReadState(incoming, [snapshot]).participantId, 91);
  assert.equal(normalizeReadState(incoming, [{ ...snapshot, userId: 3 }]), null);
  assert.equal(normalizeReadState(incoming, [{ ...snapshot, conversationId: 9 }]), null);
  assert.equal(normalizeReadState(incoming, [{ ...snapshot, joinedAt: "2026-11-10T10:33:43.9360103Z" }]), null);
  assert.equal(normalizeReadState(incoming, [snapshot, { ...snapshot, participantId: 92 }]), null);
  assert.equal(normalizeReadState(incoming, []), null);
  assert.equal(mergeReadStates([snapshot], [incoming])[0].lastReadMessageId, 5);
});

test("SignalR receipt with zero ID advances the loaded period and clears unread without duplicating it", () => {
  let state = page(start({ unreadCount: 1, lastMessageId: 5, lastMessageTime: msg(5).timestamp, lastMessageText: "Test" }),
    [msg(5)], [receipt(4)]);
  state = read(state, receipt(5, { participantId: 0 }));
  assert.equal(state.conversations[0].unreadCount, 0);
  assert.equal(state.threads["conversation:8"].readStates.length, 1);
  assert.equal(state.threads["conversation:8"].readStates[0].participantId, 1);
  assert.equal(state.threads["conversation:8"].readStates[0].lastReadMessageId, 5);
});

test("off-screen messages mark the right conversation once; own messages never increment unread", () => {
  let state = { ...start(), activeChat: chat({ id: 9 }) };
  state = receive(state, msg(1));
  state = receive(state, msg(1));
  state = receive(state, msg(2, { senderId: 2, isOwnMessage: true }));
  assert.equal(state.conversations[0].unreadCount, 1);
  assert.equal(state.activeChat.id, 9);
  assert.equal(state.conversations[0].lastMessage.id, 2);
});

test("read acknowledgements clear only through their cursor and preserve a newer arrival", () => {
  let state = receive(receive(start(), msg(1)), msg(2));
  state = read(state, receipt(1));
  assert.equal(state.conversations[0].unreadCount, 1);
  state = read(state, receipt(2));
  assert.equal(state.conversations[0].unreadCount, 0);
  state = receive(state, msg(3));
  state = read(state, receipt(1));
  assert.equal(state.conversations[0].unreadCount, 1);
});

test("reading on another device before a delayed MessageReceived prevents false unread", () => {
  let state = read(start(), receipt(3));
  state = receive(state, msg(2));
  assert.equal(state.conversations[0].unreadCount, 0);
});

test("another user's read never clears my unread marker", () => {
  const state = read(receive(start(), msg(1)), receipt(1, { participantId: 3, userId: 13 }));
  assert.equal(state.conversations[0].unreadCount, 1);
});

test("initial unread count survives opening/loading a conversation until read is confirmed", () => {
  let state = start({ unreadCount: 5, lastMessageId: 5, lastMessageTime: msg(5).timestamp, lastMessageText: "Test" });
  state = reduce(state, { type: "select", chat: state.conversations[0] });
  state = page(state, [msg(4), msg(5)], [receipt(3)]);
  assert.equal(state.conversations[0].unreadCount, 5);
  state = read(state, receipt(5));
  assert.equal(state.conversations[0].unreadCount, 0);
});

test("pagination cannot overwrite newer SignalR receipts", () => {
  let state = read(start(), receipt(5, { userId: 12 }));
  state = page(state, [msg(1)], [receipt(2, { userId: 12 })], true);
  assert.equal(state.threads["conversation:8"].readStates[0].lastReadMessageId, 5);
});

test("late initial list merges server unread baseline with newer live messages", () => {
  let state = receive(start(), msg(5));
  state = reduce(state, { type: "list/success", list: "conversations", revision: 0, items: [chat({ unreadCount: 3, lastMessageId: 4, lastMessageTime: msg(4).timestamp, lastMessageText: "Wcześniej" })] });
  assert.equal(state.conversations[0].unreadCount, 4);
  assert.equal(state.conversations[0].lastMessage.id, 5);
  state = receive(state, msg(3)); // Already accounted for in the initial snapshot.
  assert.equal(state.conversations[0].unreadCount, 4);
});

test("late list snapshots cannot restore unread after a newer read confirmation", () => {
  let state = read(receive(start(), msg(5)), receipt(5));
  state = reduce(state, { type: "list/success", list: "conversations", revision: 0, items: [chat({ unreadCount: 3, lastMessageId: 4, lastMessageTime: msg(4).timestamp, lastMessageText: "Wcześniej" })] });
  assert.equal(state.conversations[0].unreadCount, 0);
});

test("a read cursor clearing the snapshot baseline must not clear later live arrivals", () => {
  let state = read(start(), receipt(4));
  state = receive(state, msg(5));
  state = reduce(state, { type: "list/success", list: "conversations", revision: 0, items: [chat({ unreadCount: 3, lastMessageId: 4, lastMessageTime: msg(4).timestamp, lastMessageText: "Wcześniej" })] });
  assert.equal(state.conversations[0].unreadCount, 1);
  assert.equal(state.conversations[0].lastMessage.id, 5);
});

test("new conversations are created from events without fetching their list", () => {
  const state = receive(initialMessagingState(2), msg(1), 99);
  assert.equal(state.conversations[0].id, 99);
  assert.equal(state.conversations[0].unreadCount, 1);
  assert.equal(state.conversations[0].provisional, true);
});

test("separate participation periods retain their cursors and unread older history", () => {
  let state = start({ unreadCount: 2 });
  state = page(state, [msg(1), msg(5)], [receipt(0, { lastReadMessageId: null, lastReadMessageSendAt: null, leftAt: msg(2).timestamp }), receipt(3, { participantId: 2, joinedAt: msg(3).timestamp })]);
  state = read(state, receipt(5, { participantId: 2, joinedAt: msg(3).timestamp }));
  assert.equal(state.conversations[0].unreadCount, 1);
  assert.equal(state.threads["conversation:8"].readStates.length, 2);
});
