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

        //addkey so that they don't register regular browser events like scrolling
        this.keyboard.addKeyCapture(Phaser.Keyboard.UP);
        this.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
        this.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
        this.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);

        this.lasttime = game.time.now;

        game.socket.on("worldState", function(data) { game.state.getCurrentState().onWorldState(data); });
        game.gameScene = new ClientScene();

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

    onKeyDown: function(e) {
        var direction = '';
        if(e.repeat === true) return;
        switch(e.code)
        {
            case 'ArrowUp':
                direction = 'N';
                break;
            case 'ArrowDown':
                direction = 'S';
                break;
            case 'ArrowLeft':
                direction = 'W';
                break;
            case 'ArrowRight':
                direction = 'E';
                break;
            case 'KeyS':
                console.log(game.gameScene.scene.players);
            default:
                return;
                break;
        }
        game.socket.emit('playerMove', {dir: direction, isDown: true});
    },

    onKeyUp: function(e) {
        var direction = '';
        if(e.repeat === true) return;
        switch(e.code)
        {
            case 'ArrowUp':
                direction = 'N';
                break;
            case 'ArrowDown':
                direction = 'S';
                break;
            case 'ArrowLeft':
                direction = 'W';
                break;
            case 'ArrowRight':
                direction = 'E';
                break;
            default:
                return;
                break;
        }
        game.socket.emit('playerMove', {dir: direction, isDown: false});
    },

    pause: function() {
        //This will preferably go to a pause screen rather than disconnect them outright, TODO
        game.state.start('pause');
    },

    update: function() {
        delta = (game.time.now - this.lasttime)*0.001;
        game.gameScene.update(delta);
        //this.sprite.position.x = (Math.cos(this.timer) * 200) + 400;
        //this.sprite.position.y = (Math.sin(this.timer) * 200) + 250;
    }
}
