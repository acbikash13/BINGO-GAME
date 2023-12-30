//login controller
const databasePromise = require('./databse.js');
const gameDocument = require('./gameDocument.js');
const jwt = require('jsonwebtoken');

// generate the random number everythime a game is created. It uses timestamp to the milliseconds and random number. 
function generateUniqueGameId() {
    // Get the current timestamp
    const timestamp = new Date().getTime();
  
    // Generate a random number between 0 and 9999
    const random = Math.floor(Math.random() * 10000);
  
    // Combine timestamp and random number to create the game ID
    const gameId = `${timestamp}${random}`;
  
    return gameId;
  }
  
  const uniqueGameId = generateUniqueGameId();
  console.log(uniqueGameId);
  
async function joinGame(req,res) {
    try {
        // const {gameId,userName} =  req.body;
        console.log(req.body.gameId + " and the  username is " + req.body.userName);
        console.log("the data type for gameid is : " +typeof(req.body.gameId));
        const database = await databasePromise;
		const collection =  database.collection('games');
        collection.find({gameId:req.body.gameId}).toArray(function(err,result){
            console.log("The result is " + result[0]);
            if(result.length == 1) {
                    joiningPlayer = players[1].username;
                    collection.updateOne({gameId:req.body.gameId},{$set :{joiningPlayer : req.body.userName}},function(err,result){
                        if (err) throw err;
                        res.status(201).json({message: "Successfully joined the Game."});
                    });
            }  
            else {
                res.status(406).json({message:"The game does not exists, please check your game Id."});
            }
        });
    }
    catch (err) {
        console.error(err);
    }

}

async function hostGame(req,res) {
    let {userName} = req.body;
    try {
        const database = await databasePromise;
		const collection =  database.collection('games');
        var gameId = 0;
        // find the total number of games in the game collection. We will assign the gameId for a game serially.
        collection.find().toArray(function(err,result) {
            gameIds= result.length +1;
            console.log("Your gameId is "+gameIds);
            gameDocument.gameId = (gameIds);
            console.log(typeof("the type of gamedoc.gameId is " +gameDocument.gameId));
            gameDocument.players[0].username = userName;
            collection.insertOne(gameDocument,function(err,result) {
                if (err) throw err;
                res.status(201).json({gameId: `Your game Id id ${gameIds}`});
            });
        })
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = {joinGame,hostGame};