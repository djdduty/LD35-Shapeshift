function ClientScene(clientID) {
    this.clientID = clientID;
    var world = new World();
    this.scene = new Scene(world);
}

ClientScene.prototype.fromState = function(state) {
    this.scene.fromState(state);
}

ClientScene.prototype.update = function(delta) {
    this.scene.update(delta);
    var us = this.scene.getPlayerByUsername(game.username);
    if(us) {
        game.camera.follow(us.getCurrentAnimation().sprite);
    }
}

ClientScene.prototype.getPlayer = function() {
    var us = this.scene.getPlayerByUsername(game.username);
    if(us) {
        return us;
    }

    return null;
}

ClientScene.prototype.thisPlayer = function() {
    if(this.clientID = 0) {
        return null;
    }
    return this.scene.getPlayerByClient(this.clientID);
}

ClientScene.prototype.render = function() {
    for(var i = 0; i < this.scene.players.length; i++) {
        this.scene.players[i].render();
    }
}
