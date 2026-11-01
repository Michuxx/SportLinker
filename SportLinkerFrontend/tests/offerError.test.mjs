import assert from "node:assert/strict";
import { test } from "node:test";
import { getOfferErrorType } from "../src/utils/offerError.js";

test("missing offers are recognized for HTTP 404 and the backend's HTTP 400 error", () => {
  assert.equal(getOfferErrorType({ response: { status: 404 } }), "notFound");
  assert.equal(getOfferErrorType({ response: { status: 400, data: { message: { code: "OFFER_NOT_FOUND" } } } }), "notFound");
  assert.equal(getOfferErrorType({ response: { status: 400, data: { code: "OFFER_NOT_FOUND" } } }), "notFound");
});

test("connection failures and server errors have distinct views", () => {
  assert.equal(getOfferErrorType({ code: "ERR_NETWORK" }), "connection");
  assert.equal(getOfferErrorType({ code: "ECONNABORTED" }), "connection");
  assert.equal(getOfferErrorType({ response: { status: 500 } }), "server");
  assert.equal(getOfferErrorType({ response: { status: 403 } }), "server");
});
