const express = require('express');
const router =  express.Router();
const {getBingoBoardNumbers} = require('../apiHandler/fillBingoBoard')
const {convertOneDArrayIntoTwoDArray} = require('../scripts/convertBingoNumberIntoTwoDArray');
const {updatePlayerBingoBoard} =  require('../apiHandler/updatePlayerBingoBoard');
const {crossTheBingoNumber} =  require('../apiHandler/bingoNumberCrossed');
const {getPlayersList} = require('../apiHandler/getPlayerList');
const checkUser = require('../middleware/checkUser');
const {checkGameExistsOrNot} = require('../middleware/checkGameExistsOrNot');
const {getPlayerState} = require('../apiHandler/getPlayerState');
const {updatePlayerTurn} = require('../apiHandler/updatePlayerTurn');
const {getEntireGame} = require('../apiHandler/getEntireGame');



router.route('/getNumbers')
.post(async (req,res)=>{
   let numbers =   await getBingoBoardNumbers() 
   console.log("Numbers in the server side is "+  numbers)
   res.status(200).json({message: "Numbers Generated Successfully", listOfNumbers: numbers});
})
router.route('/setBingoNumber')
.post(async (req,res)=>{
    // bingoBoard is a 2D 5*5 array
    const bingoBoard = await convertOneDArrayIntoTwoDArray(req.body.numbers);
    console.log("BingoBoard in the route is " + bingoBoard)
    let gameId = req.body.gameId;
    const userIsValid = await checkUser(req.cookies['jwt']);
    if(userIsValid) {
        let setBingoBoard = await updatePlayerBingoBoard(userIsValid,gameId,bingoBoard);
        res.status(setBingoBoard.status).json({message:setBingoBoard.message});
    }
    else{
        res.status(401).json({ message: 'User is not authorized' }); 
    }
});

// returns the list of players in the game only if the user is authorized and the user is in the game itself.
router.route('/getPlayersList')
.post(async (req,res)=>{
    let gameId =  req.body.gameId;
    const playerList = await getPlayersList(gameId);
    const userIsValid = await checkUser(req.cookies['jwt']);
    if (!userIsValid) {
        return res.status(401).json({ message: 'User is not authorized' });
    }
    if(playerList.status === 404) {
        return res.status(404).json({message:playerList.message});
    }
    if(playerList.status === 500) {
        return res.status(500).json({message:playerList.message});
    }

    const playerIdsList =  playerList.playerList
    // Only send the playerList if the user is authorized and the user is in the game itself.
    for (let playerId of playerIdsList) {
        if(playerId === userIsValid) {
            console.log("The players list is " + playerIdsList)
            return res.status(playerList.status).json({
                message:playerList.message,
                playerList:playerList.playerList,
                userId: userIsValid
            });
        }
    }

    return res.status(401).json({ message: 'User is not in the game! So can not give the list of all the users in that game.' });
})

// return the playerState
router.route('/getPlayerState')
.post   (async (req,res)=>{
    let gameId = req.body.gameId;
    const doesGameExist = await checkGameExistsOrNot(gameId);
    const userIsValid = await checkUser(req.cookies['jwt']);
    console.log("User is valid or not " + userIsValid + " GameId is " + gameId +  " doesGameExist is " + doesGameExist.status);
    if (!userIsValid) {
        return res.status(401).json({ message: 'User is not authorized to access the playerState' });
    }
    if(doesGameExist.status === 404) {
        console.log("Game does not exist to return the player state")
        return res.status(404).json({message:doesGameExist.message});
    }
    if(doesGameExist.status === 500) {
        console.log("Internal server error in checking the game exists or not")
        return res.status(500).json({message:doesGameExist.message});
    }
    const playerState = await getPlayerState(gameId,userIsValid);
    return res.status(playerState.status).json({message:playerState.message,playerState:playerState.playerState});

 });

 router.route('/updatePlayerTurn')
 .post  (async (req,res)=>{ 
    let gameId = req.body.gameId;
    const userIsValid = await checkUser(req.cookies['jwt']);
    if (!userIsValid) {
        return res.status(401).json({ message: 'User is not authorized to update the player turn' });
    }
    const playerTurnStatus = await updatePlayerTurn(gameId,userIsValid);
    return res.status(playerTurnStatus.status).json({message:playerTurnStatus.message,gameDocument:playerTurnStatus.gameDocument});
 })

 router.route('/getEntireGame')
 .post  (async (req,res)=>{ 
    let gameId = req.body.gameId;
    const userIsValid = await checkUser(req.cookies['jwt']);
    if (!userIsValid) {
        return res.status(401).json({ message: 'User is not authorized to update the player turn' });
    }
    const gameDocument = await getEntireGame(gameId,userIsValid);
    return res.status(gameDocument.status).json({message:gameDocument.message,gameDocument:gameDocument.gameDocument});
 })


router.route('/crossTheNumber')
.post(async (req,res)=>{
    let gameId =  req.body.gameId;
    const userIsValid = await checkUser(req.cookies['jwt']);
    let bingoNumber = req.body.number;
    console.log("Bingo number in the route is " + bingoNumber)
    if(userIsValid) {
        let crossNumberStatus = await crossTheBingoNumber(gameId,bingoNumber);
        res.status(crossNumberStatus.status).json({message:crossNumberStatus.message});
    }
    else {
        res.status(401).json({ message: 'User is not authorized' }); 
    }
})
module.exports = router;