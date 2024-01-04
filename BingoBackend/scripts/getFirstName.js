const databasePromise = require('../apiHandler/databaseConnector.js');
const { ObjectId } = require('mongodb');

async function getFirstName(userId) {
    const database = await databasePromise;
	const collection =  database.collection('games');
    let userName = await database.collection('users').findOne(
        {_id:ObjectId(userId)}, 
        {projection:{firstName:1}});
    
    return userName.firstName;
}
module.exports = {getFirstName}