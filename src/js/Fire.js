class Fire {
    constructor(scene, scale, callback) {
        var _this = this;
        this.clock = new THREE.Clock();
        var fireLoader = new THREE.TextureLoader().load("src/medias/models/index.png", function(fireTex) {
            var wireframeMat = new THREE.MeshBasicMaterial({
                color : new THREE.Color(0xffffff),
                wireframe : true
            });
            _this.fire = new THREE.Fire(fireTex);
            _this.fire.geometry.computeBoundingBox();
            _this.fire.scale.copy(scale);
            _this.fire.position.z = 10;
            _this.fire.material.uniforms.magnitude.value = 3.5;
            _this.fire.material.uniforms.lacunarity.value = 0.0;
            _this.fire.size = new THREE.Vector3();
            new THREE.Box3().setFromObject(_this.fire).getSize(_this.fire.size);
            _this.fire.name = "Fire";
            _this.fire.rotation.z = -Math.PI / 2;
            _this.clock = new THREE.Clock();
            console.log(_this.fire);
            callback(_this.fire);

        });
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
