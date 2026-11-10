import assert from "node:assert/strict";
import { test } from "node:test";
import { chatKey, normalizeFriend, normalizeConversation, normalizeMessage, normalizeMessagesPage, mergeMessages, friendChat } from "../src/utils/messaging.js";
import { initialMessagingState, messagingReducer as reduce } from "../src/utils/messagingState.js";

const friend = normalizeFriend({ friendshipId: 99, userId: 12, name: "Anna", imageUrl: "/anna.webp", conversationId: null });
const chat = normalizeConversation({ id: 8, type: "Private", name: "Anna", recipientUserId: 12, canSendMessages: true });
const message = { id: "local:uuid", clientMessageId: "uuid", text: "Cześć", timestamp: "2026-11-09T12:00:00Z", senderName: "Ja", isOwnMessage: true, status: "pending" };

test("API models map to the existing mock UI shape, including read-only permissions", () => {
  assert.equal(friend.id, 99);
  assert.equal(friend.userId, 12);
  const result = normalizeConversation({ id: 8, type: "Private", canSendMessages: false, lastMessageSenderName: "Anna", lastMessageText: "Cześć", lastMessageTime: message.timestamp });
  assert.equal(result.type, "private");
  assert.equal(result.canSendMessages, false);
  assert.deepEqual(result.lastMessage, { id: undefined, name: "Anna", text: "Cześć", time: message.timestamp });
  assert.equal(normalizeConversation({ type: 1 }).type, "group");
  const mock = { id: 3, type: "private", lastMessage: { name: "Anna", text: "Test", time: message.timestamp } };
  assert.deepEqual(normalizeConversation(mock).lastMessage, mock.lastMessage);
  const api = normalizeMessage({ id: 1, content: "Test", sendAt: message.timestamp, isOwnMessage: true, senderImageUrl: "/profiles/anna.webp" });
  assert.equal(api.text, "Test");
  assert.equal(api.timestamp, message.timestamp);
  assert.equal(api.senderImageUrl, "/profiles/anna.webp");
  assert.equal(normalizeMessage({ imageUrl: "/profiles/legacy.webp" }).senderImageUrl, "/profiles/legacy.webp");
});

test("selecting a friend uses the conversation ID, never the friendship or user ID", () => {
  assert.equal(friendChat({ ...friend, conversationId: 8 }, [chat]), chat);
  assert.equal(friendChat(friend, [chat]), chat);
  const draft = friendChat(friend, []);
  assert.equal(draft.id, null);
  assert.equal(draft.recipientUserId, 12);
  assert.equal(chatKey(draft), "friend:12");
  assert.equal(friendChat({ ...friend, conversationId: 8 }, []).id, 8);
});

test("pagination preserves both cursor fields and supports old mock arrays", () => {
  const cursor = { sendAt: message.timestamp, id: 40 };
  const page = normalizeMessagesPage({ items: [{ id: 40, content: "Starsza", sendAt: message.timestamp }], hasMore: true, nextCursor: cursor });
  assert.deepEqual(page.cursor, cursor);
  assert.equal(page.hasMore, true);
  assert.equal(page.items[0].text, "Starsza");
  assert.equal(normalizeMessagesPage([message]).items[0].text, "Cześć");
  assert.throws(() => normalizeMessagesPage({}));
});

test("server echo replaces local UUID bubble without duplication and sorts by time then ID", () => {
  const server = normalizeMessage({ id: 50, clientMessageId: "uuid", content: "Cześć", sendAt: message.timestamp, isOwnMessage: true });
  const merged = mergeMessages([message], [server]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, 50);
  assert.equal(merged[0].status, "sent");
  assert.deepEqual(mergeMessages(merged, [server]), merged);
  assert.deepEqual(mergeMessages([{ ...server, id: 51, clientMessageId: "other" }], [server]).map((item) => item.id), [50, 51]);
});

test("first send promotes the draft, updates the friend and sidebar, and needs no messages GET", () => {
  const draft = friendChat(friend, []);
  let state = { ...initialMessagingState(2), friends: [friend], activeChat: draft };
  state = reduce(state, { type: "thread/message", key: chatKey(draft), message });
  state = reduce(state, { type: "send/success", key: chatKey(draft), chat: draft, conversationId: 8, message });
  assert.equal(state.activeChat.id, 8);
  assert.equal(state.friends[0].conversationId, 8);
  assert.equal(state.conversations.length, 1);
  assert.equal(state.conversations[0].lastMessage.text, "Cześć");
  assert.equal(state.threads["conversation:8"].loaded, true);
  assert.equal(state.threads["conversation:8"].items[0].status, "sent");
  assert.equal(state.threads["friend:12"], undefined);
});

test("send completion updates the original conversation without stealing a different selection", () => {
  const other = { ...chat, id: 9, recipientUserId: 13, name: "Piotr" };
  let state = { ...initialMessagingState(2), conversations: [chat, other], activeChat: other };
  state = reduce(state, { type: "send/success", key: chatKey(chat), chat, conversationId: 8, message });
  assert.equal(state.activeChat.id, 9);
  assert.equal(state.threads["conversation:8"].items.length, 1);
  assert.equal(state.threads["conversation:9"], undefined);
});

test("loading older messages and refreshing do not discard local sent messages or reset the older cursor", () => {
  let state = initialMessagingState(2);
  const key = "conversation:8";
  state = reduce(state, { type: "thread/success", key, page: { items: [{ ...message, id: 10 }], hasMore: true, cursor: { sendAt: message.timestamp, id: 10 } } });
  const older = { ...message, id: 5, clientMessageId: "older", timestamp: "2026-11-08T12:00:00Z" };
  state = reduce(state, { type: "thread/success", key, older: true, page: { items: [older], hasMore: false, cursor: null } });
  state = reduce(state, { type: "thread/success", key, page: { items: [{ ...message, id: 10 }], hasMore: true, cursor: { id: 10 } } });
  assert.deepEqual(state.threads[key].items.map((item) => item.id), [5, 10]);
  assert.equal(state.threads[key].hasMore, false);
  assert.equal(state.threads[key].cursor, null);
});

test("failed send retains its content and UUID for an idempotent retry", () => {
  let state = reduce(initialMessagingState(2), { type: "thread/message", key: "conversation:8", message });
  state = reduce(state, { type: "thread/message", key: "conversation:8", message: { ...message, status: "failed" } });
  assert.equal(state.threads["conversation:8"].items.length, 1);
  assert.equal(state.threads["conversation:8"].items[0].clientMessageId, "uuid");
  assert.equal(state.threads["conversation:8"].items[0].text, "Cześć");
});

test("history deletion removes only that conversation and late list GET cannot restore it", () => {
  const other = { ...chat, id: 9 };
  let state = { ...initialMessagingState(2), conversations: [chat, other], activeChat: chat };
  state = reduce(state, { type: "history/deleted", id: 8, key: chatKey(chat) });
  state = reduce(state, { type: "list/success", list: "conversations", revision: 0, items: [chat, other] });
  assert.deepEqual(state.conversations.map((item) => item.id), [9]);
  assert.equal(state.activeChat, null);
});

test("removing a friend disables private sending and a late send response cannot re-enable it", () => {
  let state = { ...initialMessagingState(2), friends: [friend], activeChat: chat, conversations: [chat] };
  state = reduce(state, { type: "friend/deleted", id: 99, userId: 12 });
  state = reduce(state, { type: "send/success", key: chatKey(chat), chat, conversationId: 8, message });
  assert.equal(state.activeChat.canSendMessages, false);
  assert.equal(state.conversations[0].canSendMessages, false);
  assert.equal(state.friends.length, 0);
});

test("a late initial list fetch cannot overwrite a newly created conversation", () => {
  const draft = friendChat(friend, []);
  let state = { ...initialMessagingState(2), friends: [friend], activeChat: draft };
  state = reduce(state, { type: "send/success", key: chatKey(draft), chat: draft, conversationId: 8, message });
  state = reduce(state, { type: "list/success", list: "conversations", revision: 0, items: [] });
  state = reduce(state, { type: "list/success", list: "friends", revision: 0, items: [friend] });
  assert.equal(state.conversations[0].id, 8);
  assert.equal(state.friends[0].conversationId, 8);
});

test("list refresh updates the active conversation's server permissions", () => {
  const state = { ...initialMessagingState(2), activeChat: chat, conversations: [chat] };
  const result = reduce(state, { type: "list/success", list: "conversations", revision: 0, items: [{ ...chat, canSendMessages: false }] });
  assert.equal(result.activeChat.canSendMessages, false);
});

test("manual message refresh updates the sidebar preview and exposes any gap older than the latest page", () => {
  const key = chatKey(chat);
  let state = { ...initialMessagingState(2), conversations: [chat], activeChat: chat };
  state = reduce(state, { type: "thread/success", key, page: { items: [{ ...message, id: 1, clientMessageId: "old" }], hasMore: false, cursor: null } });
  const cursor = { sendAt: "2026-11-10T12:00:00Z", id: 100 };
  state = reduce(state, { type: "thread/success", key, page: { items: [{ ...message, id: 100, clientMessageId: "new", text: "Nowa wiadomość", timestamp: cursor.sendAt }], hasMore: true, cursor } });
  assert.equal(state.conversations[0].lastMessage.text, "Nowa wiadomość");
  assert.equal(state.threads[key].hasMore, true);
  assert.deepEqual(state.threads[key].cursor, cursor);
});
