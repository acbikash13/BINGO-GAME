const express = require('express');
const router =  express.Router();
const path = require('path');
const checkUser = require('../middleware/checkUser.js')
const {getUserData} = require('../apiHandler/profilePageDataHandler.js')

const {login,signup} = require('../apiHandler/authHandler.js');

const {changePassword} = require('../apiHandler/changePassword.js');
const { updateUsesrInformation } = require('../apiHandler/changeUserInformation.js');
const {joinGame,hostGame} = require('../apiHandler/joinHostHandler.js')
const { type } = require('os');

///serve the login page
router.route("/login").
get((req,res) => {
    res.sendFile(path.join(__dirname,'../../public/views/auth/login.html'));
});
router.route("").
get((req,res) => {
    res.sendFile(path.join(__dirname,'../../public/views/auth/login.html'));
});


// router to handle the login function
router.route("/api/auth/login").
post((req,res)=> {
    // authenticate the user.
    login(req,res);
});

// serves the signup page
router.route('/signup').get((req,res)=> {
    res.sendFile(path.join(__dirname,'../../public/views/auth/signup.html'));
});

// endpoint to handle the signup function
router.route("/api/auth/signup")
.post((req,res)=>{
    //sign up the user
    signup(req,res);
});


// get the homepage. Configure it in such a way that only authorized users are sent to this page
router.route("/homePage").
get(async (req,res) => {
    const userIsValid = await checkUser(req.cookies['jwt']);
    if(userIsValid) {
        res.sendFile(path.join(__dirname,'../../public/views/public/joinHost.html'));
    }
    else {
        res.status(401).json({ message: 'User is not authorized. Please login again to continue!'}); 
    }
});

//Route for hosting the game
router.route('/hostGame')
.post(async (req,res) => {
    const userIsValid = await checkUser(req.cookies['jwt']);
    console.log(userIsValid)
    if(userIsValid) {
        try {
            let hostedGame = await hostGame(userIsValid);
            res.status(hostedGame.status).json({message:hostedGame.message,gameId:hostedGame.uniqueGameId});
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
    else {
        res.status(401).json({ message: 'User is not authorized. Please login again to continue!' });
    }
})
//route for joining the game

router.route('/joinGame')
.post(async (req,res) => {
    const userIsValid = await checkUser(req.cookies['jwt']);
    if(userIsValid) {
        let gameId = req.body.gameId;
        console.log("Game id is while joining is "+ typeof(Number(gameId)));
        try {
            let joinGameResult = await joinGame(userIsValid, Number(gameId));
            console.log("The join Game result is " + joinGameResult.message)
            res.status(joinGameResult.status).json({ message: joinGameResult.message });
        } catch (err) {
            console.error(err);
            // Handle any unexpected errors that occurred during joinGame
            res.status(500).json({ message: "An unexpected error occurred" });
        }

    }
    else {
        res.status(401).json({ message: 'User is not authorized. Please login again to continue!' });
    }
})


//gets the profile page data for the respective user.
router.route('/profile')
.get(async (req,res) => {
    // Use async/await with checkUser. userIsValid will give us the userId if the user is valid else nothing.
    const userIsValid = await checkUser(req.cookies['jwt']);
    // send the user data in the profile.ejs template and send it to the user.
    if(userIsValid) {
        const user = await getUserData(userIsValid);
        res.render('profile.ejs', { user});
    }
    else {
        res.status(401).json({ message: 'User is not authorized. Please login first.' }); 
    }
});
// route for the changepassword
router.route('/profile/changePassword')
.post(async (req, res) => {
    const userIsValid = await checkUser(req.cookies['jwt']);
    if (userIsValid) {
        try {
            await changePassword(userIsValid, req.body.newPassword);
            res.status(200).json({ message: "Password successfully reset. Please login again for a smooth experience!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred while resetting the password." });
        }
    } else {
        return res.status(401).json({ message: 'User is not authorized. Please login first.' });
    }
});

router.route('/profile/updateProfileInformation')
.post (async (req,res) => {
    const userIsValid = await checkUser(req.cookies['jwt']);
    if (userIsValid) {
        try {
           const isUpdated =  await updateUsesrInformation(userIsValid, req.body);
           //only when the update is successful, we are going to send the client the okay status
           // use isUpdated  === true instead of just if(isUpdated) as isUpdated return an string error message and if statement will execute if we just do if(isUpdated). 
            if(isUpdated == true) {
                res.status(200).json({ message: "The update has been successfull!" });
            }
            else {
                res.status(400).json({ message: isUpdated});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred while resetting the password." });
        }
    } else {
        res.status(401).json({ message: 'User is not authorized. Please login first.' });
    }
});

router.route('/gamePage')
.get(async (req,res)=> {
    const userIsValid = await checkUser(req.cookies['jwt']);
    if(userIsValid) {
        res.sendFile(path.join(__dirname,'../../public/views/public/gamePage.html'));
    }
    else {
        res.status(401).json({ message: 'User is not authorized. Please login to continue' }); 
    }
});

router.route('/contact')
.get(async (req,res)=> {
        res.sendFile(path.join(__dirname,'../../public/views/public/contact.html'));

});
router.route('/getUserId')
.post(async (req,res)=> {
    const userIsValid =  await checkUser(req.cookies['jwt']);
    console.log("The use is id " +  userIsValid)
    if(userIsValid){
        res.status(200).json({userId:userIsValid});
    }
    else {
        res.status(401).json({ message: 'User is not authorized. Please login first.' });
    }
})



module.exports = router;