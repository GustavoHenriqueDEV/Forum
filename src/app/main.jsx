import React from "react";
import { createRoot } from "react-dom/client";
import App from "../app/App";
import { AuthProvider } from "../app/hooks/AuthProvider"; 
import "../index.css"; // Se o CSS estiver fora da pasta `app`

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
</React.StrictMode>
);
