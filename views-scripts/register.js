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

let mal_user_info


// get token to use in api calls and store in local storage and update user info
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
    
    // update greeting and set user info
    fetch('/api/getUserName', {
      method: 'GET',
      headers: {
        'Authorization': localStorage.token,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      mal_user_info = data
      // if the token doesn't work then redirect user to beginning
      if (data.name == undefined) {
        // redirect to home
        fetch('/redirectToHome', {
          method: 'GET'
          })
          .then((response) => {
            console.log(response);
            if (response.redirected) {
              window.location.href = response.url;
            }
          });
      }
      // greet user
      greeting.innerText = `Hello, ${mal_user_info.name}!`;
    })
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  
// send back user data to log in firebase
function updateUser(email) {
  if (greeting.Text != '') {
    fetch('/writeUserInfo', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.token,
        'Email': email,
        'maldata': JSON.stringify(mal_user_info)
      },
    })
  }
}