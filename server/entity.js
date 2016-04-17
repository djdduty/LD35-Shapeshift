function Entity(id)
{
    this.health = 100;
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;
    this.id = id;
    this.velX = 0;
    this.velY = 0;
    this.terminalVelocity = 300;
}

//time it takes for player to stop moving from top speed in ms
Entity.prototype.intersects = function(x1, y1, w1, h1) {
    var x0 = this.x - this.width/2,
    y0 = this.y - this.height/2,
    w0 = this.width,
    h0 = this.height;
    return !(x0 > x1+w1
          || x0+w0 < x1
          || y0 < y1+h1
          || y0+h0 < y1);
}

Entity.prototype.intersectsObj = function(bb) {
    return this.intersects(bb.x, bb.y, bb.width, bb.height);
}

Entity.prototype.update = function(delta, slowDownX, slowDownY, geometry)
{
    if(this.velX > this.terminalVelocity)  { this.velX = this.terminalVelocity;  }
    if(this.velX < -this.terminalVelocity) { this.velX = -this.terminalVelocity; }
    if(this.velY > this.terminalVelocity)  { this.velY = this.terminalVelocity;  }
    if(this.velY < -this.terminalVelocity) { this.velY = -this.terminalVelocity; }

    var sec = delta * 0.001;
    var oldx = this.x;
    this.x += (this.velX * sec);
    //check collisions
    if(geometry) {
        for(var i = 0; i < geometry.length; i++) {
            if(this.intersectsObj(geometry[i])) {
                //console.log("colliding");
                //console.log(geometry[i]);
                this.x = oldx;
                break;
            }
        }
    }

    var oldy = this.y;
    this.y += (this.velY * sec);
    if(geometry) {
        for(var i = 0; i < geometry.length; i++) {
            if(this.intersectsObj(geometry[i])) {
                this.y = oldy;
                break;
            }
        }
    }
    //check collisions

    if(this.x-50 < 0) this.x = 50;
    if(this.y-50 < 0) this.y = 50;

    if(this.x+50 > (256*16)) this.x = (256*16)-50;
    if(this.y+50 > (256*16)) this.y = (256*16)-50;
    //find how much to slow per ms
    var reduce = (500 / this.terminalVelocity) * delta;
    if(slowDownX) {
        if(this.velX < 0) {
            this.velX += reduce;
            if(this.velX > 0) this.velX = 0;
        } else {
            this.velX -= reduce;
            if(this.velX < 0) this.velX = 0;
        }
    }
    if(slowDownY) {
        if(this.velY < 0) {
            this.velY += reduce;
            if(this.velY > 0) this.velY = 0;
        } else {
            this.velY -= reduce;
            if(this.velY < 0) this.velY = 0;
        }
    }
}

Entity.prototype.takeDamage = function(damn,fromEntity)
{
    this.health -= damn;
    this.lastAttackedBy = fromEntity;
}

module.exports = Entity;
