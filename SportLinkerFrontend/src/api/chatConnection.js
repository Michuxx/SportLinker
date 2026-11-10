import {
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr";
import apiClient from "./apiClient";
import { getAccessToken } from "../utils/tokenStorage";

export const createChatConnection = () => {
  const apiUrl = new URL(apiClient.defaults.baseURL, window.location.origin);

  const hubUrl = new URL("/hubs/chat", apiUrl).toString();

  return new HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => getAccessToken() ?? "",
      transport: HttpTransportType.WebSockets,
    })
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();
};
