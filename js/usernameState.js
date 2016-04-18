usernameState = {
    preload: function() {
        game.load.image("mouse","img/mouse.png");
        game.load.image("arrows","img/arrows.png");
    },

    create: function() {
        game.socket = this.socket = io.connect("http://vm1.djdduty.com:3889", {transports: ["websocket"]});
        this.name = '';
        game.input.keyboard.addCallbacks(this, null, null, this.onPress);
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.BACKSPACE);
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);

        this.titleLabel = game.add.text(game.width/2, 100, 'Please Enter A Username:', {font: '50px Arial', fill: '#ffffff'});
        this.titleLabel.anchor.set(0.5);
        this.nameLabel = game.add.text(game.width/2, 200, 'Enter Username', {font: '32px Arial', fill: '#7a7a7a'});
        this.nameLabel.anchor.set(0.5);
        this.errorLabel = game.add.text(game.width/2, 150, '', {font: '24px Arial', fill: '#FF0000'});
        this.errorLabel.anchor.set(0.5);

        var mouse = game.add.sprite(game.width/2+200, game.height-250, 'mouse');
        mouse.anchor.setTo(0.5, 0.5);
        mouse.scale.setTo(0.5);
        var mouseText = game.add.text(game.width/2+200, game.height-100, 'Use left click to attack', {fonnt: '24px Arial', fill: "#ffffff"});
        mouseText.anchor.setTo(0.5, 0.5);
        var arrows = game.add.sprite(game.width/2-200, game.height-250, 'arrows');
        var arrowText = game.add.text(game.width/2-200, game.height-100, 'Use arrow keys to move', {fonnt: '24px Arial', fill: "#ffffff"});
        arrowText.anchor.setTo(0.5, 0.5);

        var uiText = game.add.text(game.width/2, game.height-50, 'Click images in top left to change shape', {fonnt: '24px Arial', fill: "#ffffff"});
        uiText.anchor.setTo(0.5,0.5);

        arrows.anchor.setTo(0.5, 0.5);

        this.socket.on("usernameOk", function(data) { game.username = game.state.getCurrentState().name.trim(); game.state.start('play'); });
        this.socket.on("usernameBad", function(data) {
            game.state.getCurrentState().onBadUsername(data);
        });
    },

    onBadUsername: function(data) {
        this.errorLabel.text = data.errMsg;
    },

    update: function() {

    },

    onKeyDown: function(key) {
        switch(key.keyCode) {
            case 8:
                this.name = this.name.substr(0, this.name.length-1);
                this.updateName();
                break;

            case 13:
                this.socket.emit("setUsername", {username: this.name.trim()});
                break;

            case 32:
                this.name += " ";
                this.updateName();
                break;
            default:
                break;
        }
    },

    onKeyUp: function(key) {},
    onPress: function(key) {
        if(/^[a-z0-9!@#$%^&*(){}/=\[\]\\,.';<>"]+$/i.test(key)) {
            this.name += key;
            this.updateName();
        }
    },

    updateName: function() {
        if(this.name.length > 0) {
            this.nameLabel.text = this.name+"|";
            this.nameLabel.style.fill = "#ffffff";
        } else {
            this.nameLabel.text = "Enter Username";
            this.nameLabel.style.fill = "#7a7a7a";
        }
    }
}
