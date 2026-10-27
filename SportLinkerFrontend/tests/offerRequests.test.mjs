import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeOfferRequests } from "../src/utils/offerRequests.js";

test("offer request identities and images map to the modal cards", () => {
  const response = [{ userId: 23, name: "Jan", userImage: "/profiles/jan.webp" }];
  assert.deepEqual(normalizeOfferRequests(response), [{
    id: 23, playerId: 23, name: "Jan", image: "/profiles/jan.webp",
  }]);
  assert.equal(response[0].id, undefined);
});

test("empty lists and missing profile images are supported", () => {
  assert.deepEqual(normalizeOfferRequests([]), []);
  assert.equal(normalizeOfferRequests([{ userId: 2, name: "Anna", userImage: null }])[0].image, null);
});
