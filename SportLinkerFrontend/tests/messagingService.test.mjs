import assert from "node:assert/strict";
import { test } from "node:test";
import { registerHooks } from "node:module";

const calls = [];
let response = { data: true };
globalThis.messagingApiTestClient = Object.fromEntries(["get", "post", "delete"].map((method) => [method, async (...args) => { calls.push([method, ...args]); return response; }]));
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "./apiClient" && /\/(conversationService|friendService)\.js$/.test(context.parentURL ?? "")) return { url: "mock:messaging-client", shortCircuit: true };
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "mock:messaging-client") return { format: "module", source: "export default globalThis.messagingApiTestClient;", shortCircuit: true };
    return nextLoad(url, context);
  },
});
const { default: conversations } = await import("../src/api/conversationService.js");
const { default: friends } = await import("../src/api/friendService.js");
hooks.deregister();
delete globalThis.messagingApiTestClient;

test("all six messaging routes use exact methods/bodies and never send the current user ID", async () => {
  calls.length = 0;
  const signal = new AbortController().signal;
  response = { data: [] };
  await friends.getFriends({ signal });
  await conversations.getConversations({ signal });
  await conversations.getMessages(8, { signal, cursor: { sendAt: "2026-11-09T12:00:00Z", id: 30 } });
  response = { data: { conversationId: 8 } };
  const first = { receiverId: 12, content: "Cześć", clientMessageId: "uuid" };
  assert.equal(await conversations.createPrivate(first, { signal }), 8);
  response = { data: true };
  const next = { conversationId: 8, content: "Druga", clientMessageId: "uuid-2" };
  await conversations.sendMessage(next, { signal });
  await conversations.deleteHistory(8, { signal });
  assert.deepEqual(calls, [
    ["get", "/Friend", { signal }],
    ["get", "/Conversation", { signal }],
    ["get", "/Conversation/8/messages", { signal, params: { pageSize: 30, beforeSendAt: "2026-11-09T12:00:00Z", beforeId: 30 } }],
    ["post", "/Conversation/private", first, { signal }],
    ["post", "/Conversation/messages", next, { signal }],
    ["delete", "/Conversation/8/history", { signal }],
  ]);
});

test("false confirmation and invalid private-conversation responses remain failures", async () => {
  response = { data: false };
  await assert.rejects(conversations.sendMessage({}), (error) => error.response.data === false);
  await assert.rejects(conversations.deleteHistory(8));
  for (const data of [true, { conversationId: 0 }, { conversationId: "8" }, {}]) {
    response = { data };
    await assert.rejects(conversations.createPrivate({}));
  }
});
