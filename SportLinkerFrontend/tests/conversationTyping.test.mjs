import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import { transformSync } from "esbuild";

const typingUrl = new URL("../src/components/messagesSection/conversation/conversationTyping/ConversationTyping.jsx", import.meta.url).href;
const viewUrl = new URL("../src/components/messagesSection/conversation/Conversation.jsx", import.meta.url).href;
const contentUrl = new URL("../src/components/messagesSection/conversation/ConversationContent.jsx", import.meta.url).href;
globalThis.typingTestReact = React;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === typingUrl && specifier.endsWith("/Avatar")) return { url: "mock:typing-avatar", shortCircuit: true };
    if ([typingUrl, viewUrl, contentUrl].includes(context.parentURL) && specifier.startsWith(".")) {
      if (specifier.endsWith("/ConversationContent")) return { url: contentUrl, shortCircuit: true };
      if (specifier.endsWith("/conversationTyping/ConversationTyping")) return { url: typingUrl, shortCircuit: true };
      if (specifier.endsWith("/utils/messaging")) return { url: new URL("../src/utils/messaging.js", import.meta.url).href, shortCircuit: true };
      if (specifier.endsWith("/utils/conversationReads")) return { url: new URL("../src/utils/conversationReads.js", import.meta.url).href, shortCircuit: true };
      return { url: "mock:typing-child", shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "mock:typing-avatar") return { format: "module", shortCircuit: true, source: 'const React = globalThis.typingTestReact; export default props => React.createElement("img", {src: props.image, alt: "avatar"});' };
    if (url === "mock:typing-child") return { format: "module", shortCircuit: true, source: "export default () => null;" };
    if ([typingUrl, viewUrl, contentUrl].includes(url)) return { format: "module", shortCircuit: true, source: transformSync(readFileSync(new URL(url), "utf8"), { loader: "jsx", jsx: "automatic", format: "esm" }).code };
    return nextLoad(url, context);
  },
});
const { default: Typing } = await import(typingUrl);
const { default: Conversation } = await import(viewUrl);
hooks.deregister();
delete globalThis.typingTestReact;

test("no typing users means no indicator", () => {
  assert.equal(renderToStaticMarkup(React.createElement(Typing, { users: [] })), "");
});

test("typing indicator identifies the sender, shows their avatar and exactly three animated dots", () => {
  const html = renderToStaticMarkup(React.createElement(Typing, { users: [{ userId: 12, senderName: "Anna" }], images: { 12: "/anna.webp" } }));
  assert.match(html, /Anna pisze wiadomość/);
  assert.match(html, /src="\/anna.webp"/);
  assert.match(html, /role="status"/);
  assert.equal((html.match(/<i>/g) ?? []).length, 3);
});

test("group typing displays each person's own photo and bubble", () => {
  const html = renderToStaticMarkup(React.createElement(Typing, { users: [{ userId: 12, senderName: "Anna" }, { userId: 13, senderName: "Piotr" }], images: { 12: "/anna.webp", 13: "/piotr.webp" } }));
  assert.match(html, /Anna pisze wiadomość\. Piotr pisze wiadomość/);
  assert.match(html, /src="\/anna.webp"/);
  assert.match(html, /src="\/piotr.webp"/);
  assert.equal((html.match(/<i>/g) ?? []).length, 6);
});

test("conversation consumes typingUsers rather than the obsolete count and hides typing for read-only chats", () => {
  const messaging = { activeChat: { id: 8, type: "private", canSendMessages: true }, thread: { items: [] }, typingUsers: [{ userId: 12, senderName: "Anna" }], images: { 12: "/anna.webp" } };
  const html = renderToStaticMarkup(React.createElement(Conversation, { messaging }));
  assert.match(html, /Anna pisze wiadomość/);
  const readonly = renderToStaticMarkup(React.createElement(Conversation, { messaging: { ...messaging, activeChat: { ...messaging.activeChat, canSendMessages: false } } }));
  assert.doesNotMatch(readonly, /Anna pisze wiadomość/);
});
