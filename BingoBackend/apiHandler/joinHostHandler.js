
const databasePromise = require('./databaseConnector.js');
const {createGameDocument} = require('./createGameDocument.js');
const { ObjectId } = require('mongodb');

// generate the random number everythime a game is created. It uses timestamp to the milliseconds 
//return the gameId after parsing it as a number/integer
// the timestamp should be unique for our purpose. We might need to change it if same games are created at the same point of time
function generateUniqueGameId() {
    const timestamp = new Date().getTime();
    const gameId = `${timestamp}`;
    return parseInt(gameId);
}

// handles the hostGame functionality.
async function hostGame(userId) {
    try {
        const database = await databasePromise;
		const collection =  database.collection('games');
        // Generate a unique gameID. This gameId will be used by the other players to join the game 
        const uniqueGameId = generateUniqueGameId();
        console.log("Your gameId is "+uniqueGameId);
        gameDocument =  createGameDocument();
        gameDocument.gameId = (uniqueGameId);
        // get the userName of this user
        let userName = await database.collection('users').findOne(
            {_id:ObjectId(userId)}, 
            {projection:{firstName:1}});
            console.log("UserName in the host Game is "  +  userName.firstName)
        
        //insert the player into the playersJoined list. Simply insert the userId which is unique for each player. This list will dictate the player turn
        gameDocument.bingoBoard.playersJoined.push(userId);    
        // we can have the userName as the userId which is unique for each player.
        gameDocument.bingoBoard.playerStates[0].displayName  = userName.firstName;
        gameDocument.bingoBoard.playerStates[0].userId = userId;
        // set the role of the player who hosted the game as host so that only the host can start the game.
        gameDocument.bingoBoard.playerStates[0].role = 'host';
        console.log("Before insert game document")
        let createGame =  await collection.insertOne(gameDocument);
        console.log(createGame)
        if(createGame.acknowledged) {
            return {status: 201,message:"You have successfully created the game!", uniqueGameId:uniqueGameId};
        }
        else {
            return {status: 400,message:"Unable to create a game! Please try again!"}
        }
    
        
    }
    catch (err) {
        console.error(err);
        return err;
    }
}


// handles the join game functionality. It checks whether the game exists or not and if it exists, it inserts the player into that game. The function takes two parameters, the userId of the user who joined the game and the gameId. We check whether the game exists using the gameId
async function joinGame(userId,gameId) {
    try {
        const database = await databasePromise;
        const collection =  database.collection('games');
        let game =  await collection.find({gameId:gameId}).toArray();
        // this gets the playerStates and we can update the information in the playerStates[0] with this user and insert it into our game playerStates array in the game document in our database
        let playerStateForThisPlayer =  createGameDocument().bingoBoard.playerStates[0];
        if(game.length == 1) {
            //insert the gameId for the player in the playersJoined list in the game document
            game[0].bingoBoard.playersJoined.push(userId);  
            // get the first name of the user who is joining the game
            let displayNameForThePlayer = await database.collection('users').findOne(
                                                {_id:ObjectId(userId)}, 
                                                {projection:{firstName:1}}
                                                );
            //update the displayName to that of the firstName of the player, and set the userName with userId which is unique for each player
            playerStateForThisPlayer.displayName = displayNameForThePlayer.firstName;
            playerStateForThisPlayer.userId = userId;
            playerStateForThisPlayer.role = "joinee";
            // insert the player into this game
            console.log("The player state in the join game is " + playerStateForThisPlayer.board);
            game[0].bingoBoard.playerStates.push(playerStateForThisPlayer);
            // handle cases where the update is not successfull
            let updateResult =  await collection.updateOne({gameId:gameId},{
                $push :{"bingoBoard.playerStates" : playerStateForThisPlayer,
                "bingoBoard.playersJoined":userId

                }
            });
            if(updateResult.modifiedCount === 0) {
                return {status: 400,message:"Update field. Please try again to join the game!"}
            }
            else {
                return {status: 201,message:"Update Successfull. Player joined the game successfully!"}
            }
        }  
        else {
            return { status: 406, message:"The game does not exists, please check your game Id!"};
        };
    }
    catch (err) {
        console.error(err);
        return err;
    }

}
module.exports = {joinGame,hostGame};