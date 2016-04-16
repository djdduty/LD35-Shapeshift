function Entity(id)
{
    this.username = '';
    this.health = 100;
    this.x = 0;
    this.y = 0;
    this.id = id;
    this.velX = 0;
    this.velY = 0;
    this.terminalVelocity = 100;
    this.stopDuration = 250;
}

//time it takes for player to stop moving from top speed in ms
Entity.prototype.update = function(delta)
{
    if(this.velX > this.terminalVelocity) { this.velX = this.terminalVelocity; }
    if(this.velX < -this.terminalVelocity) { this.velX = -this.terminalVelocity; }
    if(this.velY > this.terminalVelocity) { this.velY = this.terminalVelocity; }
    if(this.velY < -this.terminalVelocity) { this.velY = -this.terminalVelocity; }

    var sec = delta * 0.001;
    this.x += (this.velX * sec);
    this.y += (this.velY * sec);
    //find how much to slow per ms
    var reduce = (this.stopDuration / this.terminalVelocity) * delta;
    this.velX = 0;
    this.velY = 0;
    //var ratio = this.velX / this.terminalVelocity;
    //this.velX *= (ratio * reduce);
    //ratio = this.velY / this.terminalVelocity;
    //this.velY *= (ratio * reduce);
}

Entity.prototype.takeDamage = function(damn,fromEntity)
{
    this.health -= damn;
    this.lastAttackedBy = fromEntity;
}

module.exports = Entity;
