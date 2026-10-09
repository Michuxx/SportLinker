import axios from "axios";
import apiClient from "./apiClient";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5139/api";

export const authService = {
  /**
   * Logowanie użytkownika
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ accessUserToken: string, refreshUserToken: string }>}
   */
  async login({ email, password }) {
    const response = await apiClient.post("/users/login", { email, password });
    return response.data;
  },

  /**
   * Rejestracja nowego użytkownika
   * @param {{ email: string, password: string, name: string }} userData
   * @returns {Promise<any>}
   */
  async register({ email, password, name }) {
    const response = await apiClient.post("/users/register", {
      email,
      password,
      name,
    });
    return response.data;
  },

  /**
   * Odświeżenie tokena dostępowego za pomocą tokena odświeżającego
   * @param {string} refreshToken
   * @returns {Promise<{ accessUserToken: string, refreshUserToken: string }>}
   */
  async refreshToken(refreshToken) {
    const response = await axios.post(`${API_BASE_URL}/users/refreshToken`, {
      refreshToken,
    });
    return response.data;
  },
};

export default authService;
