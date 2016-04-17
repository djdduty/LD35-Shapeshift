//classes don't exist in es5, which is what we want to support

humanForm = {
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
    hurtRight  : 27,
    hurtLeft   : 9,
    hurtUp     : 0,
    hurtDown   : 18,
    attackfps: 9,
    fps: 16
}

mageForm = {
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

        var attackSprite = game.add.sprite(form.frameWidth, form.frameHeight, form.spritePrefix+'-attack');
        attackSprite.animations.add('attack-right', form.attackRight);
        attackSprite.animations.add('attack-up'   , form.attackUp);
        attackSprite.animations.add('attack-down' , form.attackDown);
        attackSprite.animations.add('attack-left' , form.attackLeft);
        attackSprite.visible = false;
        attackSprite.smoothed = false;
        attackSprite.anchor.setTo(0.5, 0.5);

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
}

Player.prototype.getFormByName = function(name) {
    for(var i = 0; i < this.forms.length; i++) {
        if(this.forms[i].name === name) return this.forms[i];
    }
    return null;
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
    if(this.entity.health > 0) {
        var increase = (this.entity.terminalVelocity / 50)*delta;
        if(this.northDown === true) { this.entity.velY += -increase; }
        if(this.southDown === true) { this.entity.velY += increase;  }
        if(this.eastDown  === true) { this.entity.velX += increase;  }
        if(this.westDown  === true) { this.entity.velX += -increase; }
    }

    if(this.attacking === true) {
        this.attackTimer += delta;
        this.entity.velX *= 0.75;
        this.entity.velY *= 0.75;
    }

    if(this.attackTimer >= 500) {
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
            console.log(animation.name);
            console.log(e);
        }
    }

    this.lastSprite = animation.sprite;

    this.entity.update(delta, (!this.eastDown && !this.westDown), (!this.northDown && !this.southDown), geometry);

    animation.sprite.x = this.entity.x;
    animation.sprite.y = this.entity.y;
    this.nameLabel.text = this.username;
    this.nameLabel.x = this.entity.x;
    this.nameLabel.y = this.entity.y - 32;
    game.world.bringToTop(this.nameLabel); //TODO Groups
}

Player.prototype.removeGraphics = function() {
    game.world.remove(this.sprite);
    game.world.remove(this.nameLabel);
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

function Projectile(id) {
    this.entity = new Entity(id);
}
