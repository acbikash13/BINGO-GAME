const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const { OAuth2Client } = require('google-auth-library');

function oAuth2Client()  {
    const oAuth2Client = new OAuth2Client(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        'https://bingogamee.azurewebsites.net/homePage' // Ensure this matches the registered redirect URI in the google cloud console
    );
    return oAuth2Client;
}
module.exports = {oAuth2Client};
