const databasePromise = require('./databaseConnector.js');

async function crossTheBingoNumber(gameId, bingoNumber) {
    let database = await databasePromise;
    let collection = database.collection('games');

    // we get the game document and get hte playerStates array and then find the bingoNumber and replace it with 0 for every players.
    
    try {
        // find the game for that particular game.
        const playerStatesForEveryPlayer = await collection.find({gameId:Number(gameId)}).toArray();

        if(playerStatesForEveryPlayer.length !==1 ) {
            console.log("game found");
            return {status:404, message:'Game not found! Can not cross the Bingo Number!'}
        }
        // get every players state in the game which is an arry of objects.
        let playerStatesObj = playerStatesForEveryPlayer[0].bingoBoard.playerStates

        //Now replace the bingo crossed number With the 0
        for(let aPlayer of playerStatesObj) {
            let bingoBoardForAPlayer = aPlayer.board
            // iterate through the bingoBoard and find 1
            for(let rows = 0; rows < 5 ;rows++) {
                for (let columns = 0; columns < 5; columns++) {
                    if(bingoBoardForAPlayer[rows][columns] ===Number(bingoNumber)){
                        bingoBoardForAPlayer[rows][columns] =0;
                        break;
                    }
                }
            }
        }
        const updatePlayerStates = await collection.updateOne({gameId: Number(gameId)},{
            $set :{"bingoBoard.playerStates":playerStatesObj},
            $push : {'bingoBoard.numbers':Number(bingoNumber)}
        })

        
        // Push the bingoNumber to the numbers array
        if (updatePlayerStates.modifiedCount > 0) {
            // Numbers crossed and pushed successfully
            return { status: 200, message: "Successfully crossed the Bingo Number." };
        } else {
            return { status: 401, message: 'Unable to find the number to Cross. Please try again or restart the game!'};
        }
    } catch (error) {
        console.error(error);
        return { status: 500, message: "An unexpected error occurred. Please try again later.", error: error };
    }
}


module.exports = {crossTheBingoNumber};