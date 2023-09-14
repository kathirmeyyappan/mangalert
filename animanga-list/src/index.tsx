import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import './index.css';
import App from './App';
import React from "react";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);