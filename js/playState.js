playState = {
    preload: function()
    {
        game.load.spritesheet("0","img/TreeA.png",128,128,1);
        game.load.spritesheet("1","img/TreeA.png",128,128,1);
        game.load.spritesheet("2","img/TreeA.png",128,128,1);
        game.load.spritesheet("3","img/Grass0.png",128,128,1);
        game.load.spritesheet("4","img/Water0.png",128,128,1);
        game.load.spritesheet("5","img/Concrete0.png",128,128,1);
        game.load.spritesheet("10","img/TreeA-Top.png",128,128,1);
        game.load.spritesheet("11","img/TreeA-Top.png",128,128,1);//TODO: make TreeB-Top
        game.load.spritesheet("12","img/Pond0.png",128,128,1);
        game.load.spritesheet("13","img/Pond1.png",128,128,1);
        game.load.spritesheet("14","img/Pond2.png",128,128,1);
        game.load.spritesheet("15","img/Pond3.png",128,128,1);
        game.load.spritesheet("16","img/Pond4.png",128,128,1);
        game.load.spritesheet("17","img/Pond5.png",128,128,1);
        game.load.spritesheet("18","img/Pond6.png",128,128,1);
        game.load.spritesheet("19","img/Pond7.png",128,128,1);
        game.load.spritesheet("20","img/Pond8.png",128,128,1);

        //game.load.spritesheet("player", "img/playerbig.png",28,54,16);
        game.load.spritesheet("base-walk", "img/soldier_altcolor.png",64,64,36);
        game.load.spritesheet("base-attack", "img/soldier_attack.png",64,64,36);

        game.load.spritesheet("goblin-walk", "img/goblinsword.png",64,64,49);
        game.load.spritesheet("goblin-attack", "img/goblinsword.png",64,64,49);

        game.load.spritesheet("explosion","img/explosion.png",64,64);

        game.load.image("soldierui","img/SoldierUI.png");
        game.load.image("goblinui","img/GoblinUI.png");
        game.load.image("mageui","img/MageUI.png");
        game.load.image("ghostui","img/GhostUI.png");
        game.load.image("zombieui","img/ZombieUI.png");
    },

    create: function() {
        this.poolHelper = game.add.text(game.width/2, game.height-100, '', {font: '34px Arial', fill: '#FFFFFF'});
        this.poolHelper.stroke = '#000000';
        this.poolHelper.strokeThickness = 5;
        this.poolHelper.anchor.setTo(0.5, 0.5);
        this.poolHelper.fixedToCamera = true;

        this.shapeHelper = game.add.text(game.width/2, 100, '', {font: '34px Arial', fill: '#FF0000'});
        this.shapeHelper.stroke = '#000000';
        this.shapeHelper.strokeThickness = 5;
        this.shapeHelper.anchor.setTo(0.5, 0.5);
        this.shapeHelper.fixedToCamera = true;
        this.shapeHelperTimer = 0;

        this.deathHelper = game.add.text(game.width/2, game.height/2, '', {font: '42px Arial', fill: '#FF0000'});
        this.deathHelper.stroke = '#000000';
        this.deathHelper.strokeThickness = 5;
        this.deathHelper.anchor.setTo(0.5, 0.5);
        this.deathHelper.fixedToCamera = true;

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
        game.input.onDown.add(this.onClick, this);

        this.lasttime = game.time.now;

        game.socket.on("worldState"     , function(data) { game.state.getCurrentState().onWorldState(data); });
        game.socket.on("playerAttacked" , function(data) {
            var player = game.gameScene.scene.getPlayerByUsername(data.username);
            if(player) player.startAttack();
        });
        game.socket.on('disconnect'     , function(data) { console.log('disconnected'); game.state.start('menu'); });
        game.socket.on('shapeshiftError', function(data) {
            var state = game.state.getCurrentState();
            if(!state || !state.shapeHelper) { return; }
            state.shapeHelper.text = data.errMsg;
            state.shapeHelperTimer = 2500;
        });

        game.state.getCurrentState().group = game.add.group();

        for(y = 0;y < game.gameScene.scene.world.staticEntities.length;y++)
        {
            for(x = 0;x < game.gameScene.scene.world.staticEntities[y].length;x++)
            {
                var tid = game.gameScene.scene.world.staticEntities[y][x];
                if(tid > -1) {
                    sprite = game.add.sprite(x*128,y*128,""+tid);
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
                    this.group.add(sprite);
                }
            }
        }

        game.state.getCurrentState().group.sort();

        this.ui0 = game.add.sprite(0, 0,"soldierui");
        this.ui1 = game.add.sprite(0, 128,"goblinui");
        this.ui2 = game.add.sprite(0, 256,"mageui");
        this.ui3 = game.add.sprite(0, 384,"ghostui");
        this.ui4 = game.add.sprite(0, 512,"zombieui");

        this.ui0.fixedToCamera = true;
        this.ui1.fixedToCamera = true;
        this.ui2.fixedToCamera = true;
        this.ui3.fixedToCamera = true;
        this.ui4.fixedToCamera = true;

        //this.ui0.inputEnabled  = true;
        this.ui1.inputEnabled  = true;
        this.ui2.inputEnabled  = true;
        this.ui3.inputEnabled  = true;
        this.ui4.inputEnabled  = true;

        //this.ui0.events.onInputDown.add(this.morph0,this);
        this.ui1.events.onInputDown.add(this.morph1,this);
        this.ui2.events.onInputDown.add(this.morph2,this);
        this.ui3.events.onInputDown.add(this.morph3,this);
        this.ui4.events.onInputDown.add(this.morph4,this);
    },
    morph0: function()
    {
        game.socket.emit('playerShapeshift', {form: 'base'});
    },
    morph1: function()
    {
        game.socket.emit('playerShapeshift', {form: 'goblin'});
    },
    morph2: function()
    {
        game.socket.emit('playerShapeshift', {form: 'mage'});
    },
    morph3: function()
    {
        game.socket.emit('playerShapeshift', {form: 'ghost'});
    },
    morph4: function()
    {
        game.socket.emit('playerShapeshift', {form: 'zombie'});
    },

    onClick: function(data) {

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
            case 'Space':
                var player = game.gameScene.getPlayer();
                if(player && player.entity.health <= 0) {
                    game.socket.emit('playerUse', {angle: {x:0, y:0}});
                } else {
                    if(player.onSacredTile(game.gameScene.scene)) {
                        game.state.start('purchase');
                    }
                }
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
        var player = game.gameScene.getPlayer();
        if(game.input.activePointer.isDown) {
            if(!player) { return; }
            if(player.attacking === false && player.entity.health > 0) {
                var x = game.input.x + game.camera.x;
                var y = game.input.y + game.camera.y;
                var player = game.gameScene.getPlayer();
                if(!player) return;
                var deltaX = x - player.entity.x;
                var deltaY = y - player.entity.y;
                var mag = Math.sqrt((deltaX*deltaX)+(deltaY*deltaY));
                game.socket.emit('playerUse', {angle: {x:deltaX/mag,y:deltaY/mag}});
                player.attacking = true;
            }
        }

        game.world.bringToTop(this.group);
        delta = (game.time.now - this.lasttime);
        this.lasttime = game.time.now;
        if(game.gameScene) {
            game.gameScene.update(delta);
        }

        this.ui0.bringToTop();
        this.ui1.bringToTop();
        this.ui2.bringToTop();
        this.ui3.bringToTop();
        this.ui4.bringToTop();

        //for(var i = 0; i < this.treeTops.length; i++) {
        //    this.treeTops[i].bringToTop(); //TODO: Use groups and sort by y
        //}
        game.state.getCurrentState().group.sort('y',Phaser.Group.SORT_ASCENDING);
        //this.sprite.position.x = (Math.cos(this.timer) * 200) + 400;
        //this.sprite.position.y = (Math.sin(this.timer) * 200) + 250;
        if(player && player.onSacredTile(game.gameScene.scene)) {
            this.poolHelper.text = "Press (SPACE) To enter the purchase menu!";
            game.world.bringToTop(this.poolHelper);
        } else {
            this.poolHelper.text = "";
        }

        if(this.shapeHelperTimer <= 0) {
            this.shapeHelper.text = '';
        } else {
            this.shapeHelperTimer -= delta;
            game.world.bringToTop(this.shapeHelper);
        }

        if(player && player.entity.health <= 0) {
            this.deathHelper.text = "You died (Space) to respawn";
            game.world.bringToTop(this.deathHelper);
        } else {
            this.deathHelper.text = '';
        }
    },

    render: function() {
        game.gameScene.render();
    }
}
