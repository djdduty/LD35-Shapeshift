//classes don't exist in es5, which is what we want to support

function Player(client, id) {
    this.clientID = client;
    this.entity = new Entity(id);

    var bmd = game.add.bitmapData(100, 100);

    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 100, 100);
    bmd.ctx.fillStyle = '#ffffff';
    bmd.ctx.fill();

    this.sprite = game.add.sprite(28, 54, 'player');
    this.sprite.animations.add('walk-right', [ 0,  1,  2,  3]);
    this.sprite.animations.add('walk-up'   , [ 4,  5,  6,  7]);
    this.sprite.animations.add('walk-down' , [ 8,  9, 10, 11]);
    this.sprite.animations.add('walk-left' , [12, 13, 14, 15]);
    this.sprite.animations.add('idle-right', [0] );
    this.sprite.animations.add('idle-up'   , [4] );
    this.sprite.animations.add('idle-down' , [8] );
    this.sprite.animations.add('idle-left' , [13]);

    this.sprite.animations.play('idle-right');
    this.sprite.scale.set(3);
    this.sprite.smoothed = false;
    this.sprite.anchor.setTo(0.5, 0.5);

    this.nameLabel = game.add.text(0, 0, '', {font: '24px Arial', fill: '#ffffff'});
    this.nameLabel.stroke = '#000000';
    this.nameLabel.strokeThickness = 5;
    this.nameLabel.anchor.setTo(0.5, 0.5);

    this.northDown = false;
    this.eastDown  = false;
    this.southDown = false;
    this.westDown  = false;
    this.ip = '';
    this.lastAnim = 'idle-right';

    this.entity.offsetY = 162*0.25;
    this.entity.offsetX = 0;
    this.entity.height = 162*0.5;
    this.entity.width = 84;
}

Player.prototype.update = function(delta, geometry) {
    var increase = (this.entity.terminalVelocity / 50)*delta;
    var anim;
    if(this.northDown === true) { this.entity.velY += -increase; anim = 'walk-up'   ; }
    if(this.eastDown  === true) { this.entity.velX += increase;  anim = 'walk-right'; }
    if(this.southDown === true) { this.entity.velY += increase;  anim = 'walk-down' ; }
    if(this.westDown  === true) { this.entity.velX += -increase; anim = 'walk-left' ; }

    var lastAnim = this.lastAnim.split('-');
    if(this.entity.velX === 0 && this.entity.velY === 0 && lastAnim[0] !== 'idle') {
        anim = 'idle-'+lastAnim[1];
    }

    if(anim && anim != this.lastAnim) {
        this.lastAnim = anim;
        this.sprite.animations.play(anim, 10, true);
    }

    this.entity.update(delta, !this.eastDown && !this.westDown, !this.northDown && !this.southDown, geometry);

    this.sprite.x = this.entity.x;
    this.sprite.y = this.entity.y;
    this.nameLabel.text = this.username;
    this.nameLabel.x = this.entity.x;
    this.nameLabel.y = this.entity.y - 65;
    game.world.bringToTop(this.nameLabel);
}

Player.prototype.removeGraphics = function() {
    game.world.remove(this.sprite);
    game.world.remove(this.nameLabel);
}

function Enemy(id) {
    this.entity = new Entity(id);
}

function Projectile(id) {
    this.entity = new Entity(id);
}
