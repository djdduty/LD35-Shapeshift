var Entity = require("./entity");

function Player(ident) {
    this.clientID = ident;
    this.Entity = new Entity;
}

module.exports = Player;
