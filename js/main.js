var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');

game.state.add('boot'       , bootState);
game.state.add('load'       , loadState);
game.state.add('menu'       , menuState);
game.state.add('username'   , usernameState);
game.state.add('play'       , playState);
game.state.add('pause'      , pauseState);

game.state.start('boot');

function adjust() {
    //var divgame = document.getElementsByTagName("canvas")[0];
    var height = window.innerHeight;
    var width = window.innerWidth;
    game.width = width;
    game.height = height;
    //game.stage.bounds.width = width;
    //game.stage.bounds.height = height;
    if (game.renderType === Phaser.WEBGL){
        game.renderer.resize(width, height);
    }
}
window.addEventListener('resize', function() {
    adjust();
    alert("To fix the camera centering please refresh the game");
});
