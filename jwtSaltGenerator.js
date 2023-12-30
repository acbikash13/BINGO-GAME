const crypto = require('crypto');

// Generate a random JWT salt with a specified length (e.g., 32 characters)

function  generateJWTSalt(length) {
    return crypto.randomBytes(length).toString('hex');
}
module.exports = {generateJWTSalt}


