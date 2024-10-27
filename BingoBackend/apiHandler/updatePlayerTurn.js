const databasePromise = require('./databaseConnector.js');

// this functions updates the players turn in the database.
async function updatePlayerTurn(gameId, userId) {
    // get the whole game Document
    let database = await databasePromise;
    let collection = database.collection('games');
    try {
        // in the collection find the game with the given gameId
        const game = await collection.find({ gameId: Number(gameId) }).toArray();
        if (game.length !== 1) {
            return { status: 404, message: 'Game not found! Cannot work on changing the player turn.' };
        }
        // get the whole game document

        let gameDocument = game[0];

        let numberOfPlayers = gameDocument.bingoBoard.playerStates.length;
        //find the index of the player whose turn is to be changed by matchin up with userId. gameDocument.bingoBoard.getPlayerState is an array of playerStates objects

        // Get the playerStates array from the bingoBoard object
        let playerState = gameDocument.bingoBoard.playerStates;
        
        // Find the player with the matching userId and return 404 if not found or unauthorized if player does not exist for the given game.
        let player = playerState.find(p => p.userId === userId);
        if(!player) {
            return { status: 404, message: "Player not found with the given userId for the give game. Unauthorized access", gameSatate: null };
        }
        let playerIndex = gameDocument.bingoBoard.playerStates.findIndex(p => p.userId === userId);
        // now update the isTurn of the player to false
        gameDocument.bingoBoard.playerStates[playerIndex].isTurn = false;
        // now update the isTurn of the next player to true
        gameDocument.bingoBoard.playerStates[(playerIndex + 1) % numberOfPlayers].isTurn = true;
        // update the game document in the database
        // replace the game document in the database
        let updatePlayerTurn = await collection.replaceOne({ gameId: Number(gameId) },gameDocument );

        if (updatePlayerTurn.modifiedCount === 1) {
            return { status: 200, message: "Successfully changed the player turn", gameDocument: gameDocument };
        } else {
            return { status: 401, message: 'Player turn Update was not successfull successfull. Unable to find the game or the player. Please try again or restart the game!'};
        }
    } catch (error) {
        console.error(error);
        return { status: 500, message: "An unexpected error occurred when updating the player turn. Please try again later.", error: error };
    }
}

module.exports = { updatePlayerTurn };
