const databasePromise = require('../apiHandler/databaseConnector');

// checkUser functions returns the userId if the user is authorized
// if the user is not authorized, it returns false.
// it checks whether the user is valid or not based on the jtw token we get from the client.

async function checkGameExistsOrNot(gameId) {
    try {
        const database = await databasePromise;
        const collection = database.collection('games');
        console.log(gameId)
        let result = await collection.find({ gameId: Number(gameId) }).toArray();
        console.log(result)
        if (result.length > 0) {
            // user is authorized. Return the user's ID.
            return { status: 200, message: 'Games Exists!' };
        } else {
            return { status: 404, message: 'Sorry the gameId you mentioned does not exist.' };
        }
    } catch (error) {
        return { status: 500, message: 'Internal Server Error', error: error.message };
    }
}
module.exports = {checkGameExistsOrNot};