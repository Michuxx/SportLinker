import apiClient from "./apiClient";

export const offerService = {
  async deleteParticipant(offerId, userId, { signal } = {}) {
    await apiClient.post("/Offer/participants/delete", {
      offerId: Number(offerId),
      userId: Number(userId),
    }, { signal });
  },

  async leaveOffer(offerId, { signal } = {}) {
    await apiClient.post("/Offer/leave", { offerId: Number(offerId) }, { signal });
  },

  async cancelOfferRequest(offerId, { signal } = {}) {
    await apiClient.post("/Offer/requests/cancel", { offerId: Number(offerId) }, { signal });
  },

  async acceptOfferRequest(offerId, userId, { signal } = {}) {
    await apiClient.post("/Offer/requests/accept", {
      userId: Number(userId),
      offerId: Number(offerId),
    }, { signal });
  },

  async rejectOfferRequest(offerId, userId, { signal } = {}) {
    await apiClient.post("/Offer/requests/reject", {
      userId: Number(userId),
      offerId: Number(offerId),
    }, { signal });
  },

  /** Pobiera prośby o dołączenie podczas otwierania modalu. */
  async getOfferRequests(offerId, { signal } = {}) {
    const response = await apiClient.get("/Offer/requests", {
      params: { offerId: Number(offerId) },
      signal,
    });
    return response.data;
  },

  /** Dołącza do publicznej oferty albo wysyła prośbę do prywatnej. */
  async joinOffer(offerId, { signal } = {}) {
    await apiClient.post(
      "/Offer/Join",
      { offerId: Number(offerId) },
      { signal },
    );
  },

  /** Aktualizuje ofertę. Endpoint potwierdza zapis odpowiedzią 204 bez body. */
  async updateOffer(payload, { signal } = {}) {
    const response = await apiClient.patch("/Offer", payload, { signal });
    if (response.status !== 204) {
      throw Object.assign(new Error("Nie potwierdzono zapisu oferty."), {
        response,
      });
    }
  },

  /** Pobiera szczegóły oferty; zalogowany użytkownik jest rozpoznawany po JWT. */
  async getOfferDetails(offerId, { signal } = {}) {
    const response = await apiClient.get(
      `/Offer/${encodeURIComponent(offerId)}`,
      {
        signal,
      },
    );
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
