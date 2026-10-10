import apiClient from "./apiClient";

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
};

export default userService;
