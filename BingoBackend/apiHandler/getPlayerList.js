const databasePromise = require('./databaseConnector.js');

async function getPlayersList(gameId) {
    let database = await databasePromise;
    let collection = database.collection('games');

    // we get the game document and in the game document we have bingoBoard.playersJoined array which stores all the playersId who are in that game.
    try {
        // find the game for that particular game.
        const playerListObject = await collection.find({gameId:Number(gameId)}).toArray();
        if(playerListObject.length !==1 ) {
            return {status:404, message:'Game not found! Cannot work on getting the player List!'}
        }
        // get players list array in the game
        let playerList = playerListObject[0].bingoBoard.playersJoined
        return { status: 200, message: "Successfully crossed the Bingo Number.",playerList:playerList };

    } catch (error) {
        console.error(error);
        return { status: 500, message: "An unexpected error occurred when getting playersList. Please try again later.", error: error };
    }
}

module.exports = { getPlayersList };