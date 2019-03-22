class Fire extends ResizableObject {
    constructor(scale) {
        var fireTex = textureLoader.getFire().texture;
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

        super(new THREE.BoxGeometry(1.0, 1.0, 1.0), fireMaterial);

        this.geometry.computeBoundingBox();
        this.scale.set(scale.x, scale.y, scale.z);
        this.material.uniforms.magnitude.value = 3.5;
        this.material.uniforms.lacunarity.value = 0.0;
        this.size = new THREE.Vector3();
        new THREE.Box3().setFromObject(this).getSize(this.size);
        this.name = "Fire";
        this.rotation.z = -Math.PI / 2;
        this.clock = new THREE.Clock();
    }

    update(position, size, rotation) {
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

        this.position.x = position.x + ((size.x + this.size.y) / 2 * Math.cos(rotation.y));
        this.position.y = position.y + ((size.x + this.size.y) / 2 * Math.sin(rotation.y));
        this.rotation.x = rotation.x;
        this.rotation.y = rotation.y;
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
