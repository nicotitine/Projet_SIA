class ResizableObject extends THREE.Mesh{
    constructor(geometry, material) {
        super(geometry, material)
    }

    resize(newValueX, newValueY, newValueZ) {
        this.scale.set(newValueX, newValueY, newValueZ);
        this.size = new THREE.Vector3();
        new THREE.Box3().setFromObject(this).getSize(this.size);

        if(this.name == "Spaceship") {
            this.fire.resize(newValueX * 50, newValueY * 200, newValueZ * 100);
            this.shield.resize(this.size.x / gameParameters.spaceship.shield.ratio, this.size.x / gameParameters.spaceship.shield.ratio, this.size.x / gameParameters.spaceship.shield.ratio);
            gameParameters.spaceship.scale = newValueX;
        }
    }
}
