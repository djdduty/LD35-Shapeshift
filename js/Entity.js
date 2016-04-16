class Entity
{
    constructor(userName)
    {
       this.userName = userName;
       this.health   = 1.0;
       this.x        = 0.0;
       this.y        = 0.0;
    }
    TakeDamage(damn,fromEntity)
    {
        this.health -= damn;
        this.lastAttackedBy = fromEntity;
    }
}
