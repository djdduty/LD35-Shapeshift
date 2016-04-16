playState = {
    preload: function() {

    },

    create: function() {
        this.keyboard = game.input.keyboard;

        sprite = this.sprite = game.add.sprite();

        game.add.text(80, 80, 'Play state, space to go back', {font: '50px Arial', fill: '#f7931e'});
        var spacekey = this.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacekey.onDown.addOnce(this.start, this);

        sprite.fillColor = '#ffffff';
        sprite.width = 100;
        sprite.height = 100;
        sprite.position.x = 0;
        sprite.position.y = 0;

        this.lasttime = game.time.now;
        this.timer = 0;
    },

    start: function() {
        game.state.start('menu');
    },

    update: function() {
        delta = (game.time.now - this.lasttime)*0.001;
        this.timer += delta;
        this.lasttime = game.time.now;

        this.sprite.position.x = (Math.cos(this.timer) * 200) + 400;
        this.sprite.position.y = (Math.sin(this.timer) * 200) + 250;
    }
}
