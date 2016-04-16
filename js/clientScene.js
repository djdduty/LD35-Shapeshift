function ClientScene(clientID) {
    this.clientID = clientID;
    this.scene = new Scene(new World());
}

ClientScene.prototype.fromState = function(state) {
    this.scene.fromState(state);
}

ClientScene.prototype.update = function(delta) {
    this.scene.update(delta);
    var us = this.scene.getPlayerByUsername(game.username);
    if(us) {
        game.camera.follow(us.drawnObject);
    }
}

ClientScene.prototype.thisPlayer = function() {
    if(this.clientID = 0) {
        return null;
    }
    return this.scene.getPlayerByClient(this.clientID);
}
