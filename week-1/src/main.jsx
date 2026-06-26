import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { PromptProvider } from "./context/PromptContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <PromptProvider>
        <App />
      </PromptProvider>
    </BrowserRouter>
  </StrictMode>
);
