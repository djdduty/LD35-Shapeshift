var Entity = require("./entity");

function Player(client, id) {
    this.clientID = client;
    this.entity = new Entity(id);
    this.northDown = false;
    this.eastDown  = false;
    this.southDown = false;
    this.westDown  = false;
}

Player.prototype.update = function(delta) {
    this.velX = 0;
    this.velY = 0;
    if(this.northDown === true) { this.entity.velY = -100;  }
    if(this.eastDown  === true) { this.entity.velX = 100;  }
    if(this.southDown === true) { this.entity.velY = 100; }
    if(this.westDown  === true) { this.entity.velX = -100; }
    this.entity.update(delta);
}

module.exports = Player;
