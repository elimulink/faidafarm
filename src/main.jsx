import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { applyAppTheme, getStoredTheme } from "./settings/settingsStorage.js";
import { warmUpApi } from "./lib/apiClient.js";

applyAppTheme(getStoredTheme());

// Sent before React has even mounted, so the sleeping backend has the whole
// splash and the walk to the login form as a head start.
warmUpApi();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
