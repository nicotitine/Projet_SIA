class TimelapsMesh extends CollidableMesh {
    constructor(_geometry, _material, _scale, _lifetime, _t) {

        super(_geometry, _material, _scale);

        this.lifetime = _lifetime;
        this.timestamp = _t;
    }

    mustDie(_t) {
        if(this.lifetime + this.timestamp < _t) {
            return true;
        } else {
            return false;
        }
    }
}
