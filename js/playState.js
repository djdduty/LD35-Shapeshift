playState = {
    preload: function() {

                game.load.spritesheet("treea","img/TreeA.png",256,256,1);
                game.load.spritesheet("treeb","img/TreeB.png",256,256,1);
                game.load.spritesheet("treec","img/TreeC.png",256,256,1);
    },

    create: function() {
        this.keyboard = game.input.keyboard;
        var spacekey = this.keyboard.addKey(Phaser.Keyboard.ESC);
        spacekey.onDown.addOnce(this.pause, this);

        //Camera setup:
        game.world.setBounds(0, 0, 1920, 1920);
        game.gameScene = new ClientScene();

        //addkey so that they don't register regular browser events like scrolling
        this.keyboard.addKeyCapture(Phaser.Keyboard.UP);
        this.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
        this.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
        this.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);

        this.lasttime = game.time.now;

        game.socket.on("worldState", function(data) { game.state.getCurrentState().onWorldState(data); });

        for(y = 0;y < game.gameScene.scene.world.staticEntities.length;y++)
        {
            for(x = 0;x < game.gameScene.scene.world.staticEntities[y].length;x++)
            {
                Type = "treea";
                if     (game.gameScene.scene.world.staticEntities[y][x] == 1) Type = "treeb";
                else if(game.gameScene.scene.world.staticEntities[y][x] == 2) Type = "treec";

                sprite = game.add.sprite(x*256,y*256,Type);
            }
        }
    },

    onWorldState: function(data) {
        //console.log(data);
        //TODO: setup world state
        if(game.gameScene) {
            game.gameScene.fromState(data);
        }
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
        if(game.gameScene) {
            game.gameScene.update(delta);
        }
        //this.sprite.position.x = (Math.cos(this.timer) * 200) + 400;
        //this.sprite.position.y = (Math.sin(this.timer) * 200) + 250;
    }
}
