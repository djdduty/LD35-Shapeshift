playState = {
    preload: function()
    {
        game.load.spritesheet("0","img/TreeA.png",128,128,1);
        game.load.spritesheet("1","img/TreeB.png",128,128,1);
        game.load.spritesheet("2","img/TreeC.png",128,128,1);
        game.load.spritesheet("3","img/Grass0.png",128,128,1);
        game.load.spritesheet("4","img/Water0.png",128,128,1);
        game.load.spritesheet("5","img/Concrete0.png",128,128,1);
        game.load.spritesheet("10","img/TreeA-Top.png",128,128,1);
        game.load.spritesheet("11","img/TreeA-Top.png",128,128,1);//TODO: make TreeB-Top
        //game.load.spritesheet("player", "img/playerbig.png",28,54,16);
        game.load.spritesheet("base-walk", "img/soldier_altcolor.png",64,64*1,36);
        game.load.spritesheet("base-attack", "img/soldier_attack.png",64,64*1,4);

        game.load.spritesheet("mage-walk", "img/mage_walk.png",64,64*1,36);
        game.load.spritesheet("mage-attack", "img/mage_cast.png",64,64*1,28);
    },

    create: function() {
        this.keyboard = game.input.keyboard;
        var spacekey = this.keyboard.addKey(Phaser.Keyboard.ESC);
        spacekey.onDown.addOnce(this.pause, this);

        //Camera setup:
        game.world.setBounds(0, 0, 128*16,128*16);
        game.gameScene = new ClientScene();

        //addkey so that they don't register regular browser events like scrolling
        this.keyboard.addKeyCapture(Phaser.Keyboard.UP);
        this.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
        this.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
        this.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);

        this.lasttime = game.time.now;

        game.socket.on("worldState"     , function(data) { game.state.getCurrentState().onWorldState(data); });
        game.socket.on("playerAttacked" , function(data) { game.gameScene.scene.getPlayerByUsername(data.username).startAttack(); });
        game.socket.on('disconnect'     , function(data) { console.log('disconnected'); game.state.start('menu'); });
        game.socket.on('shapeshiftError', function(data) { console.log(data); });

        for(y = 0;y < game.gameScene.scene.world.staticEntities.length;y++)
        {
            for(x = 0;x < game.gameScene.scene.world.staticEntities[y].length;x++)
            {
                if(game.gameScene.scene.world.staticEntities[y][x] > -1) {
                    sprite = game.add.sprite(x*128,y*128,""+game.gameScene.scene.world.staticEntities[y][x]);
                }
            }
        }

        this.treeTops = [];
        for(y = 0;y < game.gameScene.scene.world.treeTops.length;y++)
        {
            for(x = 0;x < game.gameScene.scene.world.treeTops[y].length;x++)
            {
                if(game.gameScene.scene.world.treeTops[y][x] > -1) {
                    sprite = game.add.sprite(x*128,y*128-32,""+game.gameScene.scene.world.treeTops[y][x]);
                    this.treeTops.push(sprite);
                }
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
                game.socket.emit('playerShapeshift', {form:'mage'});
                return;
                break;
            case 'Space':
                var player = game.gameScene.getPlayer();
                if(player && player.attacking === false) {
                    player.startAttack();
                }
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

        for(var i = 0; i < this.treeTops.length; i++) {
            this.treeTops[i].bringToTop(); //TODO: Use groups and sort by y
        }
        //this.sprite.position.x = (Math.cos(this.timer) * 200) + 400;
        //this.sprite.position.y = (Math.sin(this.timer) * 200) + 250;
    },

    render: function() {
        game.gameScene.render();
    }
}
