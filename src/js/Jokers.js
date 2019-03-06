class Jokers {
    constructor() {
        this.jokers = [];
        this.lifetime = 10000;
        this.spawntime = 1000;
        this.timestamp = Date.now();
        this.types = {
            SHIELD: 1,
            LIFE: 2,
            DEMATERIALIZE: 3,
            RAPID_FIRE: 4,
        }
    }

    spawn() {
        this.timestamp = Date.now();
        var geometry = new THREE.CircleGeometry( 10, 32 );
        var texture;
        var joker = new THREE.Mesh();

        joker.type = THREE.Math.randInt(1, 5);
        switch (joker.type) {
            case this.types.SHIELD:
                texture = new THREE.TextureLoader().load("src/medias/models/shield-icon.png");
            break;
            case this.types.LIFE:
                texture = new THREE.TextureLoader().load('src/medias/models/life-icon.png');
            break;
            case this.types.RAPID_FIRE :
                texture = new THREE.TextureLoader().load('src/medias/models/fire-icon.png');
            break;
            case this.types.DEMATERIALIZE :
                texture = new THREE.TextureLoader().load('src/medias/models/through-icon.png');
            break;
            default:
        }

        var material = new THREE.MeshBasicMaterial({map: texture});
        joker.geometry = geometry;
        joker.material = material;
        joker.spawntime = Date.now();
        joker.position.set(GameParameters.getRandom(cameraHandler.size.x), GameParameters.getRandom(cameraHandler.size.y), 0);
        joker.lookAt(cameraHandler.camera.position);
        if(cameraHandler.cameraType == cameraHandler.cameraTypes.PURSUIT)
            joker.rotation.z = -Math.PI/2;

        this.jokers.push(joker);
        scene.add(joker);
        var _this = this;
        setTimeout(function() {
            scene.remove(joker);
            _this.jokers[_this.jokers.indexOf(joker)] = null;
            _this.jokers = _this.jokers.filter(function (el) {
                return el != null;
            });
        },this.lifetime);
    }

    update() {
        var spaceshipBox = new THREE.Box3().setFromObject(_spaceship);

        if(this.timestamp + this.spawntime < Date.now() && gameUI.isGameLaunched && !gameUI.isPaused) {
            this.spawn();
        } else if(!gameUI.isGameLaunched || gameUI.isPaused) {
            this.timestamp = Date.now();
        }
        this.jokers.forEach(function(joker) {
            var jokerBox = new THREE.Box3().setFromObject(joker);

            if(jokerBox.intersectsBox(spaceshipBox)) {
                console.log("joker taken !");
            }

            if(cameraHandler.cameraType == cameraHandler.cameraTypes.PURSUIT) {
                joker.lookAt(cameraHandler.camera.position.x, cameraHandler.camera.position.y, 0);
                if(joker.rotation.x < 0)
                    joker.rotation.z = Math.PI;
                else
                    joker.rotation.z = 0;


            } else {
                joker.lookAt(cameraHandler.camera.position)
            }
        })
    }
}
