// client id and secret
import dotenv from 'dotenv';
dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// import needed functions from other files
import { generateRandomString } from './other-functions.js'


// intial user authentication url
export function getUserAuthURL(codeChallenge) {
  const baseURL = 'https://myanimelist.net/v1/oauth2/authorize';
  const response_type = 'code';
  const challenge = codeChallenge;
  const state = generateRandomString(64);
  return `${baseURL}?response_type=${response_type}&client_id=${CLIENT_ID}&code_challenge=${challenge}`
}


// get token for api access
export async function generateNewToken(authorizationCode, codeVerifier) {
  const url = 'https://myanimelist.net/v1/oauth2/token';
  const data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: authorizationCode,
    code_verifier: codeVerifier,
    grant_type: 'authorization_code',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: new URLSearchParams(data),
    });

    if (!response.ok) {
      throw new Error('Failed to generate token');
    }

    const token = await response.json();
    return token['access_token']

  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
}


// basic API call to get user profile data
export async function getUserName(accessToken) {
    
    const apiUrl = 'https://api.myanimelist.net/v2/users/@me';
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    
  try {
    const response = await fetch(apiUrl, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error making API call:', error);
    throw error;
  }
}


// get planned anime for user
export async function getPlannedAnime(accessToken) {
  // base url for getting ptw
  const baseUrl = 'https://api.myanimelist.net/v2/users/@me/animelist';
  const queryParams = {
    status: 'plan_to_watch',
    limit: 1000,
  };
  const apiUrl = `${baseUrl}?${new URLSearchParams(queryParams)}`;

  // add authorization
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  
  // fetch id's planned anime and return all
  try {
    const response = await fetch(apiUrl, { headers });
    const response_json = await response.json();
    const plannedAnime = response_json.data.map(entry => entry.node.id);
    return plannedAnime
  } catch (error) {
    console.error('Error making API call:', error);
    throw error;
  }
}


// get planned manga for user
export async function getPlannedManga(accessToken) {
  // base url for getting ptr
  const baseUrl = 'https://api.myanimelist.net/v2/users/@me/mangalist';
  const queryParams = {
    status: 'plan_to_read',
    limit: 1000,
  };
  const apiUrl = `${baseUrl}?${new URLSearchParams(queryParams)}`;

  // add authorization
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  
  // fetch id's planned anime and return all
  try {
    const response = await fetch(apiUrl, { headers });
    const response_json = await response.json();
    const plannedManga = response_json.data.map(entry => entry.node.id);
    return plannedManga
  } catch (error) {
    console.error('Error making API call:', error);
    throw error;
  }
}