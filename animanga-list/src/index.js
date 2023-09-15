import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import './index.css';
import App from './App';
import React from "react";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

function renderApp(anime, manga) {
  console.log(anime)
  root.render(
    <StrictMode>
      <App anime={anime} manga={manga} />
    </StrictMode>,
    rootElement
  );
}


function fetchDataAndRenderApp() {
  let anime;
  let manga;
  // fetch finished planned anime json
  fetch('/getFinishedPlannedAnime', { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
      anime = data;
    })
    .catch((error) => {
      console.error('Error:', error);
    })
    .finally(() => {
      // Fetch finished planned manga json
      fetch(`/getFinishedPlannedManga`, { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
          manga = data;
        })
        .catch((error) => {
          console.error('Error:', error);
        })
        .finally(() => {
          // Once both data sets are fetched, render the app
          renderApp(anime, manga);
        });
    });
}


fetchDataAndRenderApp();