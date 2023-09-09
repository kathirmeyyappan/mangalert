let greeting = document.getElementById('greeting');
let submitBtn = document.getElementById('submitBtn');
let emailInput = document.getElementById('emailInput');
let emailForm = document.getElementById('emailForm');


emailForm.addEventListener('submit', function (event) {
  // prevent default form submission behavior
  event.preventDefault();

  updateUser(emailInput.value)
});

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
    console.log()
    // put token in local storage
    localStorage.setItem('token', data.token);
  })
  .catch((error) => {
    console.error('Error:', error);
  });


let mal_user_info
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
    mal_user_info = data
    greeting.innerText = `Hello, ${data['name']}!`;
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  
// send back user data to log in firebase
function updateUser(email) {
  console.log(mal_user_info)
  fetch('/writeUserInfo', {
    method: 'POST',
    headers: {
      'Authorization': localStorage.token,
      'Email': email,
      'MAL_Data': JSON.stringify(mal_user_info)
    },
  })
}