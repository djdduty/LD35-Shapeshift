playState = {
    preload: function()
    {
        game.load.spritesheet("0","img/TreeA.png",256,256,1);
        game.load.spritesheet("1","img/TreeB.png",256,256,1);
        game.load.spritesheet("2","img/TreeC.png",256,256,1);
        game.load.spritesheet("3","img/Grass0.png",256,256,1);
        game.load.spritesheet("4","img/Water0.png",256,256,1);
        game.load.spritesheet("5","img/Concrete0.png",256,256,1);
        game.load.spritesheet("player", "img/playerbig.png",28,54,16);
    },

    create: function() {
        this.keyboard = game.input.keyboard;
        var spacekey = this.keyboard.addKey(Phaser.Keyboard.ESC);
        spacekey.onDown.addOnce(this.pause, this);

        //Camera setup:
        game.world.setBounds(0, 0, 256*16,256*16);
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
                sprite = game.add.sprite(x*256,y*256,""+game.gameScene.scene.world.staticEntities[y][x]);
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

        var player = game.gameScene.getPlayer();
        if(!player) return;

        switch(e.code)
        {
            case 'ArrowUp':
                direction = 'N';
                player.northDown = true;
                break;
            case 'ArrowDown':
                direction = 'S';
                player.southDown = true;
                break;
            case 'ArrowLeft':
                direction = 'W';
                player.westDown = true;
                break;
            case 'ArrowRight':
                direction = 'E';
                player.eastDown = true;
                break;
            case 'KeyS':
                console.log(game.gameScene.scene.players);
            case 'Space':
                game.socket.emit('playerUse');
                return;
                break;
            default:
                return;
                break;
        }
        game.socket.emit('playerMove', {dir: direction, isDown: true});
    },

    onKeyUp: function(e) {
        var direction = '';
        if(e.repeat === true) return;

        var player = game.gameScene.getPlayer();
        if(!player) return;

        switch(e.code)
        {
            case 'ArrowUp':
                direction = 'N';
                player.northDown = false;
                break;
            case 'ArrowDown':
                direction = 'S';
                player.southDown = false;
                break;
            case 'ArrowLeft':
                direction = 'W';
                player.westDown = false;
                break;
            case 'ArrowRight':
                direction = 'E';
                player.eastDown = false;
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
        delta = (game.time.now - this.lasttime);
        this.lasttime = game.time.now;
        if(game.gameScene) {
            game.gameScene.update(delta);
        }
        //this.sprite.position.x = (Math.cos(this.timer) * 200) + 400;
        //this.sprite.position.y = (Math.sin(this.timer) * 200) + 250;
    }
}
