var lastID = 0;
function Projectile(x, y, velx, vely, owner) {
    this.x = x;
    this.y = y;
    this.speed = 750;
    this.width = 64;
    this.height = 64;
    this.velX = velx;
    this.velY = vely;
    this.id = lastID+1;
    this.damage = 0;
    lastID+=1;
    this.username = owner;
}

Projectile.prototype.intersects = function(x1, y1, w1, h1) {
    var x0 = this.x-this.width/2,
    y0 = this.y-this.height/2,
    w0 = this.width,
    h0 = this.height;
    return !(x0 > x1+w1
          || x0+w0 < x1
          || y0 > y1+h1
          || y0+h0 < y1);
}

Projectile.prototype.update = function(delta) {
    var sec = delta * 0.001;
    this.x += this.velX*sec;
    this.y += this.velY*sec;

    //returns whether we moved or not
    return this.velX != 0 || this.velY != 0;
}

Projectile.prototype.remove = function() {

}

module.exports = Projectile;
