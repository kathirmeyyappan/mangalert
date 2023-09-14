let greeting = document.getElementById('greeting');
let submitBtn = document.getElementById('submitBtn');
let emailInput = document.getElementById('emailInput');
let emailForm = document.getElementById('emailForm');

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
      console.log(mal_user_info)
      // if the token doesn't work then redirect user to beginning
      if (mal_user_info.name == undefined) {
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
    })
    .then(() => {
      fetch('/getMangAlertUserInfo', {
        method: 'GET',
        headers: {
          'userid': mal_user_info.id
        }
        })
        .then((response) => response.json())
        .then((data) => {
          if (data != null) {
            // set user's previously registered email
            const email = data.email;
            emailInput.value = email;
            // greet user
            greeting.innerHTML = `Welcome back, <b>${mal_user_info.name}</b>! Please 
              confirm your registered email below.`;
          } else {
            greeting.innerHTML = `Hello, <b>${mal_user_info.name}</b>! Welcome to MangAlert! 
              Please enter your email below.`;
          }
        })
    })
  })
  .catch((error) => {
    console.error('Error:', error);
  });


emailForm.addEventListener('submit', function (event) {
  // prevent default form submission behavior
  event.preventDefault();
  
  // update userData
  updateUser(emailInput.value)

  // redirect to user data page
  const userId = mal_user_info.id
  window.location.href = `/users/${userId}`
});

  
// send back user data to log in firebase
function updateUser(email) {
  if (greeting.Text != '') {
    fetch('/writeUserInfo', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.token,
        'email': email,
        'maldata': JSON.stringify(mal_user_info)
      },
    })
  }
}