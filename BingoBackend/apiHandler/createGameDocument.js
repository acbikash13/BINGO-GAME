function createGameDocument(){
  return {
  gameId: 0, // Unique identifier for the game
  bingoBoard: {
      numbers: [], // Numbers from 1 to 25 in random order
      playersJoined :[], // include the userId which is unique. Users turn will be based on where they are in the list. 
      // One playerStates represent on player in a game and each players corresponding properties.
      
      playerStates: [
          {
              userId: "userId",
              role: "host/joinee",
              isReady : false,
              isFilled: false,
              isTurn : false,
              displayName: "firstName",
              board: [
                  [0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0]
              ],
              "isWinner": false,
              "bingoCount": 0
          }
          // Add more player states as needed
      ]
  }
}};

module.exports = {createGameDocument}


