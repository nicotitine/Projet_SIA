class Laser extends TimelapsMesh {
    constructor(_geometry, _material, _position, _direction, _rotation, _laserType) {

        switch (_laserType) {
            case gameParameters.laser.types.SPACESHIP:

                super(_geometry, _material, new THREE.Vector3(1, 1, 1), gameParameters.laser.spaceship.lifetime);

                this.matrix = new THREE.Matrix4();
                this.matrix.extractRotation(_direction);
                this.direction = new THREE.Vector3(0, 0, 1);
                this.direction.applyMatrix4(this.matrix).normalize();
                this.vector = this.direction.multiplyScalar(gameParameters.laser.spaceship.speed, gameParameters.laser.spaceship.speed, gameParameters.laser.spaceship.speed);
                this.rotation.set(0, 0, _rotation.y);
                break;

            case gameParameters.laser.types.ENEMY:

                super(_geometry, _material, new THREE.Vector3(1, 1, 1), gameParameters.laser.enemy.lifetime);

                this.rotation.z = _direction;
                this.vector = new THREE.Vector3(2 * -Math.sin(this.rotation.z), 2 * Math.cos(this.rotation.z), 0)
                break;
        }

        this.position.copy(_position);
        this.name = "Laser";
        this.layers.enable(1);
    }

    update() {
        this.position.x += this.vector.x;
        this.position.y += this.vector.y;

        // Check if out of screen
        this.checkOutOfScreen();

        if(this.mustDie()) {
            gameCore.removeMesh(this);
        }
    }

    updateSpeed() {
        this.vector = this.direction.multiplyScalar(gameParameters.bullet.speed, gameParameters.bullet.speed, gameParameters.bullet.speed);
    }
}
