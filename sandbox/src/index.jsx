import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <h1>Web3 Root Beer DOT Game </h1>
    <br />
    <h2>Team 1</h2>
    <App />
  </StrictMode>
);
