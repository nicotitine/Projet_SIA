class Spaceman extends THREE.Group {
    constructor(type) {

        super();

        this.type = type;

        var spacemanModel = textureLoader.getSpaceman().texture;
        var spacemanBoxModel = textureLoader.getSpacemanBox().texture;

        var spacemanGeometry = new THREE.BoxGeometry(84, 48, 19);
        var spacemanBoxGeometry = new THREE.BoxGeometry(26, 26, 20);

        var spacemanMaterials = [
            new THREE.MeshBasicMaterial({visible: false, transparent: true}),
            new THREE.MeshBasicMaterial({visible: false, transparent: true}),
            new THREE.MeshBasicMaterial({visible: false, transparent: true}),
            new THREE.MeshBasicMaterial({visible: false, transparent: true}),
            new THREE.MeshBasicMaterial({map: spacemanModel[0], transparent: true, side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({visible: false, transparent: true})
        ];

        var spacemanBoxMaterials = [
            new THREE.MeshBasicMaterial({visible: false}),
            new THREE.MeshBasicMaterial({visible: false}),
            new THREE.MeshBasicMaterial({visible: false}),
            new THREE.MeshBasicMaterial({visible: false}),
            new THREE.MeshBasicMaterial({map: spacemanBoxModel[type], transparent: true, side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({visible: false})
        ]

        this.spaceman = new THREE.Mesh(spacemanGeometry, spacemanMaterials);
        this.spacemanBox = new THREE.Mesh(spacemanBoxGeometry, spacemanBoxMaterials);
        this.spacemanBox.position.y += 28;

        this.index = 0;
        this.texture = spacemanModel;

        this.direction = new THREE.Vector3(GameParameters.getRandom(1), GameParameters.getRandom(1), 0);

        if(this.direction.x > 0) {
            this.rotation.z = new THREE.Vector2(this.direction.x, this.direction.y).angle();
            this.scale.x = -1;
        } else {
            this.rotation.z = new THREE.Vector2(this.direction.x, this.direction.y).angle() + Math.PI;
        }

        var oldDirection = this.direction.clone();

        this.speedMaxVector = this.direction.multiplyScalar(gameParameters.jokers.spaceman.speedMax, gameParameters.jokers.spaceman.speedMax, 0);
        this.speedMinVector = oldDirection.multiplyScalar(gameParameters.jokers.spaceman.speedMin, gameParameters.jokers.spaceman.speedMin, 0);

        this.add(this.spaceman);
        this.add(this.spacemanBox);

        console.log(this.speedMaxVector, this.speedMinVector);
    }

    update() {
        this.updateMatrixWorld();
        this.boxPosition = new THREE.Vector3();
        this.boxPosition.setFromMatrixPosition(this.spacemanBox.matrixWorld);

        this.index = (this.index + 1) % (this.texture.length - 1);
        // Front face texture is change for the next image
        this.spaceman.material[4].map = this.texture[this.index];
        if(this.index > 18 && this.index < 31) {
            this.position.x += this.speedMaxVector.x;
            this.position.y += this.speedMaxVector.y;
        } else {
            console.log("elsej");
            this.position.x += this.speedMinVector.x;
            this.position.y += this.speedMinVector.y;
        }

        if(Math.abs(this.position.x) > gameCore.cameraHandler.size.x / 2) {
            this.position.x = -this.position.x;
        }
        if(Math.abs(this.position.y) > gameCore.cameraHandler.size.y / 2) {
            this.position.y = -this.position.y;
        }
    }
}
