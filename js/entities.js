//classes don't exist in es5, which is what we want to support

function Player(client, id) {
    this.clientID = client;
    this.entity = new Entity(id);

    var bmd = game.add.bitmapData(100, 100);

    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 100, 100);
    bmd.ctx.fillStyle = '#ffffff';
    bmd.ctx.fill();
    this.drawnObject = game.add.sprite(game.world.centerX, game.world.centerY, bmd);
    this.nameLabel = game.add.text(0, 0, '', {font: '24px Arial', fill: '#ffffff'});
    this.nameLabel.stroke = '#000000';
    this.nameLabel.strokeThickness = 5;
    this.nameLabel.anchor.setTo(0.5, 0.5);
    this.drawnObject.anchor.setTo(0.5, 0.5);

    this.northDown = false;
    this.eastDown  = false;
    this.southDown = false;
    this.westDown  = false;
    this.ip = '';
}

Player.prototype.update = function(delta, geometry) {
    var increase = (this.entity.terminalVelocity / 250)*delta;
    if(this.northDown === true) { this.entity.velY += -increase; }
    if(this.eastDown  === true) { this.entity.velX += increase;  }
    if(this.southDown === true) { this.entity.velY += increase;  }
    if(this.westDown  === true) { this.entity.velX += -increase; }

    this.entity.update(delta, !this.eastDown && !this.westDown, !this.northDown && !this.southDown, geometry);

    this.drawnObject.x = this.entity.x;
    this.drawnObject.y = this.entity.y;
    this.nameLabel.text = this.username+" - "+this.ip;
    this.nameLabel.x = this.entity.x;
    this.nameLabel.y = this.entity.y - 65;
    game.world.bringToTop(this.nameLabel);
}

Player.prototype.removeGraphics = function() {
    game.world.remove(this.drawnObject);
    game.world.remove(this.nameLabel);
}

function Enemy(id) {
    this.entity = new Entity(id);
}

function Projectile(id) {
    this.entity = new Entity(id);
}
