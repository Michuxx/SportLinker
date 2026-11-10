import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { PrimeReactProvider } from "primereact/api";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

const value = {
  hideOverlaysOnDocumentScrolling: true,
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrimeReactProvider value={value}>
      <ToastProvider>
        <AuthProvider>
          <ChatProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </BrowserRouter>
          </ChatProvider>
        </AuthProvider>
      </ToastProvider>
    </PrimeReactProvider>
  </StrictMode>,
);
