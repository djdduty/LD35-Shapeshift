var isServer = false;
var util = require("util"), io = require("socket.io"), Scene = require("./scene"), Player = require("./player");

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
    scene = new Scene();
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
    util.log("Client connected: "+client.id);
    client.emit("identify", {id: client.id});

    var player = new Player(client.id, ++lastEntityId);
    scene.addPlayer(player);

    client.on("disconnect", onDisconnect);
    client.on("setUsername", onSetUsername);
    client.on("playerPickup", onPlayerPickup);
    client.on("playerMove", onPlayerMove);
    client.on("playerUse", onPlayerUse);
    client.on("playerShapeshift", onPlayerShapeshift);
    //todo add player
}

function onDisconnect() {
    util.log("Client disconnected: "+this.id)
    scene.removePlayer(this.id);
    //todo remove player
}

function onSetUsername(data) {
    util.log("Client: "+this.id+" setting username: "+data.username);
    var username = data.username;
    if( username === null || username === "null" || username.length < 1 || username.trim().length < 1) {
        this.emit("usernameBad", {errMsg:"Invalid Username!"});
        return;
    }

    var existing = scene.getPlayerByUsername(data.username);
    if(existing) {
        this.emit("usernameBad", {errMsg:"Username already in use!"});
        return;
    }
    this.emit("usernameOk");

    var player = scene.getPlayerByClient(this.id);
    if(player) player.entity.username = data.username;
    //this is the official "Joined the game" event
    var state = scene.toState();
    this.emit('worldState', state);
}

function onPlayerPickup(data) {
    //Verify pickup and make it so
}

function onPlayerMove(data) {
    //Verify movement, calculate velocity, and make it so
}

function onPlayerUse(data) {
    //Verify item use and make it so
}

function onPlayerShapeshift(data) {
    //Verify shapeshift and make it so
}

init();
