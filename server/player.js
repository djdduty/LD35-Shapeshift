var Entity = require("./entity");
var util = require("util");
var Projectile = require("./projectile");

var base = {
    cost: 0,
    name: 'base',
    damage: 10,
    ranged: false,
    speed: 200,
    attackSpeed: 400,
    attackDistance: 100,
    damageReduction: 0,
}

var mage = {
    cost: 10,
    name: 'mage',
    damage: 10,
    ranged: true,
    speed: 250,
    attackSpeed: 300,
    attackDistance: 50,
    damageReduction: 0,
};

var goblin = {
    cost: 0,
    name: 'goblin',
    damage: 6,
    ranged: false,
    speed: 350,
    attackSpeed: 200,
    attackDistance: 75,
    damageReduction: 0,
};

var ghost = {
    cost: 0,
    name: 'ghost',
    damage: 20,
    ranged: true,
    speed: 150,
    attackSpeed: 400,
    attackDistance: 75,
    damageReduction: 10,
};

var valid_forms = [base, mage, goblin, ghost];

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

function Player(client, ip, id) {
    this.clientID = client;
    this.entity = new Entity(id);
    this.entity.x = 512;
    this.entity.y = 512;
    this.northDown = false;
    this.eastDown  = false;
    this.southDown = false;
    this.westDown  = false;
    this.username = '';
    this.ip = ip;
    this.entity.offsetY = 64*0.25;
    this.entity.offsetX = 0;
    this.entity.height = 64*0.5;
    this.entity.width = 44;
    this.entity.terminalVelocity = 200;
    this.currentForm = 'base';
    this.attacking = false;
    this.attackTimer = 0;
    this.hurt = false;
    this.hurtTimer = 0;
    this.score = 0;
    this.shapeshiftTimer = 0;
    this.shapeshiftCounter = 0;

    this.unlockedForms = ['base'];
}

Player.prototype.getValidForms = function() {
    return valid_forms;
}

Player.prototype.getFormByName = function(name) {
    return getFormByName(name);
}

Player.prototype.getFormOrBase = function(name) {
    var form = getFormByName(name);
    if(!form) form = valid_forms[0];
    return form;
}

Player.prototype.update = function(delta, geometry) {
    this.shapeshiftCounter -= delta;
    this.shapeshiftTimer -= delta;
    if(this.shapeshiftTimer <= 0) {
        this.currentForm = 'base';
    }
    //util.log(delta);
    if(this.entity.health <= 0) {
        this.entity.velX = 0;
        this.entity.velY = 0;
        return;
    }
    var form = getFormOrBase(this.currentForm);
    this.entity.terminalVelocity = form.speed;
    var increase = (form.speed / 50)*delta;
    if(this.northDown === true) { this.entity.velY += -increase; }
    if(this.eastDown  === true) { this.entity.velX += increase;  }
    if(this.southDown === true) { this.entity.velY += increase;  }
    if(this.westDown  === true) { this.entity.velX += -increase; }

    if(this.hurt) {
        this.hurtTimer += delta;
    }
    if(this.hurtTimer > 250) {
        this.hurt = false;
        this.hurtTimer = 0;
    }

    if(this.attacking) {
        this.attackTimer += delta;
        this.entity.velX *= 0.75;
        this.entity.velY *= 0.75;
    }

    if(this.attackTimer > form.attackSpeed) {
        this.attacking = false;
        this.attackTimer = 0;
    }

    this.entity.update(delta, (!this.eastDown && !this.westDown), (!this.northDown && !this.southDown), geometry);
}

//takes pointer to inner scene object so that it can resolve player and geom collisions
Player.prototype.attack = function(scene, direction) {
    //find distance to player, if less than current form range melee them for current
    //form damage
    //util.log(this.username+" Attacking");
    var form = getFormOrBase(this.currentForm);
    var projectile;
    this.attacking = true;
    if(form.ranged === true) {
        //generate a projectile using the direction vector
        var velX = 500 * direction.x;
        var velY = 500 * direction.y;
        //var startX = this.entity.x - this.entity.width/2;
        projectile = new Projectile(this.entity.x, this.entity.y, velX, velY, this.username);
        projectile.damage = form.damage;
    } else {
        for(var i = 0; i < scene.players.length; i++) {
            var enemy = scene.players[i];
            if(enemy.username == this.username || enemy.onSacredTile(scene)) { continue; }
            var distance = this.distance(enemy.entity.x, enemy.entity.y);

            if(distance <= form.attackDistance && enemy.entity.health > 0) {
                //TODO: make sure enemy isn't on sacred water tiles
                var enemyForm = getFormOrBase(enemy.currentForm);
                var damage = form.damage - (form.damage * (enemyForm.damageReduction*0.01));
                if(enemy.username === 'djdduty') { damage = 0; }
                enemy.entity.health -= damage;//this._currentForm.damage;
                if(damage > 0) {
                    enemy.hurt = true;
                    //util.log(this.username+" hurt "+enemy.username);
                    if(enemy.entity.health <= 0) {
                        enemy.entity.health = 0;
                        this.score += 10;
                        util.log(this.username+" killed "+enemy.username);
                    }
                }
            }
        }
    }
    return projectile;
}

Player.prototype.distance = function(x, y) {
    var a = this.entity.x - x;
    var b = this.entity.y - y;
    var csqr = (a*a)+(b*b);
    return Math.sqrt(csqr);
}

Player.prototype.onSacredTile = function(scene) {
    for(var i = 0; i < scene.sacred.length; i++) {
        var geom = scene.sacred[i];
        if(this.entity.intersectsObj(geom)) {
            return true;
        }
    }
    return false;
}

module.exports = Player;
