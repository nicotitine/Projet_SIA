class Shield extends ResizableMesh {
    constructor(_geometry, _material, _scale, _position, _t) {

        super(_geometry, _material, new THREE.Vector3(_scale.x * gameParameters.spaceship.shield.ratio, _scale.x * gameParameters.spaceship.shield.ratio, _scale.x * gameParameters.spaceship.shield.ratio));

        this.position.copy(_position);
        this.isActivated = false;
        this.visible = false;
        this.name = "Shield";
        this.activationTime = 0;
        this.timestamp = _t;
        this.shieldRequested = false;
        this.material.opacity = 0.2;
        this.material.depthTest = false;
        this.size = new THREE.Vector3();
        new THREE.Box3().setFromObject(this).getSize(this.size);
        if(storageHandler.data.options.glowingEffect) {
            this.layers.enable(1);
        } else {
            this.layers.set(0);
        }
    }

    update(_position, _isSpaceshipInvincible, _t) {
        this.rotation.y += 0.02;
        this.rotation.z = gameCore.spaceship.rotation.z;
        this.position.copy(_position);

        if (_isSpaceshipInvincible && !this.isActivated) {
            this.activate(null, false);
        }

        if (this.shieldRequested && !_isSpaceshipInvincible && this.timestamp + this.activationTime < _t) {
            this.shieldRequested = false;
            this.desactivate();
        }
    }

    activate(_time, _t) {
        if (_time != null) {
            this.timestamp = _t;
            this.activationTime = _time;
            this.shieldRequested = true;
        }
        this.visible = true;
        this.isActivated = true;
    }

    desactivate() {
        this.visible = false;
        this.isActivated = false;
    }
}
