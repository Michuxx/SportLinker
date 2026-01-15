import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { PrimeReactProvider } from "primereact/api";

const value = {
  hideOverlaysOnDocumentScrolling: true,
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrimeReactProvider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  </StrictMode>
);
