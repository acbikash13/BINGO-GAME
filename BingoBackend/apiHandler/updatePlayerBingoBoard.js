const databasePromise = require('./databaseConnector.js');


async function updatePlayerBingoBoard(userId,gameId,newBoard) {
    const database = await databasePromise;
	const collection =  database.collection('games');
    try {
        let updatePlayerBoard= await collection.updateOne({
            gameId:Number(gameId), 'bingoBoard.playerStates.userId':userId
        },
        {$set:{
            'bingoBoard.playerStates.$.board' : newBoard,
            'bingoBoard.playerStates.$.isFilled': true
        }}
        )
        if(updatePlayerBoard.modifiedCount ===1) {
            return {status: 200, message: "Successfully set up the BingoBoard"}
        }
        else {
            return {status: 401, message: 'Unable to find the game or the player. Please try again or restart the game!'}
        }
    }
    catch(error){
        console.error(error);
        return { status: 500, message: "An unexpected error occurred. Please try again later." };
    }

}
module.exports ={updatePlayerBingoBoard};