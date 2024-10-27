const databasePromise = require("./databaseConnector.js");
const { computeBingoScore } = require("./computeBingoScore.js");

// this function returns the playerState of the player with the given userId in the game with the given gameId
async function getBingoCount(gameId, userId) {
  let database = await databasePromise;
  let collection = database.collection("games");
  try {
    // Find the game by gameId
    const playerListObject = await collection
      .find({ gameId: Number(gameId) })
      .toArray();
    if (playerListObject.length !== 1) {
      return {
        status: 404,
        message: "Game not found! Cannot work on getting the player List!",
      };
    }
    // Get the playerStates array from the bingoBoard object
    let playerState = playerListObject[0].bingoBoard.playerStates;
    // Find the player with the matching userId
    let player = playerState.find((p) => p.userId === userId);

    if (player) {
      bingoCount = computeBingoScore(player.board);

      // Update the bingoCount for the player in the database
      let playerIndex = playerState.findIndex((p) => p.userId === userId);
      let bingoCountFromDb = playerState[playerIndex].bingoCount;
      if (bingoCountFromDb === bingoCount) {
        console.log("Bingo count is already up to date.");
        return {
          status: 200,
          message: "Bingo count is already up to date.",
          bingoCount: bingoCount,
        };
      }
      else {
        let updateResult = await collection.updateOne(
          { gameId: Number(gameId) },
          { 
              $set: { 
                  [`bingoBoard.playerStates.${playerIndex}.bingoCount`]:  bingoCount 
              } 
          }
          );

          if (updateResult.matchedCount !== 1) { 
            console.log("Player and game not found");
            return {status: 404, message: "Player and game not found.", bingoCount: bingoCount};
          }
          console.log("Bingo count updated successfully.");
          return {status: 200, message: "Bingo count updated successfully.", bingoCount: bingoCount};
        }
    } else {
      return {
        status: 404,
        message: "Player not found with the given userId.",
        playerState: null,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message:
        "An unexpected error occurred when getting playerState. Please try again later.",
      error: error,
    };
  }
}

module.exports = { getBingoCount };
