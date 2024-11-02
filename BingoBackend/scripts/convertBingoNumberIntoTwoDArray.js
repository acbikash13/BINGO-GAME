
// this function takes a one dimensional list and converts it into a 5*5 array. We use this function to receive the numbers list filled in the BingoBoard from the client and convert it into the 5*5 matrix and update our players playerstate in the game document in our data base.
function convertOneDArrayIntoTwoDArray(listOfNumbers){
    let bingoBoardForThePlayer = []
    for(let i= 0; i< 25; i= i+5){
        // push the numbers in the rows and the push the row in the BingoBoard
        let rowInBingoBoard = [];
        for(let j=i; j< i+ 5; j++){
            rowInBingoBoard.push(listOfNumbers[j])
        }
        bingoBoardForThePlayer.push(rowInBingoBoard);

    }
    return bingoBoardForThePlayer;
}
module.exports ={convertOneDArrayIntoTwoDArray};
