var pauseState = {
    create: function() {
        var nameLabel = game.add.text(game.width/2, game.height/2-100, 'Paused', {font: '50px Arial', fill: '#FFFFFF'});
        var returnLabel = game.add.text(game.width/2, game.height/2-20, 'Press (SPACE) To return to the game', {font: '50px Arial', fill: '#7a7a7a'});
        nameLabel.anchor.set(0.5, 0.5);
        returnLabel.anchor.set(0.5, 0.5);
        var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacekey.onDown.addOnce(this.start, this);
    },

    start: function() {
        game.state.start('play');
    },

    onWorldState: function(data) {
        game.gameScene.fromState(data);
    },

    onKeyDown: function(e) {

    },

    onKeyUp: function(e) {

    },

    startAttack: function(data) {}
}
