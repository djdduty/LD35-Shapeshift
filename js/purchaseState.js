var purchaseState = {
    create: function() {
        var score = 'N/A';
         var player = game.gameScene.getPlayer();
         if(player) { score = player.score; }

        this.nameLabel = game.add.text(game.width/2, 50, 'Purchase Menu (Click image to buy)', {font: '34px Arial', fill: '#FFFFFF'});
        this.scoreLabel = game.add.text(game.width/2, 80, 'Your Points: '+score, {font: '24px Arial', fill: '#00FF00'});
        this.nameLabel.anchor.set(0.5,0.5);
        this.scoreLabel.anchor.set(0.5,0.5);

        var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        spacekey.onDown.addOnce(this.start, this);

        var formSales = [
            {sprite: "soldierui", cost: 0,  desc: "The basic shape that all players start with, moderate attack speed, movement speed, and damage.", onDown: function() { game.socket.emit('unlockShape', {form: "base"   }); } },
            {sprite: "goblinui" , cost: 20, desc: "A nasty goblin, high attack speed, high movement speed, low damage."                            , onDown: function() { game.socket.emit('unlockShape', {form: "goblin" }); } },
            {sprite: "mageui"   , cost: 10, desc: "A powerful mage, ranged attacks, fast attack speed, fast movement speed, moderate damage."      , onDown: function() { game.socket.emit('unlockShape', {form: "mage"   }); } },
            {sprite: "ghostui"  , cost: 30, desc: "A ghastly ghoul, ranged attacks, moderate attack speed, low movement speed, high damage."       , onDown: function() { game.socket.emit('unlockShape', {form: "ghost"  }); } },
            {sprite: "zombieui" , cost: 30, desc: "A hefty zombie, low attack speed, low movement speed, high damage, high damage resistance."     , onDown: function() { game.socket.emit('unlockShape', {form: "zombie" }); } }
        ];

        for(var i = 0; i < formSales.length; i++) {
            var sale = formSales[i];
            var sprite = game.add.sprite(game.width/2-374, (i+1)*128+30, sale.sprite);
            //var text   = game.add.text(game.width/2-300, (i+1)*128, {font: '24px Arial', fill: "#FFFFFF"});
            var text   = game.add.text(game.width/2-300, (i+1)*128-15, sale.desc, {font: '24px Arial', fill: '#FFFFFF', wordWrap: true, wordWrapWidth: 600});
            var cost   = game.add.text(game.width/2-300, (i+1)*128+60, "Cost: "+sale.cost, {font: '24px Arial', fill: '#8a8a8a'});
            //, wordWrap: true, wordWrapWidth: 300
            sprite.anchor.setTo(0.5, 0.5);
            sprite.inputEnabled = true;
            sprite.events.onInputDown.add(sale.onDown);
        }

        game.socket.on('purchaseError', function(data) {
            var state = game.state.getCurrentState();
            state.nameLabel.text = data.errMsg;
            state.nameLabel.style.fill = "#FF0000";
        });

        game.socket.on('purchaseOk', function(data) {
            var state = game.state.getCurrentState();
            state.nameLabel.text = data.msg;
            state.nameLabel.style.fill = "#FFFFFF";
        });

        //this.ui0.events.onInputDown.add(this.morph0,this);
        //this.ui1.events.onInputDown.add(this.morph1,this);
        //this.ui2.events.onInputDown.add(this.morph2,this);
        //this.ui3.events.onInputDown.add(this.morph3,this);
        //this.ui4.events.onInputDown.add(this.morph4,this);
    },

    update: function() {
        var score = 'N/A';
         var player = game.gameScene.getPlayer();
         if(player) { score = player.score; }

         this.scoreLabel.text = "Your Points: "+score;
    },

    start: function() {
        game.state.start('play');
    },

    onWorldState: function(data) {
        game.gameScene.fromState(data);
    },
    onKeyDown: function(e) {},
    onKeyUp: function(e) {},
    startAttack: function(data) {}
}
