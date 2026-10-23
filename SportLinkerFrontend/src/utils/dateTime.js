// Backend timestamps without an offset represent UTC. Calendar dates have no timezone.
export const parseApiDate = (value) => {
  if (typeof value !== "string") return new Date(value);

  const normalized = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return new Date(`${normalized}T00:00:00`);
  }

  const isTimestamp = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(normalized);
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);
  return new Date(
    isTimestamp && !hasTimezone
      ? `${normalized.replace(" ", "T")}Z`
      : normalized,
  );
};

export const toLocalDateFields = (value = new Date()) => {
  const date = parseApiDate(value);
  if (Number.isNaN(date.getTime())) return { date: "", time: "" };

  const pad = (part) => String(part).padStart(2, "0");
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
};

// Date/time inputs contain wall-clock time in the user's browser timezone.
export const localDateTimeToUtc = (date, time) =>
  new Date(`${date}T${time}`).toISOString();
