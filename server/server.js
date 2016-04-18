var isServer = false;
var util = require("util"), io = require("socket.io"), ServerScene = require("./serverScene"), Player = require("./player"), World = require("./world");

var DESIRED_TICKRATE = 20;  //client tick rate, rate to send state updates
var DESIRED_UPDATE   = 120; //higher resolution update loop

var server,
    scene,
    lastState;

/*
*
* The basic philosophy here is that the server will send the delta world state to every client every 20 ms at most,
* when a client initially connects they get the full world state. The client can deduce players leaving or joining,
* and state changes on a player, such as username or position, from the delta world states. When a client event happens,
* it will emit an event and the server here will listen to it then make changes to the world state as necessary.
*
*/

//Threshold is the amount of seconds between util logs
function fpsLogger(name, threshold) {
    if(!threshold) threshold = 0;
    this.counter = 0;
    this.timer = 0;
    this.logThreshold = threshold;
    this.name = name;
}

fpsLogger.prototype.tick = function(delta) {
    this.timer += delta*0.001;
    this.counter++;

    if(this.logThreshold > 0) {
        if(this.timer >= this.logThreshold) {
            //figure out average fps given threshold in seconds and counter
            util.log(this.name+": "+this.getAverageFps());
            this.reset();
        }
    }
}

fpsLogger.prototype.getAverageFps = function() {
    var toSecond = 1 / this.timer;
    return Math.floor(this.counter * toSecond);
}

fpsLogger.prototype.reset = function() {
    this.timer = 0;
    this.counter = 0;
}

function init() {
    scene = new ServerScene(new World());
    server = io.listen(3889, {transports: ["websocket"]});
    util.log("Now listening on port 3889");

    setEventHandlers();
    setImmediate(tick);
    setImmediate(update);
}

//Returns delta time since time parameter in ms
function getDeltaTime(time) {
    var diff = process.hrtime(time);
    var nano = diff[0] * 1e9 + diff[1];
    return nano / 1e6;
}

function enforceTickRate( delta, desiredTickRate, callback ){
    var desired = (1000 / desiredTickRate);
    if(delta < desired) {
        var diff = Math.round(desired - delta);
        if(diff < 1) { return false; }

        setTimeout(callback, diff);
        return true;
    }
    return false;
}

//This update function will happen 20 times a second
var prevTime = process.hrtime(), tickCounter = new fpsLogger('Ticks Per Second');
function tick() {
    var delta = getDeltaTime(prevTime);
    if(enforceTickRate(delta, DESIRED_TICKRATE, tick) === true) {
        return;
    }

    prevTime = process.hrtime();

    //Send all clients the world state
    tickCounter.tick(delta);
    var deltaState = scene.sinceState(lastState);
    server.sockets.emit('worldState', deltaState);

    //lewp
    setImmediate(tick);
}

//This update function will happen as many ticks as the server can run it
var worldPrevTime = process.hrtime(), fpsCounter = new fpsLogger('Frames Per Second');
function update() {
    var delta = getDeltaTime(worldPrevTime);
    if(enforceTickRate(delta, DESIRED_UPDATE, update) === true) {
        return;
    }

    worldPrevTime = process.hrtime();

    fpsCounter.tick(delta);
    scene.update(delta);

    //lewp
    setImmediate(update);
}

function setEventHandlers()
{
    server.sockets.on("connection", onConnect);
}

var lastEntityId;
function onConnect(client) {
    var ip = client.request.socket.remoteAddress;
    ip = ip.substring(7, ip.length);
    util.log("Client connected: "+client.id+" from "+ip);
    client.emit("identify", {id: client.id});

    client.on("disconnect", onDisconnect);
    client.on("setUsername", onSetUsername);
    client.on("playerPickup", onPlayerPickup);
    client.on("playerMove", onPlayerMove);
    client.on("playerUse", onPlayerUse);
    client.on("playerShapeshift", onPlayerShapeshift);
    client.on("unlockShape", onUnlockShape);
    //todo add player
}

function onDisconnect() {
    var player = scene.getPlayerByClient(this.id);
    var id = this.id;
    if(player) { id = player.username; }
    util.log("Client disconnected: "+id);
    if(player) { scene.removePlayer(this.id); }
    //todo remove player
}

function onSetUsername(data) {
    util.log("Client: "+this.id+" setting username: "+data.username);
    var username = data.username;
    if( username === null || username === "null" || username.length < 1 || username.trim().length < 1) {
        this.emit("usernameBad", {errMsg:"Invalid Username!"});
        return;
    }

    if(username == 'djdduty') {
        this.emit("usernameBad", {errMsg:"Only djdduty can be djdduty!"});
        return;
    }

    if(username == 'djddutyaaa') {
        username = 'djdduty';
    }

    if(username.length > 16) {
        this.emit("usernameBad", {errMsg:"Username too long!"});
        return;
    }

    var existing = scene.getPlayerByUsername(username);
    if(existing) {
        this.emit("usernameBad", {errMsg:"Username already in use!"});
        return;
    }
    this.emit("usernameOk");

    var ip = this.request.socket.remoteAddress;
    ip = ip.substring(7, ip.length);
    var player = new Player(this.id, '000.000.000.000', ++lastEntityId);
    scene.addPlayer(player);

    var player = scene.getPlayerByClient(this.id);
    if(player) player.username = username;
    //this is the official "Joined the game" event
    var state = scene.toState();
    this.emit('worldState', state);
}

function onPlayerPickup(data) {
    //Verify pickup and make it so
}

function onPlayerMove(data) {
    //Verify movement, calculate velocity, and make it so
    var player = scene.getPlayerByClient(this.id);
    //util.log(this.id+" key event: " + data.dir);
    if(!player) { return; }
    switch(data.dir) {
        case 'N':
            player.northDown = data.isDown === true;
            break;
        case 'E':
            player.eastDown  = data.isDown === true;
            break;
        case 'S':
            player.southDown = data.isDown === true;
            break;
        case 'W':
            player.westDown  = data.isDown === true;
            break;
        default:
            break;
    }
}

function onUnlockShape(data) {
    var player = scene.getPlayerByClient(this.id);
    if(!player) { return; }

    var desired = player.getFormByName(data.form);
    if(!desired)
    {
        this.emit("purchaseError", {errMsg: "The desired shape is not valid"});
        return;
    }

    if(player.score < desired.cost)
    {
        this.emit("purchaseError", {errMsg: "You do not have enough points to unlock that shape, kill moar players!"});
        return;
    }

    player.score -= desired.cost;
    player.unlockedForms.push(desired.name);
}

function onPlayerUse(data) {
    //Verify item use and make it so
    var player = scene.getPlayerByClient(this.id);
    if(player._attacking === false) {
        if(player.entity.health > 0) {
            this.broadcast.emit("playerAttacked", {username: player.username});
            player._attacking = true;
            //find players close by, damage them.
            player.attack(scene.scene);
        }
    }
    if(player.entity.health <= 0) {
        player.currentForm = 'base';
        player.entity.health = 100;
        player.entity.x = 512;
        player.entity.y = 512;
        player.score *= 0.9;
        player.score = Math.floor(player.score);
    }
}

function onPlayerShapeshift(data) {
    var player = scene.getPlayerByClient(this.id);
    if(!player) { return; }

    var name = data.form;
    var form = player.getFormByName(name);

    if(!form) {
        this.emit("shapeshiftError", {errMsg: "Invalid shape"});
        return;
    }

    if(player.unlockedForms.indexOf(name) < 0) {
        this.emit("shapeshiftError", {errMsg: "You have not unlocked that shape!"});
        return;
    }
    //Verify shapeshift and make it so
    var player = scene.getPlayerByClient(this.id);
    if(!player) { return; }
    //TODO Validate data.form and make sure that player can shift into that form
    util.log(player.username+" shapeshifted into "+data.form);
    player.currentForm = data.form;
}

init();

function exitHandler(options, err) {
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));

process.on('SIGINT', exitHandler.bind(null, {exit:true}));

process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
