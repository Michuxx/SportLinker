import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import { transformSync } from "esbuild";
import { createHookHarness } from "./helpers/hookHarness.mjs";

const receiptsUrl = new URL("../src/components/messagesSection/conversation/messageReadReceipts/MessageReadReceipts.jsx", import.meta.url).href;
const buttonUrl = new URL("../src/components/component-items/button/ChatConversationButton.jsx", import.meta.url).href;
const visibilityUrl = new URL("../src/hooks/useVisibleMessages.js", import.meta.url).href;
const bridge = { harness: null };
globalThis.readViewTest = bridge;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === "mock:read-view-avatar" && specifier === "react") return nextResolve(specifier, { ...context, parentURL: import.meta.url });
    if ([receiptsUrl, buttonUrl].includes(context.parentURL) && specifier.startsWith(".")) {
      return { url: specifier.endsWith(".css") ? "mock:read-view-css" : specifier.endsWith("useDateFormat") ? "mock:read-view-date" : "mock:read-view-avatar", shortCircuit: true };
    }
    if (context.parentURL === visibilityUrl) {
      if (specifier === "react") return { url: "mock:read-view-react", shortCircuit: true };
      return { url: new URL(`${specifier}.js`, visibilityUrl).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "mock:read-view-react") return { format: "module", shortCircuit: true, source: "export const useEffect=(...a)=>globalThis.readViewTest.harness.react.useEffect(...a);" };
    if (url === "mock:read-view-css") return { format: "module", shortCircuit: true, source: "export default {};" };
    if (url === "mock:read-view-date") return { format: "module", shortCircuit: true, source: 'export default ()=>({date:"16.11.2026"});' };
    if (url === "mock:read-view-avatar") return { format: "module", shortCircuit: true, source: 'import React from "react"; export default props=>React.createElement("img",{src:props.image,alt:"Avatar"});' };
    if ([receiptsUrl, buttonUrl].includes(url)) return { format: "module", shortCircuit: true, source: transformSync(readFileSync(new URL(url), "utf8"), { loader: "jsx", jsx: "automatic", format: "esm" }).code };
    return nextLoad(url, context);
  },
});
const { default: Receipts } = await import(receiptsUrl);
const { default: Button } = await import(buttonUrl);
const { default: useVisibleMessages } = await import(visibilityUrl);
hooks.deregister();

test("unread conversations show their count in the badge and accessible description", () => {
  const unread = renderToStaticMarkup(React.createElement(Button, { name: "Anna", unreadCount: 2, text: "Cześć" }));
  assert.match(unread, /unread-chat-profile-btn/);
  assert.match(unread, /class="chat-unread-dot"[^>]*>2<\/span>/);
  assert.match(unread, /Anna, nieprzeczytane wiadomości: 2/);
  const seen = renderToStaticMarkup(React.createElement(Button, { name: "Anna", unreadCount: 0 }));
  assert.doesNotMatch(seen, /chat-unread-dot/);
});

test("read receipts reuse cached photos and names with a bounded avatar row", () => {
  assert.equal(renderToStaticMarkup(React.createElement(Receipts)), "");
  const readers = Array.from({ length: 7 }, (_, i) => ({ userId: i + 1 }));
  const html = renderToStaticMarkup(React.createElement(Receipts, { readers, images: { 1: "/anna.webp" }, names: { 1: "Anna" } }));
  assert.match(html, /Przeczytane przez: Anna/);
  assert.match(html, /src="\/anna.webp"/);
  assert.equal((html.match(/class="message-reader-avatar"/g) ?? []).length, 5);
  assert.match(html, /\+2/);
});

test("reads require focus, visible tab and bubble in viewport; disabled/unmounted views stop marking", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const previous = { document: globalThis.document, window: globalThis.window };
  const events = new Map();
  const target = (prefix) => ({ addEventListener: (name, callback) => events.set(prefix + name, callback), removeEventListener: (name) => events.delete(prefix + name) });
  let focused = false;
  globalThis.document = { ...target("doc:"), visibilityState: "hidden", hasFocus: () => focused };
  globalThis.window = { ...target("win:"), innerHeight: 900, innerWidth: 1000 };
  let secondTop = 800;
  const marker = (id, top) => ({ dataset: { readMessageId: String(id) }, getBoundingClientRect: () => ({ top: top(), bottom: top() + 1, left: 100, right: 101 }) });
  const container = { ...target("scroll:"), getBoundingClientRect: () => ({ top: 100, bottom: 500, height: 400 }), querySelectorAll: () => [marker(1, () => 200), marker(2, () => secondTop)] };
  const ref = { current: container };
  const messages = [{ id: 1, timestamp: "2026-11-16T12:00:00Z" }, { id: 2, timestamp: "2026-11-16T12:01:00Z" }];
  const readStates = [];
  const calls = [];
  const onRead = (message) => calls.push(message.id);
  let enabled = true;
  const harness = bridge.harness = createHookHarness();
  harness.render = () => useVisibleMessages(ref, messages, enabled, onRead, readStates, 2);
  try {
    await harness.flush();
    t.mock.timers.tick(300);
    assert.deepEqual(calls, []);
    document.visibilityState = "visible";
    events.get("doc:visibilitychange")();
    t.mock.timers.tick(300);
    assert.deepEqual(calls, []);
    focused = true;
    events.get("win:focus")();
    t.mock.timers.tick(300);
    assert.deepEqual(calls, [1]);
    secondTop = 300;
    events.get("scroll:scroll")();
    t.mock.timers.tick(300);
    assert.deepEqual(calls, [1, 2]);
    enabled = false;
    harness.invalidate();
    await harness.flush();
    assert.equal(events.size, 0);
    t.mock.timers.tick(1000);
    assert.deepEqual(calls, [1, 2]);
  } finally {
    harness.dispose();
    if (previous.document === undefined) delete globalThis.document; else globalThis.document = previous.document;
    if (previous.window === undefined) delete globalThis.window; else globalThis.window = previous.window;
  }
});
