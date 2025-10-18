import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />  {/* do NOT wrap App in another <BrowserRouter> here if it's already in App.jsx */}
  </React.StrictMode>
);