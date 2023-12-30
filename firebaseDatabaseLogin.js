  // Import the functions you need from the SDKs you need.. Use typoe = moudule in the script tag in your html
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBMTQ-TgtpszKlfmvtb1hOuIQ0iznWlVTc",
    authDomain: "baghchal-78111.firebaseapp.com",
    projectId: "baghchal-78111",
    storageBucket: "baghchal-78111.appspot.com",
    messagingSenderId: "590270718783",
    appId: "1:590270718783:web:20b23fc3e12796e22fe98a",
    measurementId: "G-4ZQ4VE8DN4"
  };

  // Initialize Firebase
    initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth =  firebase.auth();
    const database = firebase.database()

    function register() {
        //get all the input fields from our files
        const form =  document.getElementById('signup-form');
        form.addEventListener("submit", (event)=>{
            event.preventDefault();
            const firstname = form.firstName.value;
            const lastname = form.lastName.value;
            const age = form.age.value;
            const email = form.email.value;
            const password = form.password.value;
            const phone = form.phone.value;
    
            const data = {
                firstname: firstname,
                lastname: lastname,
                age: age,
                email: email,
                password: password,
                phone: phone
            };
            axios.post('/api/auth/signup', data)
                .then(response => {
                //window.location = response.data.redirect;
                form.reset();
                })
                .catch(error => {
                    console.log(error);
                    alert('Failed to signup');
                });
            });

    }
    //validate the email address we enter.
    function validateEmailAddress(email) {
        // check if the email address is in the @format or not.
       expression =/[^\s@]+@[^\s@]+\.[^\s@]+/
       if(expression.test(email) == true) {
        return true
       }
       else {
        // email is not good
        return false
       }
    }
