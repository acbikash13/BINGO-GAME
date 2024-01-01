const express = require('express');
const router =  express.Router();
const path = require('path');

// when a user hosts the game, it uses this route
router.route("/hostGame/waitingRoom").
get((req,res) => {
    data = {
        testMessage : 'Bikash Acharya',
        gameId : req.query.gameId
    }
    res.render('waitingRoom.ejs', data);
});

//when a user join this game, it uses this route.
router.route("/joinGame/waitingRoom").
get((req,res) => {
    data = {
        testMessage : 'Bikash Acharya',
        gameId : req.query.gameId
    }
    res.render('waitingRoom.ejs', data);
});
module.exports = router;