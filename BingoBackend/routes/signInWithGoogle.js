const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const express = require('express');
const router =  express.Router();
const { OAuth2Client } = require('google-auth-library');

const {handleOAuth2Callback} = require('../apiHandler/googleAuthHandler.js');


const oAuth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'http://localhost:8000/homePage' // Ensure this matches the registered redirect URI in the google cloud console
);

router.route("/authurl")
.get((req,res) => {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile',
      });
      res.json({ url: authorizeUrl });
    handleOAuth2Callback(req,res);
});
module.exports = router;