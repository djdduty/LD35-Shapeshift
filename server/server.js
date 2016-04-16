var util = require("util"), io = require("socket.io"), Scene = require("./scene"), Player = require("./player");

var DESIRED_TICKRATE = 20.0;

var server,
    scene;

/*
*
* The basic philosophy here is that the server will send the delta world state to every client every 20 ms at most,
* when a client initially connects they get the full world state. The client can deduce players leaving or joining,
* and state changes on a player, such as username or position, from the delta world states. When a client event happens,
* it will emit an event and the server here will listen to it then make changes to the world state as necessary.
*
*/

function init() {
    scene = new Scene();
    server = io.listen(3889, {transports: ["websocket"]});
    util.log("Now listening on port 3889");

    setEventHandlers();
    setImmediate(update);
}

var curTime = 0, prevTime = 0, delta = 0;
function update() {
    prevTime = curTime;
    curTime = (new Date()).getTime();
    delta = curTime - prevTime;

    //Send all clients the world state
    scene.update();
    var state = scene.toState();
    server.sockets.emit('worldState', state);

    var diff = (1000 / DESIRED_TICKRATE) - delta;
    if(diff > 0)
        setTimeout(update, diff);
    else
        setImmediate(update);
}

function setEventHandlers()
{
    server.sockets.on("connection", onConnect);
}

function onConnect(client) {
    util.log("Client connected: "+client.id);
    client.emit("identify", {id: client.id});

    var player = new Player(client.id);
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
        this.emit("usernameBad", {errMsg:"Username length must be greater than 0!"});
        return;
    }

    var existing = scene.getPlayerByUsername(data.username);
    if(existing) {
        this.emit("usernameBad", {errMsg:"Username already in use!"});
        return;
    }
    this.emit("usernameOk");

    var player = scene.getPlayer(this.id);
    if(player) player.username = data.username;
    //this is the official "Joined the game" event
    var state = scene.toState();
    this.emit('worldState', {data: JSON.stringify(state)});
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
