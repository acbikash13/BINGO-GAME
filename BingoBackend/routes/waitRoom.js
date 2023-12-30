const express = require('express');
const router =  express.Router();
const path = require('path');

///serve the login page
router.route("/waitingRoom").
get((req,res) => {
    res.sendFile(path.join(__dirname,'../../BaghChal-WebApp/views/public/waitingRoom.html'));
});
module.exports = router;