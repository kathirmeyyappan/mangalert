// client id and secret
import dotenv from 'dotenv';
dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

// Serve static files from the current directory
app.use(express.static(__dirname)); 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// http request for server end
import fetch from 'node-fetch';
import path from 'path';

// generates code verfiers for accessing MAL API
function generateCodeVerifierAndChallenge() {
  const verifier = generateRandomString();
  return { codeVerifier: verifier, codeChallenge: verifier };
}


// random string generation
function generateRandomString(strLen = 128) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  for (let i = 0; i < 128; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}


// intial user authentication url
function getUserAuthURL(codeChallenge) {
  const baseURL = 'https://myanimelist.net/v1/oauth2/authorize';
  const response_type = 'code';
  const challenge = codeChallenge;
  const state = generateRandomString(64);
  return `${baseURL}?response_type=${response_type}&client_id=${CLIENT_ID}&code_challenge=${challenge}`
}


// get token for api access
async function generateNewToken(authorizationCode, codeVerifier) {
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
    console.log(token)
    return token['access_token']

  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
}


// basic API call to get UserName
async function getUserName(accessToken) {
    
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


const {codeVerifier: verifier, codeChallenge: challenge} = generateCodeVerifierAndChallenge();
const userAuthURL = getUserAuthURL(challenge);
console.log(userAuthURL);

// Define a callback route where the authorization code will be sent.
app.get('/oauth', async (req, res) => {
  try {
    // get 'code' query parameter from URL and call generateNewToken
    const authorizationCode = req.query.code;
    const accessToken = await generateNewToken(authorizationCode, verifier);
    console.log(accessToken)
    res.redirect(`/home?token=${accessToken}`);
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).send('Error generating token');
}
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});


// get username
app.get('/api/getUserName', async (req, res) => {
  try {
    const result = await getUserName(req.headers.authorization);
    // Send the result as a response
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// write all api calls as app.get and use the get with fetch in frontend