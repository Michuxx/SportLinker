import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import { parseApiDate, toLocalDateFields } from "../src/utils/dateTime.js";

test("API timestamps without timezone are UTC; explicit offsets are preserved", () => {
  for (const value of [
    "2026-07-01T22:30:00",
    "2026-07-01 22:30:00",
    "2026-07-01T22:30:00Z",
    "2026-07-02T00:30:00+02:00",
  ]) {
    assert.equal(parseApiDate(value).toISOString(), "2026-07-01T22:30:00.000Z");
  }
  assert.deepEqual(toLocalDateFields("invalid"), { date: "", time: "" });
});

const moduleUrl = new URL("../src/utils/dateTime.js", import.meta.url).href;
const scenarios = [
  { zone: "Europe/Warsaw", summer: ["2026-07-02", "00:30"], winter: ["2026-01-01", "23:30"] },
  { zone: "America/New_York", summer: ["2026-07-01", "18:30"], winter: ["2026-01-01", "17:30"] },
  { zone: "Asia/Kolkata", summer: ["2026-07-02", "04:00"], winter: ["2026-01-02", "04:00"] },
  { zone: "UTC", summer: ["2026-07-01", "22:30"], winter: ["2026-01-01", "22:30"] },
];

for (const { zone, summer, winter } of scenarios) {
  test(`local dates, DST and UTC round trips in ${zone}`, () => {
    const script = `
      import assert from 'node:assert/strict';
      import { toLocalDateFields, localDateTimeToUtc } from ${JSON.stringify(moduleUrl)};
      for (const [utc, expected] of [
        ['2026-07-01T22:30:00', ${JSON.stringify(summer)}],
        ['2026-01-01T22:30:00', ${JSON.stringify(winter)}],
      ]) {
        const fields = toLocalDateFields(utc);
        assert.deepEqual(fields, { date: expected[0], time: expected[1] });
        assert.equal(localDateTimeToUtc(fields.date, fields.time), utc + '.000Z');
      }
      assert.deepEqual(toLocalDateFields('2000-01-01'), { date: '2000-01-01', time: '00:00' });
      assert.equal(toLocalDateFields(new Date(2026, 6, 2, 0, 15)).date, '2026-07-02');
    `;
    execFileSync(process.execPath, ["--input-type=module", "-e", script], {
      env: { ...process.env, TZ: zone },
      stdio: "pipe",
    });
  });
}
