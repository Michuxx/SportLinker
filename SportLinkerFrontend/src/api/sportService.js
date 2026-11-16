import apiClient from "./apiClient";

export const sportService = {
  /**
   * Pobiera wszystkie dostępne sporty z bazy danych
   * @returns {Promise<Array<{ id: number, name: string }>>}
   */
  async getSports({ signal } = {}) {
    const response = await apiClient.get("/Sport", { signal });
    return response.data;
  },
};

export default sportService;
