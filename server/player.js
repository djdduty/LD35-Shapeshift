var Entity = require("./entity");
var util = require("util");

function Player(client, id) {
    this.clientID = client;
    this.entity = new Entity(id);
    this.entity.x = 400;
    this.entity.y = 300;
    this.northDown = false;
    this.eastDown  = false;
    this.southDown = false;
    this.westDown  = false;
}

Player.prototype.update = function(delta) {
    //util.log(delta);
    if(this.northDown === true) { this.entity.velY += -0.25*delta; }
    if(this.eastDown  === true) { this.entity.velX += 0.25*delta;  }
    if(this.southDown === true) { this.entity.velY += 0.25*delta;  }
    if(this.westDown  === true) { this.entity.velX += -0.25*delta; }
    this.entity.update(delta);
}

module.exports = Player;
