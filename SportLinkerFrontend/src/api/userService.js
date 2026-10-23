import apiClient from "./apiClient";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5139/api";
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

/**
 * Zamienia ścieżkę względną obrazu z backendu (np. "/profiles/abc.webp") na pełny URL serwera
 * @param {string | null | undefined} path
 * @returns {string | null}
 */
export const resolveImageUrl = (path) => {
  if (!path || typeof path !== "string") return null;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  return `${SERVER_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const userService = {
  /**
   * Pobiera dane profilowe użytkownika z bazy danych
   * @param {number|string} userId
   * @returns {Promise<any>}
   */
  async getUserData(userId) {
    const response = await apiClient.get("/users/getUserData", {
      params: { userId },
    });
    return response.data;
  },

  /**
   * Aktualizuje podstawowe informacje o profilu (Ustawienia konta)
   * @param {{
   *   name: string,
   *   birthDate: string | null,
   *   gender: string | null,
   *   location: {
   *     long: number,
   *     lat: number,
   *     country?: string | null,
   *     name?: string | null,
   *     state?: string | null,
   *     displayLabel?: string | null
   *   } | null
   * }} profileData
   * @returns {Promise<any>}
   */
  async updateProfile({ name, birthDate, gender, location }) {
    const response = await apiClient.put("/users/updateProfile", {
      name,
      birthDate: birthDate || null,
      gender: gender || null,
      location: location || null,
    });
    return response.data;
  },

  /**
   * Aktualizuje opis "O mnie" na profilu użytkownika
   * @param {string|null} aboutMe
   * @returns {Promise<{ aboutMe: string | null }>}
   */
  async updateAboutMe(aboutMe) {
    const response = await apiClient.patch("/users/updateAboutMe", {
      aboutMe: aboutMe ?? null,
    });
    return response.data;
  },

  /**
   * Aktualizuje listę ulubionych sportów użytkownika
   * @param {number[]} sportIds
   * @returns {Promise<number[]>}
   */
  async updateFavouriteSports(sportIds) {
    const response = await apiClient.put("/users/updateFavouriteSports", {
      sportIds,
    });
    return response.data;
  },

  /**
   * Przesyła nowe zdjęcie profilowe lub zdjęcie w tle
   * @param {"Profile" | "Background"} imageType
   * @param {File} file
   * @returns {Promise<{ imageUrl: string }>}
   */
  async updateImage(imageType, file) {
    const formData = new FormData();
    formData.append("imageType", imageType);
    formData.append("file", file);

    const response = await apiClient.post("/users/updateImage", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default userService;
