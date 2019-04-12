class Laser extends TimelapsMesh {
    constructor(_geometry, _material, _position, _direction, _rotation, _laserType, _t) {

        switch (_laserType) {
            case gameParameters.laser.types.SPACESHIP:

                super(_geometry, _material, new THREE.Vector3(gameParameters.laser.spaceship.scale, gameParameters.laser.spaceship.scale, gameParameters.laser.spaceship.scale), gameParameters.laser.spaceship.lifetime, _t);

                this.rotation.z = _direction + Math.PI;
                this.vector = new THREE.Vector3(gameParameters.laser.spaceship.speed * - Math.sin(this.rotation.z), gameParameters.laser.spaceship.speed * Math.cos(this.rotation.z), 0)
                break;

            case gameParameters.laser.types.ENEMY:

                super(_geometry, _material, new THREE.Vector3(gameParameters.laser.enemy.scale, gameParameters.laser.enemy.scale, gameParameters.laser.enemy.scale), gameParameters.laser.enemy.lifetime, _t);
                
                this.rotation.z = _direction;
                this.vector = new THREE.Vector3(gameParameters.laser.enemy.speed * -Math.sin(this.rotation.z), gameParameters.laser.enemy.speed * Math.cos(this.rotation.z), 0)
                break;
        }
        this.type = _laserType;
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
}
