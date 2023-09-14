// generates code verfiers for accessing MAL API
export function generateCodeVerifierAndChallenge() {
  const verifier = generateRandomString();
  return { codeVerifier: verifier, codeChallenge: verifier };
}


// random string generation
export function generateRandomString(strLen = 128) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  for (let i = 0; i < strLen; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}