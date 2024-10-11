
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
