function Scene() {
    this.players = [];
    this.projectiles = [];
}

Scene.prototype.addPlayer = function(player) {
    this.players.push(player);
}

Scene.prototype.update = function(deltaTime) {
    //calculate physics, projectile collisions, player hits, etc.
}

Scene.prototype.toState = function() {
    return {players: this.players, projectiles: this.projectiles};
}

Scene.prototype.fromState = function(state) {
    //load from state and update objects accordingly
    for(var i = 0; i < state.entities.length; i++)
    {

    }
}

Scene.prototype.sinceState = function(fromState) {
    //TODO: calculate differences since fromState and return delta
    return this.toState();
}

Scene.prototype.getPlayer = function(id) {
    for(var i = 0; i < this.players.length; i++) {
        if(this.players[i].clientID == id) {
            return this.players[i];
        }
    }
    return null;
}

Scene.prototype.removePlayer = function(id) {
    //TODO: Save player in some file somewhere
    var player = this.getPlayer(id);
    if(player) {
        var ind = this.players.indexOf(player);
        if(ind >= 0) {
            this.players.splice(ind, 1);
            return true;
        }
        return false;
    }
    return false;
}

Scene.prototype.getPlayerByUsername = function(username) {
    for(var i = 0; i < this.players.length; i++) {
        if(this.players[i].entity.username.toLowerCase() == username.toLowerCase()) {
            return this.players[i];
        }
    }
    return null;
}

module.exports = Scene;
