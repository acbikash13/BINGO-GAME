// this function generate the numbers from 1 -25 randomly for the BINGO Board and returns the list of that numbers
// keep adding the unique numbers between 1 and 25 to the list above until we have 25 unique numbers.
//generate a random number between 1 and 25 and add it to the list if it is not already in the list.
function getBingoBoardNumbers() {
    var randomNumbersBtwnOneAndTwentyFive = [];
    do{
        let num = Math.floor(Math.random() * 25 +1);
        if(!(randomNumbersBtwnOneAndTwentyFive.includes(num))){
            randomNumbersBtwnOneAndTwentyFive.push(num);
        }
    }
    while((randomNumbersBtwnOneAndTwentyFive.length !==25));
    return randomNumbersBtwnOneAndTwentyFive;
}

