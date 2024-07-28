import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import createCollection from "./setup_suppy_chain";
import { getAttributes } from "./get_data";
// const createCollection = require('./setup_suppy_chain');

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const Retailer_collection_id = 3287;
const Wholesale_collection_id = 3289;
const Distributor_collection_id = 3290;
const Manufacturer_collection_id = 3291;

(async () => {
  try {
      const attributes = await getAttributes(Retailer_collection_id, "10");
      console.log(attributes);
  } catch (error) {
      console.error("Error fetching attributes:", error);
  }
})();

root.render(
  <StrictMode>
    <h1>Web3 Root Beer DOT Game - Team 1</h1>
    <App />
  </StrictMode>
);
