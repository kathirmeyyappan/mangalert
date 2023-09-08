let login = document.getElementById('login');

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
      <button class="button-58" role="button">Sign In with MAL</button>
    </a>
    `;
  })
  .catch((error) => {
    console.error('Error:', error);
  });