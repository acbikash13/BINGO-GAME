const databasePromise = require('../apiHandler/databaseConnector.js');
const {getFirstName} =  require('./getFirstName.js')



async function getPlayersJoinedNames(gameId) {
    const database = await databasePromise;
    const collection =  database.collection('games');
    let game =  await collection.find({gameId:Number(gameId)}).toArray();
    console.log(game[0])
    if(game.length !=1) {
        console.log("Game not found")
        throw new Error('Game not found');
    }
    let playersName = [];
    let playersJoined = game[0].bingoBoard.playersJoined

    for (let userId of playersJoined) {
        let firstName = await getFirstName(userId);
        playersName.push({[userId]:firstName});
    }
    return playersName;
}
module.exports = {getPlayersJoinedNames};