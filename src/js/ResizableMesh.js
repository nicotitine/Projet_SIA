class ResizableMesh extends THREE.Mesh {
    constructor(_geometry, _material, _scale) {

        super(_geometry, _material);

        this.scale.copy(_scale);
        this.geometry.center();
        this.geometry.computeBoundingSphere();
        this.radius = this.geometry.boundingSphere.radius * this.scale.x;
    }

    resize(_valueX, _valueY, _valueZ) {

        this.scale.set(_valueX, _valueY, _valueZ);
        this.geometry.center();
        this.geometry.computeBoundingSphere();
        this.radius = this.geometry.boundingSphere.radius * this.scale.x;

        this.size = new THREE.Vector3();
        new THREE.Box3().setFromObject(this).getSize(this.size);
        
        if (this.name == "Spaceship") {
            this.fire.resize(_valueX * 50, _valueY * 200, _valueZ * 100);
            this.shield.layers.enable(0);
            this.shield.resize(this.size.x * gameParameters.spaceship.shield.ratio, this.size.x * gameParameters.spaceship.shield.ratio, this.size.x * gameParameters.spaceship.shield.ratio);
            this.shield.layers.enable(1);
            gameParameters.spaceship.scale = _valueX;
        }
    }
}
