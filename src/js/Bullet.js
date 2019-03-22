class Bullet extends ResizableObject {
    constructor(position, direction, rotation) {
        var model = textureLoader.getBullet();

        super(model.geometry, model.material);

        // Direction handling (this.vector is the final direction)
        this.matrix = new THREE.Matrix4();
        this.matrix.extractRotation(direction);
        this.rotation.set(this.matrix);
        this.direction = new THREE.Vector3(-1, 0, 0);
        this.direction.applyMatrix4(this.matrix).normalize();
        this.vector = this.direction.multiplyScalar(gameParameters.bullet.speed, gameParameters.bullet.speed, gameParameters.bullet.speed);
        // Position, scale and rotation handling
        this.scale.set(gameParameters.bullet.scale, gameParameters.bullet.scale, gameParameters.bullet.scale);
        this.geometry.center();
        this.rotation.set(rotation.x, rotation.y, rotation.z);
        this.position.copy(position);
        // Additional usefull variables
        this.size = new THREE.Vector3();
        this.intersectBox = new THREE.Box3().setFromObject(this);
        this.intersectBox.getSize(this.size);
        this.spawnTime = Date.now();
        this.name = "Bullet";
        this.geometry.computeBoundingBox();
    }

    update() {
        this.position.x += this.vector.x;
        this.position.y += this.vector.y;

        // Check if out of screen
        if (Math.abs(this.position.x) > gameCore.cameraHandler.size.x / 2) {
            this.position.x = -this.position.x;
        }
        if (Math.abs(this.position.y) > gameCore.cameraHandler.size.y / 2) {
            this.position.y = -this.position.y;
        }
    }

    updateSpeed() {
        this.vector = this.direction.multiplyScalar(gameParameters.bullet.speed, gameParameters.bullet.speed, gameParameters.bullet.speed);
    }
}
