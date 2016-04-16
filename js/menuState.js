var menuState = {
    create: function() {
        var nameLabel = game.add.text(80, 80, 'LD35 - Shapeshift', {font: '50px Arial', fill: '#ffffff'});
        var startLabel = game.add.text(80, 500, 'SPACE to start', {font: '24px Arial', fill: '#ffffff'});
        var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacekey.onDown.addOnce(this.start, this);
    },

    start: function() {
        game.state.start('username');
    }
}
