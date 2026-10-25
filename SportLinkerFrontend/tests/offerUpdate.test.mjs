import assert from "node:assert/strict";
import { test } from "node:test";
import { prepareOfferUpdate } from "../src/utils/offerUpdate.js";
import { toLocalDateFields } from "../src/utils/dateTime.js";

const editData = {
  availability: "Available",
  level: "any",
  title: "  Nowy tytuł  ",
  description: "  Nowy opis  ",
  location: {
    city: "Wrocław", name: "Hala sportowa", street: "Sportowa",
    houseNumber: "2", country: "Poland", lat: "51.1", long: "17.1",
    state: "Dolnośląskie", type: "house", displayLabel: "Wrocław, Sportowa 2",
  },
  locationQuery: "Wrocław, Sportowa 2",
  ...toLocalDateFields("2026-10-31T18:21:00Z"),
  maxPeople: "50",
  mode: "public",
};

test("PATCH body uses numeric enums, UTC and only fields accepted by the API", () => {
  const { payload } = prepareOfferUpdate("12", editData);
  assert.deepEqual(payload, {
    availability: 0, level: 3,
    title: "Nowy tytuł", description: "Nowy opis",
    location: {
      city: "Wrocław", street: "Sportowa", houseNumber: "2", country: "Poland",
      lat: 51.1, long: 17.1, state: "Dolnośląskie", type: "house", name: "Hala sportowa",
    },
    date: "2026-10-31T18:21:00.000Z",
    maxParticipants: 50, mode: 0, offerId: 12,
  });
});

test("confirmed changes update the view while preserving sport and participant data", () => {
  const original = structuredClone(editData);
  const { changes } = prepareOfferUpdate(12, editData);
  const previous = {
    id: 12, sportId: 7, sportName: "Tenis", members: [{ id: 2 }],
    author: { id: 2 }, creationDate: "2026-10-01T10:00:00Z", status: null,
  };
  const next = { ...previous, ...changes };
  assert.equal(next.sportId, 7);
  assert.equal(next.sportName, "Tenis");
  assert.equal(next.members, previous.members);
  assert.equal(next.author, previous.author);
  assert.equal(next.creationDate, previous.creationDate);
  assert.equal(next.status, null);
  assert.equal(next.maxPeople, 50);
  assert.equal(next.title, "Nowy tytuł");
  assert.equal(next.location.displayLabel, "Wrocław, Sportowa 2");
  assert.equal(next.date, "2026-10-31T18:21:00.000Z");
  assert.deepEqual(editData, original);
});

test("all editable enum values match the backend", () => {
  for (const [level, expected] of [["beginner", 0], ["intermediate", 1], ["expert", 2], ["any", 3]]) {
    const { payload } = prepareOfferUpdate(12, {
      ...editData, level, mode: "private", availability: "Unavailable",
    });
    assert.equal(payload.level, expected);
    assert.equal(payload.availability, 1);
    assert.equal(payload.mode, 1);
  }
});
