
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

// update the user information
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
