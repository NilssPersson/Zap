import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/i18tn";

const rootElement = document.getElementById("root");

import config from "@/config";
const { ROUTER_BASE_NAME } = config;
export const router = createBrowserRouter([{ path: "*", element: <App /> }], {
  basename: ROUTER_BASE_NAME,
});

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
} else {
  console.error("Could not find the 'root' element.");
}
