import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeOfferDetails } from "../src/utils/offerDetails.js";

const response = {
  offerId: 1,
  sportId: 7,
  sportName: "Tenis",
  title: "TEST",
  level: "Any",
  description: "pierwsza oferta",
  date: "2026-10-31T18:21:00Z",
  creationDate: "2026-10-23T12:29:36.5417929Z",
  city: "Wrocław",
  country: "Poland",
  displayLabel: "Wrocław, ul. Mariana Smoluchowskiego",
  houseNumber: "",
  lat: 51.1080201,
  long: 17.0628023,
  name: "Wrocław University of Science and Technology",
  state: "Lower Silesian Voivodeship",
  street: "Mariana Smoluchowskiego",
  type: "house",
  maxPeople: 2,
  availability: "Available",
  mode: "Public",
  status: null,
  authorId: 2,
  author: { userId: 2, name: "Admin", joinDate: "2026-10-23T12:29:36Z", image: "/profiles/admin.webp" },
  members: [{ userId: 2, name: "Admin", joinDate: "2026-10-23T12:29:36Z", image: "/profiles/admin.webp" }],
};

test("offer response supplies the page's location, identities and enum values", () => {
  const original = structuredClone(response);
  const offer = normalizeOfferDetails(response);
  assert.equal(offer.id, 1);
  assert.equal(offer.sportId, 7);
  assert.equal(offer.sportName, "Tenis");
  assert.equal(offer.title, "TEST");
  assert.equal(offer.level, "any");
  assert.equal(offer.mode, "public");
  assert.equal(offer.availability, "Available");
  assert.equal(offer.status, null);
  assert.equal(offer.author.id, offer.authorId);
  assert.equal(offer.members[0].id, 2);
  assert.equal(offer.members[0].image, "/profiles/admin.webp");
  assert.equal(offer.date, response.date);
  assert.equal(offer.creationDate, response.creationDate);
  assert.deepEqual(offer.location, {
    city: response.city, country: response.country, displayLabel: response.displayLabel,
    houseNumber: response.houseNumber, lat: response.lat, long: response.long,
    name: response.name, state: response.state, street: response.street, type: response.type,
  });
  assert.deepEqual(offer.requests, []);
  assert.equal(offer.sport, undefined);
  assert.deepEqual(response, original);
});

test("empty member lists and private, unavailable offers are supported", () => {
  const offer = normalizeOfferDetails({
    ...response, members: null, displayLabel: null,
    mode: "Private", availability: "Unavailable", status: "Pending",
  });
  assert.deepEqual(offer.members, []);
  assert.equal(offer.location.displayLabel, "Wrocław");
  assert.equal(offer.mode, "private");
  assert.equal(offer.availability, "Unavailable");
  assert.equal(offer.status, "pending");
});
