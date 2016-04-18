var purchaseState = {
    create: function() {
        this.nameLabel = game.add.text(game.width/2, 50, 'Purchase Menu', {font: '34px Arial', fill: '#FFFFFF'});
        this.nameLabel.anchor.set(0.5);

        var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        spacekey.onDown.addOnce(this.start, this);

        var formSales = [
            {sprite: "soldierui", onDown: function() { game.socket.emit('unlockShape', {form: "base"   }); } },
            {sprite: "goblinui" , onDown: function() { game.socket.emit('unlockShape', {form: "goblin" }); } },
            {sprite: "mageui"   , onDown: function() { game.socket.emit('unlockShape', {form: "mage"   }); } },
            {sprite: "ghostui"  , onDown: function() { game.socket.emit('unlockShape', {form: "ghost"  }); } },
            {sprite: "zombieui" , onDown: function() { game.socket.emit('unlockShape', {form: "zombie" }); } }
        ];

        for(var i = 0; i < formSales.length; i++) {
            var sale = formSales[i];
            var sprite = game.add.sprite(game.width/2, (i+1)*128+30, sale.sprite);
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
