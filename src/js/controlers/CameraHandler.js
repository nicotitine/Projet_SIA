class CameraHandler {
    constructor() {

        this.cameraTypes = {
            FIXED: 0,
            MOVING: 1,
            PURSUIT: 2
        };

        this.cameraType = this.cameraTypes.FIXED;
        this.frustum = new THREE.Frustum();

        this.cameraViewProjectionMatrix = new THREE.Matrix4();
        this.camera = new THREE.PerspectiveCamera(50, _viewport.ratio, 0.1, 1000);
        this.camera.position.set(0, 0, 500);
        this.camera.layers.enable(1);
        this.camera.far = 10000;
        this.isCameraChanged = false;

        this.light = new THREE.AmbientLight(0xffffff, 3);
        this.light.position.set(0, 0, 500);

        this.isPursuitCamera = false;

      
        this.currentTime = 0;
        this.clock = new THREE.Clock();

        this.size = {
            x: 0,
            y: 0
        }
        this.getCameraSize();

        this.lightningBox = new LightningBox(this.size);
    }

    update(_position) {
        this.currentTime += this.clock.getDelta();

		this.lightningBox.update( this.currentTime );
        this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);
        this.cameraViewProjectionMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
        this.frustum.setFromMatrix(this.cameraViewProjectionMatrix);

        switch (this.cameraType) {
            case this.cameraTypes.MOVING:
                this.camera.position.x = gameCore.spaceship.position.x;
                this.camera.position.y = gameCore.spaceship.position.y;
                break;
            case this.cameraTypes.PURSUIT:
                gameCore.jokerHandler.jokers.forEach(function(_joker) {

                })
                this.camera.updateProjectionMatrix();
                gameCore.spaceship.bonusTimer.rotation.copy(gameCore.spaceship.rotation)
                var matrix = new THREE.Matrix4();
                matrix.extractRotation(gameCore.spaceship.matrix);
                var direction = new THREE.Vector3(0, -1, 1);
                direction = direction.applyMatrix4(matrix);
                gameCore.spaceship.shield.rotation.x = Math.PI / 2;
                this.camera.rotation.y = gameCore.spaceship.rotation.y + Math.PI;
                this.camera.position.set(gameCore.spaceship.position.x + direction.x * (-200) , gameCore.spaceship.position.y + direction.y * -200 , 50);
                break;
        }
    }

    resize(_ratio) {
        this.camera.aspect = _ratio;
        this.camera.updateProjectionMatrix();
        this.getCameraSize();
        this.lightningBox.resize(this.size);
    }

    changeToFixed() {
        this.changeToTop();

        this.isPursuitCamera = false;
        this.camera.position.set(0, 0, 500);
        this.camera.rotation.set(0, 0, 0);
        gameCore.spaceship.shield.rotation.x = 0;
    }

    changeToMoving() {
        this.changeToTop();

        this.isPursuitCamera = false;
        gameCore.spaceship.shield.rotation.x = 0;
        this.camera.position.set(gameCore.spaceship.position.x, gameCore.spaceship.position.y, 500);
        this.camera.rotation.set(0, 0, 0);
    }

    changeToTop() {
        gameCore.enemyHandler.enemies.forEach(function(_enemy) {
            _enemy.rotation.x = 0;
        });
        gameCore.jokerHandler.jokers.forEach(function(_joker) {
            _joker.rotation.x = 0;
            _joker.spaceman.visible = true;
            _joker.spacemanBox.position.y = 28;
        });
    }

    changeToPursuit() {
        this.cameraType = this.cameraTypes.PURSUIT;
        this.camera.rotation.x = Math.PI/2;
        gameCore.jokerHandler.jokers.forEach(function(_joker) {
            _joker.rotation.x = Math.PI / 2;
            _joker.spaceman.visible = false;
            _joker.spacemanBox.position.y = 0;
        });
        gameCore.enemyHandler.enemies.forEach(function(_enemy) {
            _enemy.rotation.x = Math.PI/2;
        })
        gameCore.scene.remove(gameCore.starfield);
        gameCore.starfield = new Starfield(gameParameters.starfield.number, gameParameters.starfield.spread);
        gameCore.scene.add(gameCore.starfield);
        this.isPursuitCamera = true;

    }

    getCameraSize() {
        // Set up the width and height of the camera fov at z = 0
        this.size.y = Math.tan(this.camera.fov * Math.PI / 180 * 0.5) * this.camera.position.z * 2;
        this.size.x = this.size.y * _viewport.ratio;
    }
}
