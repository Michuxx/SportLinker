import { localDateTimeToUtc } from "./dateTime.js";

// Values match the backend's AvailabilityEnum, LevelEnum and ModeEnum.
const availabilityValues = { Available: 0, Unavailable: 1 };
const levelValues = { beginner: 0, intermediate: 1, expert: 2, any: 3 };
const modeValues = { public: 0, private: 1 };

export const prepareOfferUpdate = (offerId, editData) => {
  const location = editData.location;
  const payload = {
    availability: availabilityValues[editData.availability],
    level: levelValues[editData.level],
    title: editData.title.trim(),
    description: editData.description.trim(),
    location: {
      city: location.city || location.name || "",
      street: location.street || "",
      houseNumber: location.houseNumber || "",
      country: location.country || "",
      lat: Number(location.lat),
      long: Number(location.long),
      state: location.state || "",
      type: location.type || "",
      name: location.name || "",
    },
    date: localDateTimeToUtc(editData.date, editData.time),
    maxParticipants: Number(editData.maxPeople),
    mode: modeValues[editData.mode],
    offerId: Number(offerId),
  };

  return {
    payload,
    changes: {
      availability: editData.availability,
      level: editData.level,
      title: payload.title,
      description: payload.description,
      location: {
        ...payload.location,
        displayLabel: location.displayLabel || editData.locationQuery.trim(),
      },
      date: payload.date,
      maxPeople: payload.maxParticipants,
      mode: editData.mode,
    },
  };
};
