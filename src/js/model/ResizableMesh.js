class ResizableMesh extends THREE.Mesh {
    constructor(_geometry, _material, _scale) {

        super(_geometry, _material);

        this.scale.copy(_scale);
        this.geometry.center();
        this.geometry.computeBoundingSphere();
        this.radius = this.geometry.boundingSphere.radius * this.scale.x;
    }

    resize(_valueX, _valueY, _valueZ) {
        let oldRotation = this.rotation.clone();
        if(this.name == "Spaceship") {
            this.rotation.set(Math.PI/2, 0, 0);
        }
        if(this.name == "Fire") {
            this.rotation.set(0, 0, 0)
        }
        this.scale.set(_valueX, _valueY, _valueZ);
        this.size = new THREE.Vector3();
        new THREE.Box3().setFromObject(this).getSize(this.size);
        this.geometry.center();
        this.geometry.computeBoundingSphere();
        this.radius = this.geometry.boundingSphere.radius * this.scale.x;
        this.geometry.verticesNeedsUpdate = true;
        this.rotation.copy(oldRotation);

        if (this.name == "Spaceship") {
            this.fireLeft.resize(_valueX * 125, _valueY * 375, _valueZ * 150);
            this.fireRight.resize(_valueX * 125, _valueY * 375, _valueZ * 150);
            this.shield.resize(this.size.x * gameParameters.spaceship.shield.ratio, this.size.x * gameParameters.spaceship.shield.ratio, this.size.x * gameParameters.spaceship.shield.ratio);
            gameParameters.spaceship.scale = _valueX;
        }
    }
}
