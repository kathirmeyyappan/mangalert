import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import './index.css';
import App from './App';
import React from "react";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

const userid = window.location.pathname.split('/')[-1];

let anime;
let manga;

// Fetch finished planned anime json
fetch(`/getFinishedPlannedAnime`, {
  method: 'GET',
  header: {
    userid: userid
  }
})
.then((response) => response.json())
.then((data) => {
  anime = data
})
.catch((error) => {
  console.error('Error:', error);
});

// Fetch finished planned manga json
fetch(`/getFinishedPlannedManga`, {
  method: 'GET',
  headers: {
    userid: userid
  }
})
.then((response) => response.json())
.then((data) => {
  manga = data
})
.catch((error) => {
  console.error('Error:', error);
});

root.render(
  <StrictMode>
    <App anime = {anime} manga = {anime}/>
  </StrictMode>
);