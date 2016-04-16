usernameState = {
    create: function() {
        game.socket = this.socket = io.connect("http://djdduty.com:3889", {transports: ["websocket"]});
        this.name = '';
        game.input.keyboard.addCallbacks(this, this.onKeyDown, this.onKeyUp, this.onPress);
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.BACKSPACE);
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);

        this.titleLabel = game.add.text(game.width/2, game.height/2/2, 'Please Enter A Username:', {font: '50px Arial', fill: '#ffffff'});
        this.titleLabel.anchor.set(0.5);
        this.nameLabel = game.add.text(game.width/2, game.height/2/2+100, 'Enter Username', {font: '32px Arial', fill: '#7a7a7a'});
        this.nameLabel.anchor.set(0.5);
        this.errorLabel = game.add.text(game.width/2, game.height/2/2+50, '', {font: '24px Arial', fill: '#FF0000'});
        this.errorLabel.anchor.set(0.5);

        this.socket.on("usernameOk", function(data) { game.state.start('play'); });
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
                //if(this.name.length > 0 && this.name.trim().length > 0) {
                    this.socket.emit("setUsername", {username: this.name.trim()});
                //}
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
