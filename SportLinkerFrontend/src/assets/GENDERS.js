export const GENDERS_DICTIONARY = {
  male: "Mężczyzna",
  female: "Kobieta",
  other: "Inna",
  notdisclosed: "Wolę nie podawać",
};

/**
 * Tłumaczy wartość płci (z backendu: 'male', 'female', 'other', 'Male', itp.) na język polski.
 * @param {string|null|undefined} gender
 * @returns {string}
 */
export const getGenderLabel = (gender) => {
  if (!gender) return "Nie podano";
  if (typeof gender === "object" && gender.text) return gender.text;
  const normalized = String(gender).trim().toLowerCase();
  return GENDERS_DICTIONARY[normalized] || "Nie podano";
};

export const GENDERS = [
  {
    value: "male",
    text: "Mężczyzna",
  },
  {
    value: "female",
    text: "Kobieta",
  },
  {
    value: "other",
    text: "Inna",
  },
];
