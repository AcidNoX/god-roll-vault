import { darkTheme, ThemeProvider } from "@god-roll-vault/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

document.documentElement.style.backgroundColor = darkTheme.colors.background;
document.documentElement.style.minHeight = "100%";
document.body.style.backgroundColor = darkTheme.colors.background;
document.body.style.margin = "0";
document.body.style.minHeight = "100vh";
root.style.backgroundColor = darkTheme.colors.background;
root.style.minHeight = "100vh";

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
