let login = document.getElementById('userLogin');


// use this format to make calls to backend (once you've made the express.get in there)
fetch('/api/userLogin', {
    method: 'GET'
  })
  .then((response) => response.json())
  .then((data) => {
    // Handle the data received from the server
    console.log(data);

    login.innerText = data.loginURL;
  })
  .catch((error) => {
    console.error('Error:', error);
  });