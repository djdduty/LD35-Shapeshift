function Scene(world) {
    this.players = [];
    this.projectiles = [];
    this.world = world;
    this.disconnected = [];

    this.geometry = [];
    this.sacred = [];
    var tSize = 128;
    for(y = 0;y < world.staticEntities.length;y++)
    {
        for(x = 0;x < world.staticEntities[y].length;x++)
        {
            var index = world.staticEntities[y][x];
            if(index < 3) {
                var xpos = x * tSize;
                var ypos = y * tSize;
                var boundingBox = {x:xpos+20, y:ypos, width:tSize-40, height:tSize};
                this.geometry.push(boundingBox);
            }

            if(index === 4 || (index >= 12 && index <= 20)) {
                var xpos = x * tSize;
                var ypos = y * tSize;
                var boundingBox = {x:xpos, y:ypos, width:tSize, height:tSize};
                this.sacred.push(boundingBox);
            }
            //sprite = game.add.sprite(x*256,y*256,""+game.gameScene.scene.world.staticEntities[y][x]);
        }
    }
}

Scene.prototype.addPlayer = function(player) {
    this.players.push(player);
}

Scene.prototype.update = function(deltaTime) {
    //calculate physics, projectile collisions, player hits, etc.
    for(var i = 0; i < this.players.length; i++) {
        this.players[i].update(deltaTime, this.geometry);
    }

    if(this.projectiles.length > 0) {
        for(var i = this.projectiles.length-1; i >= 0; i--) {
            var projectile = this.projectiles[i];
            var owner = this.getPlayerByUsername(projectile.username);
            if(!owner) { continue; }
            projectile.update(deltaTime);
            if(!owner.onSacredTile(this)) {
                for(var n = 0; n < this.players.length; n++) {
                    var player = this.players[n];
                    if(player.entity.health <= 0 || player.onSacredTile(this)) continue;
                    //console.log(player.username+" vs "+projectile.username);
                    //console.log(projectile);
                    if(player.username !== projectile.username) {
                        if(player.entity.intersects(projectile.x, projectile.y, projectile.width, projectile.height)) {
                            var form = player.getFormOrBase(player.currentForm);
                            var damage = projectile.damage - (projectile.damage * (form.damageReduction*0.01));
                            player.entity.health -= damage;
                            player.hurt = true;
                            //console.log(projectile.username+' hurt '+player.username);
                            if(player.entity.health <= 0) {
                                player.entity.health = 0;
                                var killer = owner;
                                if(killer) { killer.score += 10; }
                                console.log(killer.username+' killed '+player.username);
                            }
                            this.removeProjectileById(projectile.id);
                            continue;
                        }
                    }
                }
            }

            for(var n = 0; n < this.geometry.length; n++) {
                var geom = this.geometry[n];
                if(projectile.intersects(geom.x, geom.y, geom.width, geom.height)) {
                    this.removeProjectileById(projectile.id);
                }
            }
            //check intersection with players and do damage if not owner
        }
    }
}

Scene.prototype.toState = function() {
    var disconnected = this.disconnected;
    this.disconnected = [];
    return {players: this.players, projectiles: this.projectiles, disconnected: disconnected};
}

Scene.prototype.getProjectileById = function(id) {
    for(var i = 0; i < this.projectiles.length; i++) {
        if(this.projectiles[i].id === id) return this.projectiles[i];
    }
    return null;
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

    for(var i =0; i < this.projectiles.length; i++) {
        this.projectiles[i].touched = false;
    }

    for(var i = 0; i < state.projectiles.length; i++) {
        var remote = state.projectiles[i];
        var local = this.getProjectileById(remote.id);
        if(!local) {
            local = new Projectile(remote.x, remote.y, remote.velX, remote.velY, remote.owner);
            local.id = remote.id;
            this.projectiles.push(local);
        }
        for(var prop in remote) {
            var val = remote[prop];
            local[prop] = val;
        }
        local.touched = true;
    }

    for(var i =0; i < this.projectiles.length; i++) {
        if(this.projectiles[i].touched == false) {
            this.removeProjectile(i);
        }
    }

    for(var i = 0; i < state.disconnected.length; i++) {
        this.removePlayer(state.disconnected[i]);
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
    if(!player) { return false; }
    if(player.removeGraphics)
        player.removeGraphics();
    var ind = this.players.indexOf(player);
    if(ind >= 0) {
        this.players.splice(ind, 1);
        this.disconnected.push(id);
        return true;
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

Scene.prototype.removeProjectileById = function(id) {
    projind = -1;
    for(var i = 0; i < this.projectiles.length; i++) {
        if(this.projectiles[i].id == id) projind = i;
    }
    if(projind >= 0) {
        this.projectiles[projind].remove();
        this.projectiles.splice(projind, 1);
    }
}

Scene.prototype.removeProjectile = function(index) {
    if(!this.projectiles[index]) { return; util.log("could not find projectile at index: "+index); }
    this.projectiles[index].remove();
    this.projectiles.splice(index, 1);
}

module.exports = Scene;
