let greeting = document.getElementById('malData');
console.log(greeting)


const currentURL = window.location.href;
const urlSearchParams = new URLSearchParams(currentURL.split('?')[1]);
const token = urlSearchParams.get('token');

// use this format to make calls to backend (once you've made the express.get in there)
fetch('/api/getUserName', {
    method: 'GET',
    headers: {
      'Authorization': token,
    },
  })
  .then((response) => response.json())
  .then((data) => {
    // Handle the data received from the server
    console.log(data);

    greeting.innerText = `Hello, ${data['name']}!`;
  })
  .catch((error) => {
    console.error('Error:', error);
  });