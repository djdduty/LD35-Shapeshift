var menuState = {
    preload: function() {
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

        game.load.spritesheet("mage-walk", "img/mage_walk.png",64,64,36);
        game.load.spritesheet("mage-attack", "img/mage_cast.png",64,64,28);

        game.load.spritesheet("goblin-walk", "img/goblinsword.png",64,64,49);
        game.load.spritesheet("goblin-attack", "img/goblinsword.png",64,64,49);

        game.load.spritesheet("ghost-walk", "img/ghost_form.png",32,32,45);
        game.load.spritesheet("ghost-attack", "img/ghost_form.png",32,32,45);

        game.load.spritesheet("zombie-walk", "img/zombie7.png",64,64,12);
        game.load.spritesheet("zombie-attack", "img/zombie7.png",64,64,12);

        game.load.spritesheet("fireball","img/fireball.png",64,64);
        game.load.spritesheet("explosion","img/explosion.png",64,64);

        game.load.image("soldierui","img/SoldierUI.png");
        game.load.image("goblinui","img/GoblinUI.png");
        game.load.image("mageui","img/MageUI.png");
        game.load.image("ghostui","img/GhostUI.png");
        game.load.image("zombieui","img/ZombieUI.png");

        game.load.image("mouse","img/mouse.png");
        game.load.image("arrows","img/arrows.png");
    },

    create: function() {
        var nameLabel = game.add.text(game.width/2, 100, 'LD35 - Shapeshift', {font: '50px Arial', fill: '#ffffff'});
        var descLabel = game.add.text(game.width/2, 150, 'A multiplayer top down figher game', {font: '24px Arial', fill: '#ffffff'});
        descLabel.anchor.setTo(0.5, 0.5);
        nameLabel.anchor.setTo(0.5, 0.5);
        var startLabel = game.add.text(game.width/2, game.height-100, 'Press (SPACE) to start', {font: '24px Arial', fill: '#7a7a7a'});
        startLabel.anchor.setTo(0.5, 0.5);
        var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacekey.onDown.addOnce(this.start, this);

        var mage = game.add.sprite(mageForm.frameWidth, mageForm.frameHeight, mageForm.spritePrefix+'-walk');
        mage.animations.add('walk', mageForm.walkRight);
        mage.play('walk', mageForm.attackfps, true);
        mage.anchor.setTo(0.5, 0.5);
        mage.x = game.width/2-250;
        mage.y = game.height/2;
        mage.scale.setTo(4);
        mage.smoothed = false;

        var fire = game.add.sprite(64, 64, 'fireball');
        fire.animations.add('fire', [0,1,2,3,4,5,6,7]);
        fire.play('fire', 16, true);
        fire.anchor.setTo(0.5, 0.5);
        fire.x = game.width/2-50;
        fire.y = game.height/2;
        fire.scale.setTo(4);
        fire.smoothed = false;

        var ghost = game.add.sprite(ghostForm.frameWidth, ghostForm.frameHeight, 'ghost-walk');
        ghost.animations.add('walk', ghostForm.walkLeft);
        ghost.play('walk', ghostForm.attackfps/2, true);
        ghost.anchor.setTo(0.5, 0.5);
        ghost.x = game.width/2+250;
        ghost.y = game.height/2;
        ghost.scale.setTo(8);
        ghost.smoothed = false;
    },

    start: function() {
        game.state.start('username');
    },

    onKeyDown: function(e) {

    },

    onKeyUp: function(e) {

    }
}
