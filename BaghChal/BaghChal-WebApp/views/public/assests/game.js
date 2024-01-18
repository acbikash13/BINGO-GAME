// const config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     scene: {
//         preload: preload,
//         create: create,
//         update: update
//     }
// };

// const game = new Phaser.Game(config);
// const Phaser = require('phaser');

class GameSchene extends Phaser.Scene {
    constructor(){
        super('GameScene')
    }

    // Load your game assets here
    preload() {
        this.load.image('sky', '/view/public/assests/sky.png');
    }
 
    // Create your game elements and logic here
    create() {
        this.add.image(400, 300, 'sky');
    }

    // Update the game elements and logic here
    update ()
    {
    }
}
  
const gameBoardContainer = document.getElementById('game-board-container');

const gameConfig = {
    type: Phaser.AUTO,
    parent: gameBoardContainer,
    width: 800,
    height: 600,
    scene: [GameSchene]
};
const game = new Phaser.Game(gameConfig);
  
  
  