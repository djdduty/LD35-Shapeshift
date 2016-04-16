function Entity(userName, id)
{
    this.userName = userName;
    this.health = 100;
    this.x = 0;
    this.y = 0;
    this.id = id;
}

Entity.prototype.TakeDamage = function(damn,fromEntity)
{
    this.health -= damn;
    this.lastAttackedBy = fromEntity;
}

module.exports = Entity;
