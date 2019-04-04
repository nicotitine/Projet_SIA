class Spaceman extends THREE.Group {
    constructor(_type, _cameraSize) {

        super();

        this.type = _type;

        var spacemanModel = textureLoader.spaceman.texture;
        var spacemanBoxModel = textureLoader.spacemanBox.texture;

        var spacemanGeometry = new THREE.BoxGeometry(84, 48, 0);
        var spacemanBoxGeometry = new THREE.BoxGeometry(20, 20, 20);

        var spacemanMaterials = [
            new THREE.MeshBasicMaterial({
                visible: false,
                transparent: true,
                depthTest: false,
                depthWrite: false
            }),
            new THREE.MeshBasicMaterial({
                visible: false,
                transparent: true,
                depthTest: false,
                depthWrite: false
            }),
            new THREE.MeshBasicMaterial({
                visible: false,
                transparent: true,
                depthTest: false,
                depthWrite: false
            }),
            new THREE.MeshBasicMaterial({
                visible: false,
                transparent: true,
                depthTest: false,
                depthWrite: false
            }),
            new THREE.MeshBasicMaterial({
                map: spacemanModel[0],
                transparent: true,
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                visible: false,
                transparent: false,
                depthTest: false,
                depthWrite: false
            })
        ];

        var spacemanBoxMaterials = [
            new THREE.MeshBasicMaterial({
                map: spacemanBoxModel[_type],
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: spacemanBoxModel[_type],
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: spacemanBoxModel[3],
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: spacemanBoxModel[3],
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: spacemanBoxModel[_type],
                side: THREE.DoubleSide
            }),
            new THREE.MeshBasicMaterial({
                map: spacemanBoxModel[_type],
                side: THREE.DoubleSide
            })
        ];

        this.spaceman = new THREE.Mesh(spacemanGeometry, spacemanMaterials);
        this.spacemanBox = new THREE.Mesh(spacemanBoxGeometry, spacemanBoxMaterials);
        this.spacemanBox.position.y += 28;

        this.borders = {
            TOP: 1,
            RIGHT: 2,
            BOTTOM: 3,
            LEFT: 4
        }

        this.borderToSpawn = GameParameters.getRandomInt(this.borders.TOP, this.borders.LEFT)
        switch (this.borderToSpawn) {
            case this.borders.TOP:
                this.position.set(GameParameters.getRandom(_cameraSize.x/2), _cameraSize.y/2, 0)
                break;
            case this.borders.RIGHT:
                this.position.set(_cameraSize.x/2, GameParameters.getRandom(_cameraSize.y/2), 0)
                break;
            case this.borders.BOTTOM:
            this.position.set(GameParameters.getRandom(_cameraSize.x/2), -_cameraSize.y/2, 0)
            break;
            case this.borders.LEFT:
                this.position.set(-_cameraSize.x/2, GameParameters.getRandom(_cameraSize.y/2), 0)
                break;
        }

        this.index = 0;
        this.texture = spacemanModel;

        this.direction = new THREE.Vector3(GameParameters.getRandom(1), GameParameters.getRandom(1), 0);

        if (this.direction.x > 0) {
            this.rotation.z = new THREE.Vector2(this.direction.x, this.direction.y).angle();
            this.scale.x = -1;
        } else {
            this.rotation.z = new THREE.Vector2(this.direction.x, this.direction.y).angle() + Math.PI;
        }

        var oldDirection = this.direction.clone();

        this.speedMaxVector = this.direction.multiplyScalar(gameParameters.jokers.spaceman.speedMax, gameParameters.jokers.spaceman.speedMax, 0);
        this.speedMinVector = oldDirection.multiplyScalar(gameParameters.jokers.spaceman.speedMin, gameParameters.jokers.spaceman.speedMin, 0);

        this.spaceman.layers.set(0);
        this.spacemanBox.layers.set(0);
        this.layers.set(0);
        
        this.add(this.spaceman);
        this.add(this.spacemanBox);
    }

    update() {
        this.updateMatrixWorld();
        this.boxPosition = new THREE.Vector3();
        this.boxPosition.setFromMatrixPosition(this.spacemanBox.matrixWorld);
        this.spacemanBox.rotation.y += 0.05;

        this.index = (this.index + 1) % (this.texture.length - 1);
        // Front face texture is change for the next image
        this.spaceman.material[4].map = this.texture[this.index];
        if (this.index > 18 && this.index < 31) {
            this.position.x += this.speedMaxVector.x;
            this.position.y += this.speedMaxVector.y;
        } else {
            this.position.x += this.speedMinVector.x;
            this.position.y += this.speedMinVector.y;
        }

        if (Math.abs(this.position.x) > gameCore.cameraHandler.size.x / 2) {
            this.position.x = -this.position.x;
        }
        if (Math.abs(this.position.y) > gameCore.cameraHandler.size.y / 2) {
            this.position.y = -this.position.y;
        }
    }
}
