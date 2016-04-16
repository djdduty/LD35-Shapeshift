//classes don't exist in es5, which is what we want to support

function Player(client, id) {
    this.clientID = client;
    this.entity = new Entity(id);
}

function Enemy(id) {
    this.entity = new Entity(id);
}

function Projectile(id) {
    this.entity = new Entity(id);
}
