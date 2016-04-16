var util = require("util"), io = require("socket.io");

var DESIRED_TICKRATE = 20.0;

var server;

function init() {
    server = io.listen(3889, {transports: ["websocket"]});

    setEventHandlers();
    setImmediate(update);
}

var curTime = 0, prevTime = 0, delta = 0;
function update() {
    prevTime = curTime;
    curTime = (new Date()).getTime();
    delta = curTime - prevTime;

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
    util.log("New client connected: "+client.id);
    client.on("disconnect", onDisconnect);
    //todo add player
}

function onDisconnect() {
    util.log("Client disconnected: "+this.id)
    //todo remove player
}

//player tried to pickup
//player tried to move
//player tried to use
//player tried to shapeshift

init();
