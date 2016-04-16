
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('username', usernameState);
game.state.add('play', playState);
//game.state.add('death', winState);

game.state.start('boot');
