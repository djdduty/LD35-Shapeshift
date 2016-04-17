var Entity = require("./entity");
var util = require("util");

function Player(client, ip, id) {
    this.clientID = client;
    this.entity = new Entity(id);
    this.entity.x = 400;
    this.entity.y = 300;
    this.northDown = false;
    this.eastDown  = false;
    this.southDown = false;
    this.westDown  = false;
    this.username = '';
    this.ip = ip;
}

Player.prototype.update = function(delta) {
    //util.log(delta);
    var increase = (this.entity.terminalVelocity / 250)*delta;
    if(this.northDown === true) { this.entity.velY += -increase; }
    if(this.eastDown  === true) { this.entity.velX += increase;  }
    if(this.southDown === true) { this.entity.velY += increase;  }
    if(this.westDown  === true) { this.entity.velX += -increase; }
    this.entity.update(delta, !this.eastDown && !this.westDown, !this.northDown && !this.southDown);
}

module.exports = Player;
