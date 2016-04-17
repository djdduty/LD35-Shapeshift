function Scene(world) {
    this.players = [];
    this.projectiles = [];
    this.world = world;
}

Scene.prototype.addPlayer = function(player) {
    this.players.push(player);
}

Scene.prototype.update = function(deltaTime) {
    //calculate physics, projectile collisions, player hits, etc.
    for(var i = 0; i < this.players.length; i++) {
        this.players[i].update(deltaTime);
    }
}

Scene.prototype.toState = function() {
    return {players: this.players, projectiles: this.projectiles};
}

Scene.prototype.fromState = function(state) {
    //load from state and update objects accordingly
    for(var i = 0; i < state.players.length; i++)
    {
        //set local player to corresponding state.player
        var remote = state.players[i];
        var local = this.getPlayerByClient(remote.clientID);
        if(!local) {
            //doesn't exist, we should create a new local to reflect the remote
            local = new Player(remote.clientID, remote.entity.id);
            this.players.push(local);
        }
        for(var prop in remote) {
            if(prop != 'entity') {
                var val = remote[prop];
                local[prop] = val;
            }
        }

        for(var prop in remote.entity) {
            var val = remote.entity[prop];
            local.entity[prop] = val;
        }
    }
    //console.log(this.players);
}

Scene.prototype.sinceState = function(fromState) {
    //TODO: calculate differences since fromState and return delta
    //for now this just returns the full state
    return this.toState();
}

//by client id
Scene.prototype.getPlayerByClient = function(id) {
    for(var i = 0; i < this.players.length; i++) {
        if(this.players[i].clientID == id) {
            return this.players[i];
        }
    }
    return null;
}

Scene.prototype.removePlayer = function(id) {
    //TODO: Save player in some file somewhere
    var player = this.getPlayerByClient(id);
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
        if(this.players[i].username.toLowerCase() == username.toLowerCase()) {
            return this.players[i];
        }
    }
    return null;
}

module.exports = Scene;
