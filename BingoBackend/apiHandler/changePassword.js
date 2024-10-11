require('dotenv').config();
const salt =  process.env.BCRYPT_SALT;
const jwtExpiration = process.env.JWT_EXPIRATION;

const { ObjectId } = require('mongodb');
const databasePromise = require('./databaseConnector.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let {generateJWTSalt} =  require('../../jwtSaltGenerator');

// changes the password for a user and changes the jwt token in the database. changePassword function receives the userId and the newPassword
async function changePassword(userId,newPassword) {
    try {
        
        const database = await databasePromise;
		const collection =  database.collection('users');
        // encrypt the password before saving into the database
        newPassword = bcrypt.hashSync(newPassword,salt).replace(`${salt}.`,'');
        //generate a jwt salt
        jwtsalt = generateJWTSalt(64);
        // change the password as well as set the jwt to something else.
        let token = jwt.sign({id:userId},jwtsalt,{expiresIn:jwtExpiration});
        await collection.updateOne({_id:ObjectId(userId)},
            {$set:{
                    password:newPassword, 
                    jwt:token
                }
        });
    }
    catch(error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error!'});
    }  
};

module.exports = {changePassword}
