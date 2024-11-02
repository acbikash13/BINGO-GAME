// returns the bingo count of the player. If bingoCount == 5, we have a winner.
function computeBingoScore(playerStateArray) {
    let bingoScore = 0;
    //Traversing through row
    for (let row = 0; row <5 ; row ++) {
        count = 0;
        for (let col = 0; col < 5; col++) {
            if (playerStateArray[row][col] === 0) {
                count++;
            }
        }
        if (count === 5) {
            bingoScore++;
        }
    }
    //Traversing through column
    for (let col = 0; col <5 ; col ++) {
        count = 0;
        for (let row = 0; row < 5; row++) {
            if (playerStateArray[row][col] === 0) {
                count++;
            }
        }
        if (count === 5) {
            bingoScore++;
        }
    }
    //traversing the diagonal
    // check for two diagonals
    if (playerStateArray[0][0] === 0 && playerStateArray[1][1] === 0 && playerStateArray[2][2] === 0 && playerStateArray[3][3] === 0 && playerStateArray[4][4] === 0) {
        bingoScore++;
    }
    if (playerStateArray[0][4] === 0 && playerStateArray[1][3] === 0 && playerStateArray[2][2] === 0 && playerStateArray[3][1] === 0 && playerStateArray[4][0] === 0) {
        bingoScore++;
    }
    return bingoScore;
}

module.exports = { computeBingoScore };