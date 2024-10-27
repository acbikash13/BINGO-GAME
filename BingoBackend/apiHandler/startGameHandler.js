const databasePromise = require('./databaseConnector.js');


//this function takes the userId and the gameId to set the player status ready for the game. When every player status is set ready then only the game can be started.
async function setReadyForGame(userId, gameId) {
    try {
        const database =  await databasePromise;
        const collection =  database.collection('games');
        // check whether the gameExists or not first
        let game  =  await collection.find({gameId: Number(gameId)}).toArray();
        if(game.length != 1) {
            return {status: 404, message: "Game not found!"}
        }

        // update the isReady status for the user with the userId "userId"  to ready
        let isReadyUpdateToTrue = await collection.updateOne(
            { 
                gameId: gameId, 
                "bingoBoard.playerStates.userId": userId
            },
            { 
                $set: { "bingoBoard.playerStates.$.isReady": true } 
            }
        );
       
        // Check if the update was successful
        if (isReadyUpdateToTrue.matchedCount === 0) {
            return {status: 404, message: "No document was matched for that player in that game. Unable to change the status of the isReady to true"}
        } else if (isReadyUpdateToTrue.modifiedCount === 0) {
            return {status: 200, message: "Document matched for that player in that game but unable to change the status of the isReady to true. The player might already be ready."}
        } else {
            return {status:200, message: "Successfully changed the isReady status to true."}
        }
                
    }
    catch (err) {
        console.error(err);
        return { status: 500, message: "An unexpected error occurred. Please try again later." };
    }
}

async function startGameByHost(userId,gameId) {
    try {
        const database =  await databasePromise;
        const collection =  database.collection('games');
        // wehave to first check if the role of the user trying to start the game is host or not. Only if it is host, the user should be allowed to start the game. If not it should not be allowed to start the game.
        // find the game and the role of the user
        
        // set the player's status isReady to ready.
        await setReadyForGame(userId,gameId);
        let game  =  await collection.find({gameId: Number(gameId)}).toArray();
        if(game.length != 1) {
            return {status: 404, message: "Game not found!"}
        }
        let playerRole = game[0].bingoBoard.playerStates.find(player => player.userId === userId);
       
        if(!playerRole.role) {
            return { status: 404, message: "Player not found in the game!" };

        }
        if(playerRole.role != "host") {
            return { status: 403, message: "Only the host can start the game!" };
        }
        
        // Now check if all the player have set their isReady status to true or not. Only if every player's isReady status is true then only the host can start the game.
        // this returns true if all the player's is ready status is true. This is an array prototype function
        const allPlayersReady = game[0].bingoBoard.playerStates.every(players => players.isReady);
        if(!allPlayersReady) {
            return {status:403, message: "All the players are not ready!"}
        }
        return {status:200, message: "Sucessfully started the game! Taking you to the game page!"};


    }
    catch (error) {
        console.error(error);
        return { status: 500, message: "An unexpected error occurred. Please try again later." };
    }

}

module.exports = {setReadyForGame,startGameByHost};

    
    



