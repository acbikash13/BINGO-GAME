require('dotenv').config();
const databasePromise = require('./databaseConnector.js');
const url = require('url');
jwtsalt = process.env.JWT_SALT;
jwtExpiration = process.env.JWT_EXPIRATION;
const jwt = require('jsonwebtoken');

async function handleOAuth2Callback(oAuth2Client, req, res) {
    try {
        const queryParams = new URL(req.url, 'http://localhost:8000').searchParams;
        const authorizationCode = queryParams.get('code');

        const tokenResponse = await oAuth2Client.getToken(authorizationCode);
        const { tokens } = tokenResponse;
        oAuth2Client.setCredentials(tokens);

        const idTokenVerification = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const userPayload = idTokenVerification.getPayload();

        const googleUserId = userPayload['sub'];
        const userFirstName = userPayload['given_name'];
        const userLastName = userPayload['family_name'];
        const userEmail = userPayload['email'];

       // Create custom JWT token
       const jwtToken = jwt.sign(
        { googleUserId, userFirstName, userLastName, userEmail },
        jwtsalt,
        { expiresIn: '10h' }
        );

        const database = await databasePromise;
        await database.collection('users').updateOne(
            { googleId: googleUserId },
            { 
                $set: { 
                    googleId: googleUserId, 
                    firstName: userFirstName, 
                    lastName: userLastName, 
                    userName: userEmail,
                    accessToken: tokens.access_token, 
                    idToken: tokens.id_token,
                    jwt: jwtToken 
                } 
            },
            { upsert: true }
        );


        // Set custom JWT token in the Authorization header
        res.cookie('jwt', jwtToken, { httpOnly: true, secure: true });
        res.redirect('/homePage');
    } catch (error) {
        console.error("Error during OAuth callback processing:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { handleOAuth2Callback };
