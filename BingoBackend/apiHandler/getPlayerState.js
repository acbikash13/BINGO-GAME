const databasePromise = require('./databaseConnector.js');

// this function returns the playerState of the player with the given userId in the game with the given gameId
async function getPlayerState(gameId, userId) {
    let database = await databasePromise;
    let collection = database.collection('games');
    try {
        // Find the game by gameId
        const playerListObject = await collection.find({ gameId: Number(gameId) }).toArray();
        if (playerListObject.length !== 1) {
            return { status: 404, message: 'Game not found! Cannot work on getting the player List!' };
        }

        // Get the playerStates array from the bingoBoard object
        let playerState = playerListObject[0].bingoBoard.playerStates;
        
        // Find the player with the matching userId
        let player = playerState.find(p => p.userId === userId);

        if (player) {
            return { status: 200, message: "Player found.", playerState: player };
        } else {
            return { status: 404, message: "Player not found with the given userId.", playerState: null };
        }

    } catch (error) {
        console.error(error);
        return { status: 500, message: "An unexpected error occurred when getting playerState. Please try again later.", error: error };
    }
}

module.exports = { getPlayerState };
