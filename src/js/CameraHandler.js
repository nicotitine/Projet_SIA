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
        this.ambient = new THREE.AmbientLight(0xffffff);
        this.light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI);
        this.light.position.set(0, 0, 500);
        this.light.target.position.set(0, 0, 0);
        this.camera.position.z = 500;
        this.isCameraChanged = false;
        this.size = {
            x: 0,
            y: 0
        }

        this.getCameraSize();
    }

    update() {
        this.camera.updateMatrixWorld();
        this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);
        this.cameraViewProjectionMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
        this.frustum.setFromMatrix(this.cameraViewProjectionMatrix);
        this.light.position.copy(this.camera.position)
        switch (this.cameraType) {
            case this.cameraTypes.FIXED:
            break;
            case this.cameraTypes.MOVING:
                this.camera.position.x = gameCore.spaceship.position.x;
                this.camera.position.y = gameCore.spaceship.position.y;
            break;
            case this.cameraTypes.PURSUIT:
                this.light.target.position.copy(this.camera.position);
                this.camera.far = 10000;
                this.camera.updateProjectionMatrix();

                var matrix = new THREE.Matrix4();
                matrix.extractRotation( gameCore.spaceship.matrix );

                var direction = new THREE.Vector3( -1, 0, 0 );
                direction = direction.applyMatrix4( matrix );
                this.camera.rotation.y = gameCore.spaceship.rotation.y + Math.PI / 2;

                // ####### MAY WORK ######
                this.camera.rotation.x = Math.PI/2;
                this.camera.position.set(gameCore.spaceship.position.x + direction.x * (-200), gameCore.spaceship.position.y + direction.y * (-200), 50);
                // #######################
            break;
            default:

        }
    }

    resize() {
        this.camera.aspect = _viewport.ratio;
        this.camera.updateProjectionMatrix();
    }

    changeToFixed() {
        this.camera.position.set(0, 0, 500);
        this.camera.rotation.set(0, 0, 0);
        gameCore.spaceship.shield.rotation.x = 0;
    }

    changeToMoving() {
        gameCore.spaceship.shield.rotation.x = 0;
        this.camera.position.set(gameCore.spaceship.position.x, gameCore.spaceship.position.y, 500);
        this.camera.rotation.set(0, 0, 0);
    }

    changeToPursuit() {
        gameCore.spaceship.shield.rotation.x = Math.PI/2;
        this.cameraType = this.cameraTypes.PURSUIT;
        gameCore.jokers.jokers.forEach(function(joker) {
            joker.rotation.x = Math.PI/2;
        });
    }

    getCameraSize() {
        // Set up the width and height of the camera fov at z = 0
        this.size.y = Math.tan(this.camera.fov * Math.PI / 180 * 0.5) * this.camera.position.z * 2;
        this.size.x = this.size.y * _viewport.ratio;
        var geometry = new THREE.BoxBufferGeometry(this.size.x, this.size.y, 50);
        var edges = new THREE.EdgesGeometry( geometry );
        this.limitLines = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    }
}
