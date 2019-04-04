class Shield extends ResizableMesh {
    constructor(_geometry, _material, _scale, _position) {

        super(_geometry, _material, new THREE.Vector3(_scale.x * gameParameters.spaceship.shield.ratio, _scale.x * gameParameters.spaceship.shield.ratio, _scale.x * gameParameters.spaceship.shield.ratio));

        this.position.copy(_position);
        this.isActivated = false;
        this.visible = false;
        this.name = "Shield";
        this.activationTime = 0;
        this.timestamp = 0;
        this.shieldRequested = false;
        if(storage.data.options.glowingEffect) {
            this.layers.set(1);
            this.material.opacity = 0.2;
        } else {
            this.layers.set(0);
            this.material.opacity = 0.4;
        }
    }

    update(_position, _isSpaceshipInvincible) {
        this.rotation.y += 0.02;
        this.rotation.z = gameCore.spaceship.rotation.z;
        this.position.copy(_position);

        if (_isSpaceshipInvincible && !this.isActivated) {
            this.activate(null, false);
        }

        if (this.shieldRequested && !_isSpaceshipInvincible && this.timestamp + this.activationTime < Date.now()) {
            this.shieldRequested = false;
            this.desactivate();
        }
    }

    activate(_time, _isBounce) {
        if (_time != null) {
            this.timestamp = Date.now();
            this.activationTime = _time * 1000;
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
