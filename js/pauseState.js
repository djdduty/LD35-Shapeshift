var pauseState = {
    create: function() {
        var nameLabel = game.add.text(game.width/2, game.height/2, 'Paused', {font: '50px Arial', fill: '#7a7a7a'});
        nameLabel.anchor.set(0.5);
        var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacekey.onDown.addOnce(this.start, this);
    },

    start: function() {
        game.state.start('play');
    },

    onWorldState: function(data) {
        //this has to implement socket listeners and do something accordingly
        game.gameScene.fromState(data);
    },

    onKeyDown: function(e) {

    },

    onKeyUp: function(e) {

    }
}
