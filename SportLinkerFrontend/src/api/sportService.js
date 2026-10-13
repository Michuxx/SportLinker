import apiClient from "./apiClient";

export const sportService = {
  /**
   * Pobiera wszystkie dostępne sporty z bazy danych
   * @returns {Promise<Array<{ id: number, name: string }>>}
   */
  async getSports() {
    const response = await apiClient.get("/Sport");
    return response.data;
  },
};

export default sportService;
