let login = document.getElementById('login');
let errorMsg = document.getElementById('errorMsg');

const currentURL = window.location.href;
const urlSearchParams = new URLSearchParams(currentURL.split('?')[1]);

if (urlSearchParams.get('redirected')) {
  errorMsg.innerHTML = "<p style='color:#db0b0b; font-size:12px'>Something went wrong. Please sign in again.</p>"
}

// use this format to make calls to backend (once you've made the express.get in there)
fetch('/api/userLogin', {
    method: 'GET'
  })
  .then((response) => response.json())
  .then((data) => {
    // Handle the data received from the server
    console.log(data);

    login.innerHTML = `
    <a href="${data.loginURL}">
      <button class="malButton" role="button">Sign-in / Register</button>
    </a>
    `;
  })
  .catch((error) => {
    console.error('Error:', error);
  });