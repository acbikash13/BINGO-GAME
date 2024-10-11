const databasePromise = require('./databaseConnector.js');

async function playerLeftTheWaitRoom(userId,gameId) {
    const database = await databasePromise;
    const collection =  database.collection('games');
    try {
        const result = await collection.updateOne({gameId:Number(gameId)}, {$pull:{'bingoBoard.playerStates':{userId:userId}}})
        if (result.modifiedCount === 1) {
            // Player was successfully removed from the game
            return {status: 200, message: "Player left the game!"}
          } else {
            // Player not found in the game
            return {status: 401, message: "Player not found to leave the game!"}
          }
    }
    catch (error) {
        return {status:500, message:`Error removing player from game: ${error}`, error:error};
    }
}
module.exports = {playerLeftTheWaitRoom}