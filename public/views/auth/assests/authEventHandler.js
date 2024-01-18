
//when clicked on the login button, we call the login api and verify the user credentials.
const loginForm =  document.getElementById('login-form');
loginForm.addEventListener("submit", (event)=>{
event.preventDefault();
// gets the username and password from the form.
const email = loginForm.email.value;
const password = loginForm.password.value;

const data = {
    email: email,
    password: password
};
// The below endpoint will change endpoint will change based on our endpoint. Once changed please delete this comment line.
// makes a post api call to the server to test login the user.
axios.post('/api/auth/login', data)
    .then(response => {
    if (response.status === 201) {
    alert(response.data.message);
    const username = encodeURIComponent(response.data.username); // encode the username for use in the URL
    window.location = `${response.data.redirect}`; // include username in query string // we might need the  username sometime later int the home page and we can extract it from the query string. A better way to replace this code will be with the use of Cache and JWT.
    form.reset(); // resets the form.
    } else {
    alert('Failed to login');
    }
})
.catch(error => {
    alert('Failed to login');
    console.log(error);
})
});
const signUpButton = document.getElementById("signUpButton");
signUpButton.addEventListener("click",function() {
    axios.get("/signup")
    .then()
    .catch(error => 
        alert("Failed to get the signup page."));
        console.log("Failed to get the signup Page.");
})

