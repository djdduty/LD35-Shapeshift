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
    this.sprite.animations.add('walk-up'   , [ 0, 1, 2, 3, 4, 5, 6, 7, 8]);
    this.sprite.animations.add('walk-left' , [ 9,10,11,12,13,14,15,16,17]);
    this.sprite.animations.add('walk-down' , [18,19,20,21,22,23,24,25,26]);
    this.sprite.animations.add('walk-right', [27,28,29,30,31,32,33,34,35]);
    this.sprite.animations.add('idle-right', [27]);
    this.sprite.animations.add('idle-up'   , [0] );
    this.sprite.animations.add('idle-down' , [18]);
    this.sprite.animations.add('idle-left' , [9] );

    this.sprite.animations.play('idle-right');
    this.sprite.scale.set(1.5);
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

    this.entity.offsetY = 96*0.25;
    this.entity.offsetX = 0;
    this.entity.height = 96*0.5;
    this.entity.width = 66;
    this.entity.terminalVelocity = 200;
}

Player.prototype.update = function(delta, geometry) {
    var increase = (this.entity.terminalVelocity / 50)*delta;
    var anim;
    if(this.northDown === true) { this.entity.velY += -increase; }
    if(this.southDown === true) { this.entity.velY += increase;  }
    if(this.eastDown  === true) { this.entity.velX += increase;  }
    if(this.westDown  === true) { this.entity.velX += -increase; }

    if     (this.entity.velY > 0) { anim = 'walk-down'; }
    else if(this.entity.velY < 0) { anim = 'walk-up'; }
    if     (this.entity.velX > 0) { anim = 'walk-right'; }
    else if(this.entity.velX < 0) { anim = 'walk-left'; }


    var lastAnim = this.lastAnim.split('-');
    if(this.entity.velX === 0 && this.entity.velY === 0 && lastAnim[0] !== 'idle') {
        anim = 'idle-'+lastAnim[1];
    }

    if(anim && anim != this.lastAnim) {
        this.lastAnim = anim;
        this.sprite.animations.play(anim, 16, true);
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
