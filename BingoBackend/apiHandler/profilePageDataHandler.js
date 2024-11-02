require('dotenv').config();
const databasePromise = require('./databaseConnector.js');
const { ObjectId } = require('mongodb');

// return the user firstName, lastName and the email from the database.
async function getUserData(userId) {
        try {
            const database = await databasePromise;
		    const collection =  database.collection('users');
            const data =  await collection.find({_id: ObjectId(userId)}).toArray();
            userData = {
                firstName: data[0].firstName,
                lastName: data[0].lastName,
                email: data[0].userName
            }
            return userData;
        }
        catch (error) {
            console.error('Error connecting to the database ', error);
        }

}

module.exports = {getUserData};