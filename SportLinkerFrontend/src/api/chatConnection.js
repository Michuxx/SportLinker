import {
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr";
import apiClient from "./apiClient";
import { getValidAccessToken } from "./tokenService";

export const createChatConnection = () => {
  const apiUrl = new URL(apiClient.defaults.baseURL, window.location.origin);

  const hubUrl = new URL("/hubs/chat", apiUrl).toString();

  return new HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: async () => (await getValidAccessToken()) ?? "",
      transport: HttpTransportType.WebSockets,
    })
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();
};
