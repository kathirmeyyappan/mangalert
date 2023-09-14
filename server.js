// client id and secret
import dotenv from 'dotenv';
dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

// directory location initialization
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

// serve static files from the specified directories
app.use('/views-scripts', express.static(path.join(__dirname, 'views-scripts')));
app.use('/views', express.static(path.join(__dirname, 'views')));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// http request for server end
import fetch from 'node-fetch';
import path from 'path';

// import needed functions from other files
import { writeUserInfo, getMangAlertUserInfo, getFinishedPlannedAnime, getFinishedPlannedManga } 
  from './server-functions/firebase-functions.js';
import { getUserName, generateNewToken, getUserAuthURL } 
  from './server-functions/mal-functions.js'
import { generateCodeVerifierAndChallenge } 
  from './server-functions/other-functions.js'


// get code verifier and challenge for token generation
const {codeVerifier: verifier, codeChallenge: challenge} = generateCodeVerifierAndChallenge();


// base page to greet user and prompt login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// page to confirm user login and get/update email
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'registration.html'));
});


// Define a route that captures the user ID as a route parameter
app.get('/users/:userId', (req, res) => {
  // change this later to the react path
});


// send user back to login
app.get('/redirectToHome', (req, res) => {
  res.redirect('/?sentback=True');
});


// Define a callback route where the authorization code will be sent.
app.get('/oauth', async (req, res) => {
  try {
    // get 'code' query parameter from URL and call generateNewToken
    const authorizationCode = req.query.code;
    res.redirect(`/register?code=${authorizationCode}`)
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).send('Error generating token');
}
});


// define callback route where the authorization code will be sent.
app.get('/api/userLogin', async (req, res) => {
  try {
    const userAuthURL = getUserAuthURL(challenge);
    res.json({loginURL: userAuthURL})
  } catch (error) {
    console.error('Error generating userAuthURL:', error);
    res.status(500).send('Error generating userAuthURL');
}
});


// retrieve the token to be used for API calls
app.get('/getToken', async (req, res) => {
  try {
    // get 'code' query parameter from URL and call generateNewToken
    const authorizationCode = req.headers.authorization;
    const accessToken = await generateNewToken(authorizationCode, verifier);
    res.json({token : accessToken})
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).send('Error generating token');
}
});


// get user info
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


// write user's relevant mal info to db
app.post('/writeUserInfo', async (req, res) => {
  try {
    const email = req.headers.email;
    console.log(req.headers)
    const user_info = JSON.parse(req.headers.maldata);
    const token = req.headers.authorization;
    await writeUserInfo(email, user_info, token);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// get user's mangalert data
app.get('/getMangAlertUserInfo', async (req, res) => {
  try {
    const user_id = req.headers.userid;
    const userInfo = await getMangAlertUserInfo(user_id);
    res.json(userInfo);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// retrieve and return user's planned anime that are complete (stratified by recency)
app.get('/getFinishedPlannedAnime', async (req, res) => {
  try {
    const user_id = req.headers.userid
    const plannedFinishedAnime = await getFinishedPlannedAnime(user_id)
    res.json(plannedFinishedAnime)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// retrieve and return user's planned manga that are complete (stratified by recency)
app.get('/getFinishedPlannedManga', async (req, res) => {
  try {
    const user_id = req.headers.userid
    const plannedFinishedManga = await getFinishedPlannedManga(user_id)
    res.json(plannedFinishedManga)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});