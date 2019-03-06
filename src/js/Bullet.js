class Bullet extends THREE.Object3D {
    constructor(model, spaceship, scale, speed) {
        super();
        this.add(model);
        this.matrix = new THREE.Matrix4();
        this.matrix.extractRotation(spaceship.matrix);
        this.rotation.set(this.matrix);
        this.direction = new THREE.Vector3(-1, 0, 0);
        this.direction.applyMatrix4(this.matrix).normalize();
        this.position.set(spaceship.position.x, spaceship.position.y, -15);
        this.scale.set(scale, scale, scale);
        this.rotation.set(spaceship.rotation.x, spaceship.rotation.y, spaceship.rotation.z);
        this.vector = this.direction.multiplyScalar(speed, speed, speed);
        this.size = new THREE.Vector3();
        new THREE.Box3().setFromObject(this).getSize(this.size);
        this.spawnTime = Date.now();
        this.name = "Bullet";
    }

    update() {
        this.position.x += this.vector.x;
        this.position.y += this.vector.y;
        if(Math.abs(this.position.x) > cameraHandler.size.x / 2) {
            this.position.x = -this.position.x;
        }
        if(Math.abs(this.position.y) > cameraHandler.size.y / 2) {
            this.position.y = -this.position.y;
        }
    }
}
