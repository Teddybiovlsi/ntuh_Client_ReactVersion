import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App";
import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("content")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
    {/* <BrowserRouter>
      <App />
    </BrowserRouter> */}
  </React.StrictMode>
);
