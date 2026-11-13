import { parseApiDate } from "./dateTime.js";

const plural = new Intl.PluralRules("pl");
const units = {
  minute: { one: "minutę", few: "minuty", many: "minut", other: "minut" },
  hour: { one: "godzinę", few: "godziny", many: "godzin", other: "godzin" },
  day: { one: "dzień", few: "dni", many: "dni", other: "dni" },
};

export const formatLastActive = (value, now = Date.now()) => {
  if (!value) return null;
  const date = parseApiDate(value).getTime();
  const current = Number(now);
  if (!Number.isFinite(date) || !Number.isFinite(current)) return null;
  const elapsed = Math.max(0, current - date);
  if (elapsed < 60_000) return "Ostatnio aktywny przed chwilą";

  const [count, unit] = elapsed < 3_600_000
    ? [Math.floor(elapsed / 60_000), "minute"]
    : elapsed < 86_400_000
      ? [Math.floor(elapsed / 3_600_000), "hour"]
      : [Math.floor(elapsed / 86_400_000), "day"];
  return `Ostatnio aktywny ${count} ${units[unit][plural.select(count)]} temu`;
};
