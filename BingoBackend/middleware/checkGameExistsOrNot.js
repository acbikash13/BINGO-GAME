const databasePromise = require('../apiHandler/databaseConnector');

// checkUser functions returns the userId if the user is authorized
// if the user is not authorized, it returns false.
// it checks whether the user is valid or not based on the jtw token we get from the client.

async function checkGameExistsOrNot(gameId) {
    const database = await databasePromise;
	const collection =  database.collection('games');
    let result  = await  collection.find({gameId:gameId}).toArray();
    if(result.length > 0) {
        // user is authorized. Return the user's ID.
        return {status: 200, message: 'Games Exists!'}
    }
    else {
       return {status:404, message: 'Sorry the gameId you mentioned does not exist.'}
    }
}

module.exports = checkUser;