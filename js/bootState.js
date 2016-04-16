var bootState = {
    create: function() {
        //game.physics.startSystem, Phaser.Physics.ARCADE);
        game.input.keyboard.onDownCallback = function(e) { game.state.getCurrentState().onKeyDown(e); };
        game.input.keyboard.onUpCallback = function(e) { game.state.getCurrentState().onKeyUp(e); };
        game.state.start('load');
    },

    onKeyDown: function(e) {

    },

    onKeyUp: function(e) {

    }
}
