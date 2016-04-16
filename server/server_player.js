var Player = function(userName) {
    var x = 0,
        y = 0,
        id,
        name=userName,
        health = 100;

    var getX = function() { return x; }
    var getY = function() { return y; }

    var setX = function(nX) { x = nX; return x; }
    var setY = function(nY) { y = nY; return y; }

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        id: id,
        name: userName,
        health: health
    }
}
