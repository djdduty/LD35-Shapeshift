playState = {
    preload: function() {

    },

    create: function() {
        this.keyboard = game.input.keyboard;
        var spacekey = this.keyboard.addKey(Phaser.Keyboard.ESC);
        spacekey.onDown.addOnce(this.pause, this);

        this.lasttime = game.time.now;

        game.socket.on("worldState", function(data) {game.state.getCurrentState().onWorldState(data);});
        game.gameScene = new Scene();
    },

    onWorldState: function(data) {
        //console.log(data);
        //TODO: setup world state
        game.gameScene.fromState(data);
    },

    pause: function() {
        //This will preferably go to a pause screen rather than disconnect them outright, TODO
        game.state.start('pause');
    },

    update: function() {
        delta = (game.time.now - this.lasttime)*0.001;


        //this.sprite.position.x = (Math.cos(this.timer) * 200) + 400;
        //this.sprite.position.y = (Math.sin(this.timer) * 200) + 250;
    }
}
