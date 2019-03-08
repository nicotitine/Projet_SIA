class Jokers {
    constructor() {
        this.jokers = [];
        this.lifetime = 10000;
        this.spawntime = 20000;
        this.timestamp = Date.now();
        this.types = {
            SHIELD: 1,
            LIFE: 2,
            RAPID_FIRE: 3,
            DEMATERIALIZE: 4
        }
        this.textures = {
            shield: new THREE.TextureLoader().load("src/medias/models/shield-icon.png"),
            life: new THREE.TextureLoader().load('src/medias/models/life-icon.png'),
            fire: new THREE.TextureLoader().load('src/medias/models/fire-icon.png'),
            dematerialize: new THREE.TextureLoader().load('src/medias/models/through-icon.png'),
            length: 4
        }
    }

    spawn() {
        this.timestamp = Date.now();
        var geometry = new THREE.CircleGeometry( 10, 32 );
        var texture;
        var joker = new THREE.Mesh();

        joker.type = THREE.Math.randInt(1, this.textures.length);
        switch (joker.type) {
            case this.types.SHIELD:
                texture = this.textures.shield;
            break;
            case this.types.LIFE:
                texture = this.textures.life;
            break;
            case this.types.RAPID_FIRE :
                texture = this.textures.fire;
            break;
            case this.types.DEMATERIALIZE :
                texture = this.textures.dematerialize;
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
        var _this = this;
        this.jokers.forEach(function(joker) {
            var jokerBox = new THREE.Box3().setFromObject(joker);
            if(jokerBox.intersectsBox(spaceshipBox)) {
                switch (joker.type) {
                    case 1:
                        _spaceship.shield.activate(10, true);
                    break;
                    case 2:
                        _spaceship.addLife();
                    break;
                    case 3:
                        console.log("fire");
                    break;
                    case 4:
                        _spaceship.shield.activate(10);
                    break;
                    default:

                }
                scene.remove(joker);
                _this.jokers[_this.jokers.indexOf(joker)] = null;
                _this.jokers = _this.jokers.filter(function (el) {
                    return el != null;
                });
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
