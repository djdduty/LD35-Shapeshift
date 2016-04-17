var Scene = require('./scene');

function ServerScene(world) {
    this.scene = new Scene(world);
}

ServerScene.prototype.addPlayer = function(player) {
    this.scene.addPlayer(player);
}

ServerScene.prototype.update = function(deltaTime) {
    this.scene.update(deltaTime);
}

ServerScene.prototype.toState = function() {
    return this.scene.toState();
}

ServerScene.prototype.fromState = function(state) {
    this.scene.fromState(state);
}

ServerScene.prototype.sinceState = function(fromState) {
    return this.scene.sinceState(fromState);
}

//by client id
ServerScene.prototype.getPlayerByClient = function(id) {
    return this.scene.getPlayerByClient(id);
}

ServerScene.prototype.removePlayer = function(id) {
    return this.scene.removePlayer(id);
}

ServerScene.prototype.getPlayerByUsername = function(username) {
    return this.scene.getPlayerByUsername(username);
}

module.exports = ServerScene;
