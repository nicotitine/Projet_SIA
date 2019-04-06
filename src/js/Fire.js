class Fire extends ResizableMesh {
    constructor(_side) {
        var fireTex = textureLoader.fire.texture;
        var fireMaterial = new THREE.ShaderMaterial({
            defines: THREE.FireShader.defines,
            uniforms: THREE.UniformsUtils.clone(THREE.FireShader.uniforms),
            vertexShader: THREE.FireShader.vertexShader,
            fragmentShader: THREE.FireShader.fragmentShader,
            transparent: true,
            depthWrite: true,
            depthTest: true
        });



        fireTex.magFilter = fireTex.minFilter = THREE.LinearFilter;
        fireTex.wrapS = THREE.wrapT = THREE.ClampToEdgeWrapping;

        fireMaterial.uniforms.fireTex.value = fireTex;
        fireMaterial.uniforms.color.value = new THREE.Color(0xeeeeee);
        fireMaterial.uniforms.invModelMatrix.value = new THREE.Matrix4();
        fireMaterial.uniforms.scale.value = new THREE.Vector3(1, 1, 1);
        fireMaterial.uniforms.seed.value = Math.random() * 19.19;

        super(new THREE.BoxGeometry(1.0, 1.0, 1.0), fireMaterial, new THREE.Vector3(gameParameters.spaceship.fire.scale.x, gameParameters.spaceship.fire.scale.y, gameParameters.spaceship.fire.scale.z));

        this.sides = {
            LEFT: 1,
            RIGHT: 2
        };
        this.side = _side;

        this.material.uniforms.magnitude.value = 3.5;
        this.material.uniforms.lacunarity.value = 0.0;
        this.size = new THREE.Vector3();
        new THREE.Box3().setFromObject(this).getSize(this.size);
        this.name = "Fire";
        this.rotation.z = -Math.PI / 2;
        this.clock = new THREE.Clock();
        this.position.z = -5;
    }

    update(_position, _size, _rotation) {
        this.clock.getDelta();
        var time = this.clock.elapsedTime;
        var invModelMatrix = this.material.uniforms.invModelMatrix.value;
        this.updateMatrix();
        invModelMatrix.getInverse(this.matrix);
        if (time !== undefined) {
            this.material.uniforms.time.value = time;
        }
        this.material.uniforms.invModelMatrix.value = invModelMatrix;
        this.material.uniforms.scale.value = this.scale;

        switch (this.side) {
            case this.sides.LEFT:
                this.position.x = _position.x + 21 * Math.sin(_rotation.y + Math.PI/2) + ((_size.x + this.size.y) / 2 * Math.cos(_rotation.y + Math.PI/2));
                this.position.y = _position.y + 21 * -Math.cos(_rotation.y + Math.PI/2) + ((_size.x + this.size.y) / 2 * Math.sin(_rotation.y + Math.PI/2));
                this.position.z = -5;
                break;
            case this.sides.RIGHT:
                this.position.x = _position.x - 21 * Math.sin(_rotation.y + Math.PI/2) + ((_size.x + this.size.y) / 2 * Math.cos(_rotation.y + Math.PI/2));
                this.position.y = _position.y - 21 * -Math.cos(_rotation.y + Math.PI/2) + ((_size.x + this.size.y) / 2 * Math.sin(_rotation.y + Math.PI/2));
                this.position.z = -5;
                break;
        }

        this.rotation.x = _rotation.x;
        this.rotation.y = _rotation.y + Math.PI/2;
        this.rotation.z = _rotation.z - Math.PI/2;
    }

    // magnitude works upside down. Low magnitude for large fire
    decrease(value) {
        if (this.material.uniforms.magnitude.value < 3.5) {
            this.material.uniforms.magnitude.value += value;
        }
    }

    increase(value) {
        if (this.material.uniforms.magnitude.value > 0) {
            this.material.uniforms.magnitude.value -= value;
        }
    }
};
