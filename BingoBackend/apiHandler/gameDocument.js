const gameDocument ={
    "gameId": 11111,                   // Unique identifier for the game, it would be created later and needs to be checked
    "players": [
      {
        "username": "bikash",      // username for player 2
        "role": "OOO",                // Role of player 1 (tiger or goat) need to update 
                                    //from the game by checking who ever chooses to be whichever
        "ready": true,              // Flag to indicate if the player is ready to start the game
      },
      {
        "username": "Bikash",      // Unique identifier for player 2
        "role": "OOO",                 // Role of player 2 (tiger or goat)
        "ready": true,                   // Flag to indicate if the player is ready to start the game
      }
    ],
    "board": {
      "intersections": [    // need to work on this game structure
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
      ],
      "goats_captured": 0,            
      "turn": "player1_id",           // Player ID of the player whose turn it is
      "phase": "placing",             // Game phase (placing or moving)
      "winner": null                  // Player ID of the winner (null if the game is ongoing or tied)
    }  
  };
module.exports = gameDocument;