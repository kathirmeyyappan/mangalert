let greeting = document.getElementById('greeting');

const currentURL = window.location.href;
const urlSearchParams = new URLSearchParams(currentURL.split('?')[1]);
const authorizationCode = urlSearchParams.get('code');

// get token to use in api calls and store in local storage
fetch('/getToken', {
    method: 'GET',
    headers: {
      Authorization: authorizationCode
    }
  })
  .then((response) => response.json())
  .then((data) => {
    // put token in local storage
    localStorage.setItem('token', data.token);
  })
  .catch((error) => {
    console.error('Error:', error);
  });


// fetch username for greeting and user registration/checking
fetch('/api/getUserName', {
    method: 'GET',
    headers: {
      'Authorization': localStorage.token,
    },
  })
  .then((response) => response.json())
  .then((data) => {
    // greet user
    greeting.innerText = `Hello, ${data['name']}!`;
  })
  .catch((error) => {
    console.error('Error:', error);
  });
