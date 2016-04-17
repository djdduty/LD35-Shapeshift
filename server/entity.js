function Entity(id)
{
    this.username = '';
    this.health = 100;
    this.x = 0;
    this.y = 0;
    this.id = id;
    this.velX = 0;
    this.velY = 0;
    this.terminalVelocity = 250;
}

//time it takes for player to stop moving from top speed in ms
Entity.prototype.update = function(delta, slowDownX, slowDownY)
{
    if(this.velX > this.terminalVelocity) { this.velX = this.terminalVelocity; }
    if(this.velX < -this.terminalVelocity) { this.velX = -this.terminalVelocity; }
    if(this.velY > this.terminalVelocity) { this.velY = this.terminalVelocity; }
    if(this.velY < -this.terminalVelocity) { this.velY = -this.terminalVelocity; }

    var sec = delta * 0.001;
    this.x += (this.velX * sec);
    this.y += (this.velY * sec);

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
