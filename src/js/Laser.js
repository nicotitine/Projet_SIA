class Laser extends TimelapsMesh {
    constructor(_geometry, _material, _position, _direction, _rotation, _laserType, _t) {

        switch (_laserType) {
            case gameParameters.laser.types.SPACESHIP:

                super(_geometry, _material, new THREE.Vector3(1, 1, 1), gameParameters.laser.spaceship.lifetime, _t);

                this.rotation.z = _direction + Math.PI;
                this.vector = new THREE.Vector3(gameParameters.laser.spaceship.speed * - Math.sin(this.rotation.z), gameParameters.laser.spaceship.speed * Math.cos(this.rotation.z), 0)
                break;

            case gameParameters.laser.types.ENEMY:

                super(_geometry, _material, new THREE.Vector3(1, 1, 1), gameParameters.laser.enemy.lifetime, _t);

                this.rotation.z = _direction;
                this.vector = new THREE.Vector3(2 * -Math.sin(this.rotation.z), 2 * Math.cos(this.rotation.z), 0)
                break;
        }
        this.position.copy(_position);
        this.name = "Laser";
        this.layers.enable(1);
    }

    update(_t) {
        this.position.x += this.vector.x;
        this.position.y += this.vector.y;

        this.checkOutOfScreen();

        if(this.mustDie(_t)) {
            gameCore.removeMesh(this);
        }
    }

    updateSpeed() {
        this.vector = this.direction.multiplyScalar(gameParameters.bullet.speed, gameParameters.bullet.speed, gameParameters.bullet.speed);
    }
}
