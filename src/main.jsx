import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./theme.js";
import { ThemeProvider } from "@mui/material";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
    <ThemeProvider theme={theme} defaultMode="system">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
