playState = {
    preload: function() {

                game.load.spritesheet("treea","img/TreeA.png",32,32,64);
                game.load.spritesheet("treeb","img/TreeB.png",32,32,64);
                game.load.spritesheet("treec","img/TreeC.png",32,32,64);
    },

    create: function() {
        this.keyboard = game.input.keyboard;
        var spacekey = this.keyboard.addKey(Phaser.Keyboard.ESC);
        spacekey.onDown.addOnce(this.pause, this);

        this.lasttime = game.time.now;

        game.socket.on("worldState", function(data) {game.state.getCurrentState().onWorldState(data);});
        game.gameScene = new Scene();


        for(y = 0;y < game.gameScene.world.staticEntities.length;y++)
        {
            for(x = 0;x < game.gameScene.world.staticEntities[y].length;x++)
            {
                Type = "treea";
                if     (game.gameScene.world.staticEntities[y][x] == 1) Type = "treeb";
                else if(game.gameScene.world.staticEntities[y][x] == 2) Type = "treec";

                sprite = game.add.sprite(x*32,y*32,Type);
            }
        }
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
