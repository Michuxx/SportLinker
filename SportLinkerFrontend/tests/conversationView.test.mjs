import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import { transformSync } from "esbuild";

const viewUrl = new URL("../src/components/messagesSection/conversation/Conversation.jsx", import.meta.url).href;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === viewUrl && specifier.startsWith(".")) {
      if (specifier.endsWith("/utils/messaging")) return { url: new URL("../src/utils/messaging.js", import.meta.url).href, shortCircuit: true };
      return { url: "mock:conversation-child", shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "mock:conversation-child") return { format: "module", source: "export default () => null;", shortCircuit: true };
    if (url === viewUrl) return { format: "module", source: transformSync(readFileSync(new URL(url), "utf8"), { loader: "jsx", jsx: "automatic", format: "esm" }).code, shortCircuit: true };
    return nextLoad(url, context);
  },
});
const { default: Conversation } = await import(viewUrl);
hooks.deregister();

const renderView = (activeChat) => {
  let tree;
  const Probe = () => {
    tree = Conversation({ messaging: { activeChat, thread: { items: [] } } });
    return tree;
  };
  renderToStaticMarkup(React.createElement(Probe));
  return tree;
};

const assertUniqueSiblingKeys = (node) => {
  if (!React.isValidElement(node)) return;
  const children = [node.props.children].flat().filter(React.isValidElement);
  const keys = children.filter((child) => child.key !== null).map((child) => child.key);
  assert.equal(new Set(keys).size, keys.length, "Duplicate sibling keys can leave old conversation DOM behind");
  children.forEach(assertUniqueSiblingKeys);
};

test("conversation header, history and composer never share sibling keys", () => {
  for (const chat of [
    { id: 8, recipientUserId: 12, type: "private" },
    { id: 9, recipientUserId: 13, type: "private" },
    { id: 8, type: "group" },
    { recipientUserId: 12, type: "private" },
  ]) assertUniqueSiblingKeys(renderView(chat));
});

test("switching conversations replaces the entire visible chat, including when recipients match", () => {
  const first = renderView({ id: 8, recipientUserId: 12, type: "private" });
  const second = renderView({ id: 9, recipientUserId: 12, type: "private" });
  const draft = renderView({ recipientUserId: 8, type: "private" });
  const key = (tree) => tree.props.children[0].key;
  assert.notEqual(key(first), null);
  assert.notEqual(key(first), key(second));
  assert.notEqual(key(first), key(draft));
});
