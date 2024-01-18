const express = require('express');
const router =  express.Router();
const {getBingoBoardNumbers} = require('../apiHandler/fillBingoBoard')
const {convertOneDArrayIntoTwoDArray} = require('../scripts/convertBingoNumberIntoTwoDArray');
const {updatePlayerBingoBoard} =  require('../apiHandler/updatePlayerBingoBoard');
const {crossTheBingoNumber} =  require('../apiHandler/bingoNumberCrossed');
const checkUser = require('../middleware/checkUser');

router.route('/getNumbers')
.post(async (req,res)=>{
   let numbers =   getBingoBoardNumbers() 
   console.log("Numbers in the server side is "+  numbers)
   res.status(200).json({message: "Numbers Generated Successfully", listOfNumbers: numbers});
})
router.route('/setBingoNumber')
.post(async (req,res)=>{
    // bingoBoard is a 2D 5*5 array
    const bingoBoard = convertOneDArrayIntoTwoDArray(req.body.numbers);
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