var Entity = require("./entity");
var util = require("util");

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
    this._attacking = false;
    this._attackTimer = 0;
    this.hurt = false;
    this.hurtTimer = 0;
}

Player.prototype.update = function(delta, geometry) {
    //util.log(delta);
    if(this.entity.health >= 0) {
        var increase = (this.entity.terminalVelocity / 50)*delta;
        if(this.northDown === true) { this.entity.velY += -increase; }
        if(this.eastDown  === true) { this.entity.velX += increase;  }
        if(this.southDown === true) { this.entity.velY += increase;  }
        if(this.westDown  === true) { this.entity.velX += -increase; }
    }

    if(this.hurt) {
        this.hurtTimer += delta;
    }
    if(this.hurtTimer > 250) {
        this.hurt = false;
        this.hurtTimer = 0;
    }

    if(this._attacking) {
        this._attackTimer += delta;
        this.entity.velX *= 0.75;
        this.entity.velY *= 0.75;
    }

    if(this._attackTimer > 500) {
        this._attacking = false;
        this._attackTimer = 0;
    }

    this.entity.update(delta, (!this.eastDown && !this.westDown), (!this.northDown && !this.southDown), geometry);
}

Player.prototype.attack = function(players) {
    //find distance to player, if less than current form range melee them for current
    //form damage
    //util.log(this.username+" Attacking");
    for(var i = 0; i < players.length; i++) {
        var enemy = players[i];
        if(enemy.username == this.username) { continue; }
        var distance = this.distance(enemy.entity.x, enemy.entity.y);

        if(distance < 50 && enemy.entity.health > 0) {
            enemy.entity.health -= 10;//this._currentForm.damage;
            enemy.hurt = true;
            util.log(this.username+" hurt "+enemy.username);
            if(enemy.entity.health <= 0) {
                enemy.entity.health = 0;
                util.log(this.username+" killed "+enemy.username);
            }
        }
    }
}

Player.prototype.distance = function(x, y) {
    var a = this.entity.x - x;
    var b = this.entity.y - y;
    var csqr = (a*a)+(b*b);
    return Math.sqrt(csqr);
}

module.exports = Player;
