class Shield extends ResizableObject {
    constructor(scale, position) {
        var texture = textureLoader.getShield().texture;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            depthTest: true
        });
        material.opacity = 0.2;
        super(geometry, material);
        this.position.copy(position);
        this.isActivated = false;
        this.visible = false;
        this.name = "Shield";
        this.scale.set(scale.x / gameParameters.spaceship.shield.ratio, scale.x / gameParameters.spaceship.shield.ratio, scale.x / gameParameters.spaceship.shield.ratio);
        this.activationTime = 0;
        this.timestamp = 0;
        this.shieldRequested = false;
    }

    update(position, isSpaceshipInvincible) {
        this.rotation.y += 0.02;
        this.rotation.z = gameCore.spaceship.rotation.z;
        this.position.copy(position);

        if (isSpaceshipInvincible && !this.isActivated) {
            this.activate(null, false);
        }

        if (this.shieldRequested && !isSpaceshipInvincible && this.timestamp + this.activationTime < Date.now()) {
            this.shieldRequested = false;
            this.desactivate();
        }
    }

    activate(time, isBounce) {
        if (time != null) {
            this.timestamp = Date.now();
            this.activationTime = time * 1000;
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
