const express = require('express');
const router =  express.Router();
const path = require('path');
const {getPlayersJoinedNames} = require('../scripts/getPlayersList');
const {setReadyForGame,startGameByHost} = require('../apiHandler/startGameHandler');
const checkUser = require('../middleware/checkUser');



// when a user hosts the game, it uses this route
router.route("/hostGame/waitingRoom").
get(async (req,res) => { 
    let userIsValid =  await checkUser(req.cookies['jwt']);
    console.log("The user is valid " +userIsValid)
    try {
        if(userIsValid) {
            let gameId = Number(req.query.gameId);
            // playersName is a list of the name of all the players 
            let playersName = await getPlayersJoinedNames(gameId);
            console.log(playersName)
    
            let data = {
                playersName:JSON.stringify(playersName),
                gameId:gameId,
                role: 'host',
                userId:userIsValid
    
            }
            res.render('waitingRoom.ejs', data);
        }
        else {
            return res.status(401).json({ message: 'User is not authorized' }); 
        }
    }
    catch (err) {
        console.error(err);
        return { status: 500, message: "An unexpected error occurred. Please try again later." };
    }
});


//when a user join this game, it uses this route.
router.route("/joinGame/waitingRoom").
get(async (req,res) => {
    
    try {
        const userIsValid = await checkUser(req.cookies['jwt']);
        console.log("The user is valid " +userIsValid)
        if(userIsValid) {
            let gameId = req.query.gameId;
            let playersName = await getPlayersJoinedNames(gameId);
            let data = {
                playersName:JSON.stringify(playersName),
                gameId:gameId,
                role :  "joinee",
                userId: userIsValid
            }
            res.render('waitingRoom.ejs', data);
        }
    
        else {
            res.status(401).json({ message: 'User is not authorized' }); 
        }

    }
    catch(error) {
        console.error(error);
        return { status: 500, message: "An unexpected error occurred. Please try again later." };

    }

    
});
//handler for start Game
router.route("/startGame").
post(async (req,res) => {
    try {
        console.log("server side startGame")
        // return a userId if the user is authenticated and authorized to access this endpoint
        const userIsValid = await checkUser(req.cookies['jwt']);
        if (userIsValid) {
            const gameId = req.body.gameId;
            console.log("server side gameID " +  gameId)
            let startGameStatus = await startGameByHost(userIsValid,gameId);
            res.status((startGameStatus).status).json({message : startGameStatus.message,userId:userIsValid});
        }
        else  {
            return res.status(401).json({ message: 'User is not authorized' }); 
        }
    }
    catch (error) {
        console.error(error);
        return { status: 500, message: "An unexpected error occurred. Please try again later." };
    }    
});

// handle the ready status for a game
router.route("/setReady")
.post(async (req,res) => {

    try {
        // return a userId if the user is authenticated and authorized to access this endpoint
        const userIsValid = await checkUser(req.cookies['jwt']);
        console.log("server side set ready")
        if(userIsValid) {
            const gameId = req.body.gameId;
            let setIsReadyToTrue = await setReadyForGame(userIsValid,gameId);
            res.status((setIsReadyToTrue).status).json({message : setIsReadyToTrue.message,userId:userIsValid});
        }
        else {
            res.status(401).json({ message: 'User is not authorized' }); 
        }
    }
    catch(error) {
        console.error(error);
        return { status: 500, message: "An unexpected error occurred. Please try again later." };
    }
});
module.exports = router;