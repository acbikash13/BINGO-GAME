const databasePromise = require('./databaseConnector.js');

// this functions updates the players turn in the database.
async function getEntireGame(gameId, userId) {
    // get the whole game Document
    let database = await databasePromise;
    let collection = database.collection('games');
    try {
        // in the collection find the game with the given gameId
        const game = await collection.find({ gameId: Number(gameId) }).toArray();
        if (game.length !== 1) {
            console.log("Game not found. Cannot work on changing the player turn.");
            return { status: 404, message: 'Game not found! Cannot work on changing the player turn.' };
        }
        let gameDocument = game[0];
        // Get the playerStates array from the bingoBoard object
        let playerState = gameDocument.bingoBoard.playerStates;
    
        // Find the player with the matching userId and return 404 if not found or unauthorized if player does not exist for the given game.
        let player = playerState.find(p => p.userId === userId);
        if(!player) {
            return { status: 404, message: "Player not found with the given userId to get the whole game. Unauthorized access", gameState: null };
        }
        return { status: 200, message: "Successfully retrieved the entire game document", gameDocument: gameDocument };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "An unexpected error occurred when updating the player turn. Please try again later.", error: error };
    }
}

module.exports = { getEntireGame };
