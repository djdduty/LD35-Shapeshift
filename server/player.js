var Entity = require("./entity");

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
    this.entity.velX = 0;
    this.entity.velY = 0;
    if(this.northDown === true) { this.entity.velY = -500;  }
    if(this.eastDown  === true) { this.entity.velX = 500;  }
    if(this.southDown === true) { this.entity.velY = 500; }
    if(this.westDown  === true) { this.entity.velX = -500; }
    this.entity.update(delta);
}

module.exports = Player;
