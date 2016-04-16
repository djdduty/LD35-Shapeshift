var Entity = require("./entity");

function Player(client, id) {
    this.clientID = client;
    this.entity = new Entity(id);
}

module.exports = Player;
