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
    this.drawnObject.anchor.setTo(0.5, 0.5);
}

Player.prototype.update = function(delta) {
    this.drawnObject.x = this.entity.x;
    this.drawnObject.y = this.entity.y;
}

function Enemy(id) {
    this.entity = new Entity(id);
}

function Projectile(id) {
    this.entity = new Entity(id);
}
