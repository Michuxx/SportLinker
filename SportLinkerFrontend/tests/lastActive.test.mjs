import assert from "node:assert/strict";
import { test } from "node:test";
import { formatLastActive } from "../src/utils/lastActive.js";

const now = Date.parse("2026-11-13T12:00:00Z");
const ago = (milliseconds) => new Date(now - milliseconds).toISOString();

test("activity changes from just now to minutes, hours and full elapsed days at the correct thresholds", () => {
  for (const [elapsed, expected] of [
    [0, "przed chwilą"],
    [59_999, "przed chwilą"],
    [60_000, "1 minutę temu"],
    [3_599_999, "59 minut temu"],
    [3_600_000, "1 godzinę temu"],
    [86_399_999, "23 godziny temu"],
    [86_400_000, "1 dzień temu"],
    [172_800_000, "2 dni temu"],
  ]) assert.equal(formatLastActive(ago(elapsed), now), `Ostatnio aktywny ${expected}`);
});

test("Polish minute and hour endings handle 1, 2–4, teens and numbers ending in 1", () => {
  for (const [count, unit] of [[1, "minutę"], [2, "minuty"], [4, "minuty"], [5, "minut"], [12, "minut"], [21, "minut"], [22, "minuty"], [25, "minut"]]) {
    assert.equal(formatLastActive(ago(count * 60_000), now), `Ostatnio aktywny ${count} ${unit} temu`);
  }
  for (const [count, unit] of [[1, "godzinę"], [2, "godziny"], [5, "godzin"], [12, "godzin"], [21, "godzin"], [22, "godziny"]]) {
    assert.equal(formatLastActive(ago(count * 3_600_000), now), `Ostatnio aktywny ${count} ${unit} temu`);
  }
});

test("UTC timestamps and offsets describe the same elapsed time", () => {
  for (const value of ["2026-11-13T11:45:00", "2026-11-13T11:45:00Z", "2026-11-13T12:45:00+01:00"]) {
    assert.equal(formatLastActive(value, now), "Ostatnio aktywny 15 minut temu");
  }
});

test("missing and invalid timestamps stay unknown; future clock skew never produces negative durations", () => {
  for (const value of [null, undefined, "", "bad-date"]) assert.equal(formatLastActive(value, now), null);
  assert.equal(formatLastActive(ago(-60_000), now), "Ostatnio aktywny przed chwilą");
});
