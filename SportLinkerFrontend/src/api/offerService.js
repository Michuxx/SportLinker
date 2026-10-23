import apiClient from "./apiClient";

export const offerService = {
  /** Pobiera szczegóły oferty; zalogowany użytkownik jest rozpoznawany po JWT. */
  async getOfferDetails(offerId, { signal } = {}) {
    const response = await apiClient.get(`/Offer/${encodeURIComponent(offerId)}`, {
      signal,
    });
    return response.data;
  },

  /**
   * Tworzy nową ofertę sportową w bazie danych
   * @param {{
   *   sportId: number,
   *   level: string,
   *   title: string,
   *   description: string,
   *   date: string,
   *   location: {
   *     city: string,
   *     street?: string,
   *     houseNumber?: string,
   *     country?: string,
   *     lat: number,
   *     long: number,
   *     state?: string,
   *     type?: string,
   *     name?: string
   *   },
   *   maxParticipants: number,
   *   mode: string
   * }} offerData
   * @returns {Promise<{ offerId: number }>}
   */
  async createOffer(offerData) {
    const response = await apiClient.post("/Offer", offerData);
    return response.data;
  },
};

export default offerService;
