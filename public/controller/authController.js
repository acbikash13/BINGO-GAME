const loginForm =  document.getElementById('login-form');
    loginForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const data = {
        email: email,
        password: password
    };

    

  axios.post('/api/auth/login', data)
  .then(response => {
    if (response.status === 201) {
      alert(response.data.message);
      const username = encodeURIComponent(response.data.username); // encode the username for use in the URL
      window.location = `${response.data.redirect}`; // include username in query string
      form.reset();
    } else {
      alert('Failed to login');
    }
  })
  .catch(error => {
    alert('Failed to login');
    console.log(error);
  });
});

module.exports = login;