class Fire {
    constructor(scale) {
        this.textureLoader = new THREE.TextureLoader().load('src/medias/models/index.png', firetex => {
            var wireframeMat = new THREE.MeshBasicMaterial({
                color : new THREE.Color(0xffffff),
                wireframe : true
            });
            this.fire = new THREE.Fire(firetex);
            this.fire.geometry.computeBoundingBox();
            this.fire.scale.copy(scale);
            this.fire.position.z = 10;
            this.fire.material.uniforms.magnitude.value = 3.5;
            this.fire.material.uniforms.lacunarity.value = 0.0;
            this.fire.size = new THREE.Vector3();
            new THREE.Box3().setFromObject(this.fire).getSize(this.fire.size);
            this.fire.name = "Fire";
            this.fire.rotation.z = -Math.PI / 2;
            this.clock = new THREE.Clock();
            scene.add(this.fire);
        })
        this.clock = new THREE.Clock();
    }

    update(position, size, rotation) {
        if(this.fire != null && size != null) {
            this.clock.getDelta();
            var t = this.clock.elapsedTime;
            this.fire.update(t);
            this.fire.position.x = position.x + ((size.x + this.fire.size.y) / 2 * Math.cos(rotation.y));
            this.fire.position.y = position.y + ((size.x + this.fire.size.y) / 2 * Math.sin(rotation.y));
            this.fire.rotation.x = rotation.x;
            this.fire.rotation.y = rotation.y;
        }
    }
};
