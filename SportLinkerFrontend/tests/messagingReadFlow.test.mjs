import assert from "node:assert/strict";
import { test } from "node:test";
import { registerHooks } from "node:module";
import { createHookHarness } from "./helpers/hookHarness.mjs";

const root = new URL("../src/hooks/useMessaging.js", import.meta.url).href;
const bridge = { harness: null, messages: null, reads: null, service: null };
globalThis.readFlowTest = bridge;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === root) {
      if (specifier === "react") return { url: "mock:read-react", shortCircuit: true };
      if (specifier.endsWith("/apiErrorHelper")) return { url: "mock:read:apiErrorHelper", shortCircuit: true };
      if (specifier.includes("/utils/")) return { url: new URL(`${specifier}.js`, root).href, shortCircuit: true };
      return { url: `mock:read:${specifier}`, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "mock:read-react") return { format: "module", shortCircuit: true, source: "const b=globalThis.readFlowTest; export const useRef=(...a)=>b.harness.react.useRef(...a); export const useReducer=(...a)=>b.harness.react.useReducer(...a); export const useEffect=(...a)=>b.harness.react.useEffect(...a); export const useCallback=(...a)=>b.harness.react.useCallback(...a);" };
    if (url.startsWith("mock:read:")) {
      let source = "export default () => ({});";
      if (url.endsWith("apiErrorHelper")) source = "export const getErrorMessage=(_,fallback)=>fallback;";
      if (url.endsWith("/friendService")) source = "export default {getFriends: (...a)=>globalThis.readFlowTest.service.getFriends(...a)};";
      if (url.endsWith("/conversationService")) source = "export default new Proxy({}, {get:(_,key)=>(...a)=>globalThis.readFlowTest.service[key](...a)});";
      if (url.endsWith("/ToastContext")) source = "const showToast=value=>globalThis.readFlowTest.toasts?.push(value); export const useToast=()=>({showToast});";
      if (url.endsWith("/useChat")) source = "const b=globalThis.readFlowTest; const subscribeMessages=f=>{b.messages=f;return()=>{b.messages=null}}; const subscribeReads=f=>{b.reads=f;return()=>{b.reads=null}}; const subscribePresence=()=>()=>{}; export default ()=>({subscribeMessages,subscribeReads,subscribePresence});";
      if (url.endsWith("/useConversationTyping")) source = "const typingUsers=[]; export default ()=>({typingUsers});";
      return { format: "module", shortCircuit: true, source };
    }
    return nextLoad(url, context);
  },
});
const { default: useMessaging } = await import(root);
hooks.deregister();

const message = (id) => ({ id, senderId: 12, content: "Cześć", sendAt: `2026-11-16T12:${id}:00Z` });
const receipt = (id) => ({ conversationId: 8, participantId: 1, userId: 2, joinedAt: "2026-11-16T10:00:00Z", leftAt: null, lastReadMessageId: id, lastReadMessageSendAt: message(id).sendAt });

test("SignalR messages and receipts update locally; opening history is the only extra GET; read POSTs are serialized", async () => {
  const calls = [];
  let finishFirstRead;
  bridge.service = {
    async getFriends() { calls.push("friends"); return []; },
    async getConversations() { calls.push("conversations"); return [{ id: 8, name: "Anna", type: "Private", recipientUserId: 12, unreadCount: 0 }]; },
    async getMessages() { calls.push("history"); return { items: [], hasMore: false, readStates: [] }; },
    async markRead(id, messageId) {
      calls.push(`read:${messageId}`);
      if (messageId === 10) return new Promise((resolve) => { finishFirstRead = () => resolve(receipt(10)); });
      return receipt(messageId);
    },
  };
  const harness = bridge.harness = createHookHarness();
  const user = { id: 2 };
  harness.render = () => useMessaging(user);
  await harness.flush();
  assert.deepEqual(calls, ["friends", "conversations"]);
  bridge.messages({ conversationId: 8, message: message(10) });
  await harness.flush();
  assert.equal(harness.result.chatPeople.conversations[0].unreadCount, 1);
  assert.equal(calls.length, 2);
  harness.result.selectChat(harness.result.chatPeople.conversations[0]);
  await harness.flush();
  assert.deepEqual(calls, ["friends", "conversations", "history"]);
  const pending = harness.result.markRead(harness.result.thread.items[0]);
  bridge.messages({ conversationId: 8, message: message(11) });
  await harness.flush();
  await harness.result.markRead(harness.result.thread.items.at(-1));
  assert.deepEqual(calls.slice(3), ["read:10"]);
  finishFirstRead();
  await pending;
  await harness.flush();
  assert.deepEqual(calls.slice(3), ["read:10", "read:11"]);
  assert.equal(harness.result.chatPeople.conversations[0].unreadCount, 0);
  bridge.reads({ ...receipt(11), participantId: 2, userId: 13 });
  bridge.reads(receipt(10));
  await harness.flush();
  assert.equal(harness.result.thread.readStates.length, 2);
  assert.equal(harness.result.thread.readStates[0].lastReadMessageId, 11);
  await harness.result.markRead(harness.result.thread.items.at(-1));
  assert.deepEqual(calls, ["friends", "conversations", "history", "read:10", "read:11"]);
  harness.dispose();
  assert.equal(bridge.reads, null);
});

test("a valid read acknowledgement clears the initial unread marker without GET; malformed data reports the contract error", async () => {
  const calls = [];
  bridge.toasts = [];
  let invalid = true;
  bridge.service = {
    async getFriends() { calls.push("friends"); return []; },
    async getConversations() { calls.push("conversations"); return [{ id: 8, name: "Anna", type: "Private", recipientUserId: 12,
      unreadCount: 7, lastMessageId: 20, lastMessageText: "Cześć", lastMessageTime: message(20).sendAt }]; },
    async getMessages() { calls.push("history"); return { items: [message(20)], hasMore: false,
      readStates: [{ ...receipt(20), lastReadMessageId: null, lastReadMessageSendAt: null }] }; },
    async markRead() {
      calls.push("read");
      if (invalid) throw Object.assign(new Error("Serwer zwrócił nieprawidłowe dane odczytu wiadomości."), {
        code: "INVALID_READ_RESPONSE", response: { status: 200 },
      });
      return receipt(20);
    },
  };
  const harness = bridge.harness = createHookHarness();
  const user = { id: 2 };
  harness.render = () => useMessaging(user);
  await harness.flush();
  harness.result.selectChat(harness.result.chatPeople.conversations[0]);
  await harness.flush();
  await harness.result.markRead(harness.result.thread.items[0]);
  await harness.flush();
  assert.equal(harness.result.chatPeople.conversations[0].unreadCount, 7);
  assert.equal(bridge.toasts[0].detail, "Serwer zwrócił nieprawidłowe dane odczytu wiadomości.");
  invalid = false;
  await harness.result.markRead(harness.result.thread.items[0]);
  await harness.flush();
  assert.equal(harness.result.chatPeople.conversations[0].unreadCount, 0);
  assert.equal(harness.result.activeChat.unreadCount, 0);
  assert.deepEqual(calls, ["friends", "conversations", "history", "read", "read"]);
  await harness.result.markRead(harness.result.thread.items[0]);
  assert.equal(calls.length, 5);
  harness.dispose();
});
