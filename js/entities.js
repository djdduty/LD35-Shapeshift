//classes don't exist in es5, which is what we want to support

humanForm = {
    damage: 10,
    ranged: false,
    speed: 200,
    attackSpeed: 500,
    attackDistance: 50,
    damageReduction: 0,
    name: 'base',
    spritePrefix: 'base', //will look for base-walk and base-attack
    frameWidth: 64,
    frameHeight: 64,
    walkLeft : [ 9,10,11,12,13,14,15,16,17],
    walkRight: [27,28,29,30,31,32,33,34,35],
    walkUp   : [ 0, 1, 2, 3, 4, 5, 6, 7, 8],
    walkDown : [18,19,20,21,22,23,24,25,26],
    idleLeft : [9],
    idleRight: [27],
    idleUp   : [0],
    idleDown : [18],
    attackUp   : [0],
    attackLeft : [1],
    attackDown : [2],
    attackRight: [3],
    hurtRight  : [27],
    hurtLeft   : [9],
    hurtUp     : [0],
    hurtDown   : [18],
    attackfps: 9,
    fps: 16
}

mageForm = {
    damage: 10,
    ranged: true,
    speed: 250,
    attackSpeed: 500,
    attackDistance: 50,
    damageReduction: 0,
    name: 'mage',
    spritePrefix: 'mage',
    frameWidth: 64,
    frameHeight: 64,
    walkLeft : [ 9,10,11,12,13,14,15,16,17],
    walkRight: [27,28,29,30,31,32,33,34,35],
    walkUp   : [ 0, 1, 2, 3, 4, 5, 6, 7, 8],
    walkDown : [18,19,20,21,22,23,24,25,26],
    idleLeft : [9],
    idleRight: [27],
    idleUp   : [0],
    idleDown : [18],
    attackUp   : [ 0, 1, 2, 3, 4, 5, 6],
    attackLeft : [ 7, 8, 9,10,11,12,13],
    attackDown : [14,15,16,17,18,19,20],
    attackRight: [21,22,23,24,25,26,27],
    hurtRight  : [27],
    hurtLeft   : [9],
    hurtUp     : [0],
    hurtDown   : [18],
    attackfps: 14,
    fps: 16
}

valid_forms = [humanForm, mageForm];
function getFormByName(name) {
    for(var i = 0; i < valid_forms.length; i++) {
        if(valid_forms[i].name == name) return valid_forms[i];
    }
    return null;
}

function getFormOrBase(name) {
    var form = getFormByName(name);
    if(!form) form = valid_forms[0];
    return form;
}

function Player(client, id) {
    this.clientID = client;
    this.entity = new Entity(id);
    this.attackTimer = 0;

    this.forms = [];
    for(var i = 0; i < valid_forms.length; i++) {
        var form = valid_forms[i];

        var walkSprite = game.add.sprite(form.frameWidth, form.frameHeight, form.spritePrefix+'-walk');
        walkSprite.animations.add('walk-up'   , form.walkUp);
        walkSprite.animations.add('walk-left' , form.walkLeft);
        walkSprite.animations.add('walk-down' , form.walkDown);
        walkSprite.animations.add('walk-right', form.walkRight);

        walkSprite.animations.add('idle-right', form.idleRight);
        walkSprite.animations.add('idle-up'   , form.idleUp);
        walkSprite.animations.add('idle-down' , form.idleDown);
        walkSprite.animations.add('idle-left' , form.idleLeft);

        walkSprite.animations.add('hurt-left' , form.hurtLeft);
        walkSprite.animations.add('hurt-right', form.hurtRight);
        walkSprite.animations.add('hurt-up'   , form.hurtUp);
        walkSprite.animations.add('hurt-down' , form.hurtDown);

        walkSprite.visible = false;
        walkSprite.smoothed = false;
        walkSprite.anchor.setTo(0.5, 0.5);

        game.state.getCurrentState().group.add(walkSprite);

        var attackSprite = game.add.sprite(form.frameWidth, form.frameHeight, form.spritePrefix+'-attack');
        attackSprite.animations.add('attack-right', form.attackRight);
        attackSprite.animations.add('attack-up'   , form.attackUp);
        attackSprite.animations.add('attack-down' , form.attackDown);
        attackSprite.animations.add('attack-left' , form.attackLeft);
        attackSprite.visible = false;
        attackSprite.smoothed = false;
        attackSprite.anchor.setTo(0.5, 0.5);

        game.state.getCurrentState().group.add(attackSprite);

        var formSheet = {name: form.name, walk: walkSprite, attack: attackSprite, data: form};
        this.forms.push(formSheet);
    }
    this.currentForm = 'base';

    this.nameLabel = game.add.text(0, 0, '', {font: '24px Arial', fill: '#ffffff'});
    this.nameLabel.stroke = '#000000';
    this.nameLabel.strokeThickness = 5;
    this.nameLabel.anchor.setTo(0.5, 0.5);

    this.northDown = false;
    this.eastDown  = false;
    this.southDown = false;
    this.westDown  = false;

    this.lastAnim = 'idle-right';

    this.entity.offsetY = 64*0.25;
    this.entity.offsetX = 0;
    this.entity.height = 64*0.5;
    this.entity.width = 44;
    this.entity.terminalVelocity = 200;
    this.attacking = false;
    this.attackTimer = 0;
    this.hurt = false;

    this.score = 0;

    var width = 100;
    var height = 10;
    var bmd = game.add.bitmapData(width, height);
    var bmbb = game.add.bitmapData(width, height);

    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = '#FF0000';
    bmd.ctx.fill();

    this.healthBar = game.add.sprite(0, 0, bmd);
    //this.health.anchor.setTo(0.5, 0.5);

    bmbb.ctx.beginPath();
    bmbb.ctx.rect(0,0,width,height);
    bmbb.ctx.fillStyle = '#000000';
    bmbb.ctx.fill();
    this.healthBarBack = game.add.sprite(0,0,bmbb);
}

Player.prototype.getFormByName = function(name) {
    for(var i = 0; i < this.forms.length; i++) {
        if(this.forms[i].name === name) return this.forms[i];
    }
    return null;
}

Player.prototype.getFormOrBase = function(name) {
    var form = this.getFormByName(name);
    if(!form) form = this.forms[0];
    return form;
}

Player.prototype.getCurrentAnimation = function() {
    var lastAnim = this.lastAnim.split('-');
    var sprite;
    var form = this.getFormByName(this.currentForm);
    var prefix;
    if(!form) form = this.forms[0];
    var fps = form.data.fps;
    if(this.hurt === true) {
        sprite = form.walk;
        prefix = 'hurt';
        fps = 1;
        dir = lastAnim[1];
    } else {
        if(this.attacking === true) {
            sprite = form.attack;
            prefix = 'attack';
            fps = form.data.attackfps;
            dir = lastAnim[1];
        } else {
            if(this.entity.velX === 0 && this.entity.velY === 0) {
                prefix = 'idle';
                dir = lastAnim[1];
            } else {
                prefix = 'walk';
            }
            sprite = form.walk;
        }
    }

    if     (this.entity.velY > 0) { dir = 'down';  }
    else if(this.entity.velY < 0) { dir = 'up';    }
    if     (this.entity.velX > 0) { dir = 'right'; }
    else if(this.entity.velX < 0) { dir = 'left';  }

    return {
        sprite : sprite,
        form   : form,
        prefix : prefix,
        dir    : dir,
        name   : prefix+'-'+dir,
        fps    : fps,
    };
}

Player.prototype.update = function(delta, geometry) {
    var formStat = getFormOrBase(this.currentForm);
    this.entity.terminalVelocity = formStat.speed;
    if(this.entity.health <= 0) {
        this.entity.velX = 0;
        this.entity.velY = 0;
        this.healthBar.width = 0;
        return;
    }

    var increase = (formStat.speed / 50)*delta;
    if(this.northDown === true) { this.entity.velY += -increase; }
    if(this.southDown === true) { this.entity.velY += increase;  }
    if(this.eastDown  === true) { this.entity.velX += increase;  }
    if(this.westDown  === true) { this.entity.velX += -increase; }

    if(this.attacking === true) {
        this.attackTimer += delta;
        this.entity.velX *= 0.75;
        this.entity.velY *= 0.75;
    }

    if(this.attackTimer >= formStat.attackSpeed) {
        this.attacking = false;
        this.attackTimer = 0;
    }

    var animation = this.getCurrentAnimation();

    if(this.lastSprite) {
        this.lastSprite.visible = false;
    }
    animation.sprite.visible = true;

    //Now we have the sprite we currently want along with the last direction and anim
    //and the current direction and anim
    if(animation.name !== this.lastAnim || animation.sprite !== this.lastSprite) {
        this.lastAnim = animation.name;
        try {
            animation.sprite.animations.play(animation.name, animation.fps, true);
        } catch(e) {
            console.log(animation);
            console.log(animation.sprite);
            console.log(animation.name);
            console.log(e);
        }
    }

    this.lastSprite = animation.sprite;

    this.entity.update(delta, (!this.eastDown && !this.westDown), (!this.northDown && !this.southDown), geometry);

    animation.sprite.x = this.entity.x;
    animation.sprite.y = this.entity.y;
    this.nameLabel.text = this.username + " ("+this.score+")";
    this.nameLabel.x = this.entity.x;
    this.nameLabel.y = this.entity.y - 50;
    game.world.bringToTop(this.nameLabel); //TODO Groups

    var x = this.entity.x-50;
    var y = this.entity.y - 35;
    this.healthBar.x = x;
    this.healthBar.y = y;
    this.healthBarBack.x = x;
    this.healthBarBack.y = y;
    this.healthBar.width = 100 - (100-this.entity.health);
    game.world.bringToTop(this.healthBarBack); //TODO Groups
    game.world.bringToTop(this.healthBar); //TODO Groups
}

Player.prototype.removeGraphics = function() {
    game.world.remove(this.nameLabel);
    for(var i = 0; i < this.forms.length; i++) {
        var form = this.forms[i];
        game.world.remove(form.walk);
        game.world.remove(form.attack);
        game.state.getCurrentState().group.remove(form.walk);
        game.state.getCurrentState().group.remove(form.attack);
    }
    game.world.remove(this.lastSprite);
    game.world.remove(this.healthBar);
    game.world.remove(this.healthBarBack);
}

Player.prototype.startAttack = function() {
    this.attacking = true;
    this.attackTimer = 0;
    if(!this.hurt === true) {
        var animation = this.getCurrentAnimation();
        this.lastAnim = animation.name;
        animation.sprite.animations.getAnimation(animation.name).restart();
        animation.sprite.animations.play(animation.name, animation.fps, true);
        if(this.lastSprite) {
            this.lastSprite.visible = false;
        }

        this.lastSprite = animation.sprite;
        animation.sprite.x = this.entity.x;
        animation.sprite.y = this.entity.y;
        animation.sprite.visible = true;
    }
}

Player.prototype.render = function() {
    var x = this.entity.x-50;
    var y = this.entity.y - 40;
    //game.
    //game.debug.geom(this.healthBack,'#000000');
    //game.debug.geom(this.healthFor,'#ff0000');
}

function Projectile(x, y, velx, vely, owner) {
    this.x = x;
    this.y = y;
    this.speed = 1000;
    this.width = 64;
    this.height = 64;
    this.velX = velx;
    this.velY = vely;
    var angle = Math.atan2(vely, velx);
    angle = angle * (180/3.14159265);
    var ind = (angle - (angle % 45)) / 45;
    ind += 3;

    var start = ind * 8;
    console.log(ind+" - "+start);

    this.id = -1;
    this.username = owner;
    this.sprite = game.add.sprite(this.width, this.height, 'fireball');
    this.sprite.animations.add('fire', [start,start+1, start+2, start+3, start+4, start+5, start+6, start+7]);
    this.sprite.play('fire', 16, true);
    game.state.getCurrentState().group.add(this.sprite);
    this.sprite.anchor.setTo(0.5, 0.5);
}

Projectile.prototype.intersects = function(x1, y1, w1, h1) {
    var x0 = this.x-this.width/2,
    y0 = this.y+-this.height/2,
    w0 = this.width,
    h0 = this.height;
    return !(x0 > x1+w1
          || x0+w0 < x1
          || y0 > y1+h1
          || y0+h0 < y1);
}

Projectile.prototype.update = function(delta) {
    var sec = delta * 0.001;
    this.x += this.velX*sec;
    this.y += this.velY*sec;

    this.sprite.x = this.x;
    this.sprite.y = this.y;

    //returns whether we moved or not
    return this.velX != 0 || this.velY != 0;
}

Projectile.prototype.remove = function() {
    game.world.remove(this.sprite);
    game.state.getCurrentState().group.remove(this.sprite);
}
