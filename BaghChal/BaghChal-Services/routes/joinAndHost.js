const express = require('express');
const router =  express.Router();
const path = require('path');

const {joinGame, hostGame} = require('../apiHandler/joinHostHandler')

router.route('/host').get((req,res)=>{
    //send the user to the waiting page/room.
     res.sendFile(path.join(__dirname,'../views/public/GamePage.html'));
})
.post((req,res)=> {
    //host a game
    hostGame(req,res);
});

router.route('/join').get((req,res)=>{
    //send the user to the waiting page/room
    res.sendFile(path.join(__dirname,'../views/public/GamePage.html'));
})
.post((req,res)=> {
    //join the hosted game
    joinGame(req,res);
});

module.exports = router;