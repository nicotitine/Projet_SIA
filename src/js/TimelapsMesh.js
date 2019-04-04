class TimelapsMesh extends CollidableMesh {
    constructor(_geometry, _material, _scale, _lifetime) {

        super(_geometry, _material, _scale);

        this.lifetime = _lifetime;
        this.timestamp = Date.now();
    }
    
    mustDie() {
        if(this.lifetime + this.timestamp < Date.now()) {
            return true;
        } else {
            return false;
        }
    }
}
