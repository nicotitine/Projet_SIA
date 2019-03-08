class Asteroid extends THREE.Mesh {
    constructor(spreadX, maxWidth, maxHeight, maxDepth, position, level) {
        var geometry;
        var color = '#ffffff';
        var texture;
        var size = 0;


        switch (level) {
            case 1:
                size = _gameParameters.asteroidMinSize;
            break;
            case 2:
                size = _gameParameters.asteroidMidleSize;
            break;
            case 3:
                size = _gameParameters.asteroidMaxSize;
            break;
            default:
                size = _gameParameters.asteroidMaxSize;
        }

        geometry = new THREE.DodecahedronGeometry(size, 1);
        geometry.vertices.forEach(function(v) {
            v.x += (0 - Math.random() * (size/4));
            v.y += (0 - Math.random() * (size/4));
            v.z += (0 - Math.random() * (size/4));
        });

        texture = new THREE.MeshStandardMaterial();

        super(geometry, texture);

        color = this.colorLuminance(color, 2 + Math.random() * 10);
        this.material = new THREE.MeshStandardMaterial({
            color: color,
            flatShading: true,
            roughness: 0.8,
            metalness: 1
        });

        this.castShadow = true;
        this.receiveShadow = true;
        this.scale.set(1, 1, 1);
        this.level = level;

        var x = spreadX / 2 - Math.random() * spreadX;
        var centeredness = 1 - (Math.abs(x) / (maxWidth / 2));
        var y = (maxHeight / 2 - Math.random() * maxHeight) * centeredness;
        var z = 0;

        if(position == null) {
            this.position.set(x, y, z);
        } else {
            this.position.copy(position);
        }

        this.r = {};
        this.r.x = Math.random() * 0.005;
        this.r.y = Math.random() * 0.005;
        this.r.z = Math.random() * 0.005;

        this.size =  new THREE.Vector3();
        this.box = new THREE.Box3().setFromObject(this);
        this.box.getSize(this.size);

        this.name = "Asteroid";

        this.direction = new THREE.Vector3(GameParameters.getRandom(1), GameParameters.getRandom(1), 0);
        this.vector = this.direction.multiplyScalar(_gameParameters.asteroidSpeed, _gameParameters.asteroidSpeed, 0);

        this.timestamp = Date.now();
        this.geometry.computeBoundingBox();

        this.intersectBox = new THREE.Box3().setFromObject(this);

        scene.add(this)
    }

    colorLuminance(hex, lum) {
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;
        var rgb = "#", c, i;
        for (var i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }
        return rgb;
    }

    collide(position) {

    }

    update() {
        this.intersectBox = new THREE.Box3().setFromObject(this);

        // Update position
        if(gameUI != null && (!gameUI.isPaused || gameUI.isWelcomeDisplayed)) {
            this.position.x += this.vector.x;
            this.position.y += this.vector.y;
        }

        this.rotation.x += _gameParameters.asteroidRotation;
        this.rotation.y += _gameParameters.asteroidRotation;

        // Check if out of screen
        if(Math.abs(this.position.x) > cameraHandler.size.x / 2) {
            this.position.x = -this.position.x;
        }
        if(Math.abs(this.position.y) > cameraHandler.size.y / 2) {
            this.position.y = -this.position.y;
        }

        // Collision detection
        if(gameUI!= null && gameUI.isGameLaunched && !_spaceship.shield.isOn && this.intersectBox.intersectsBox(_spaceship.getBox())) {
            _spaceship.hitted();
        }

        //if(gameUI != null && gameUI.isGameLaunched && spaceship.shield.isOn && )




        this.checkBullets();

    }


    checkBullets() {
        let _this = this;
        _spaceship.bullets.forEach(function(bullet) {
            _this.timestamp = Date.now();
            if(gameUI.isGameLaunched && _this.intersectBox.intersectsBox(bullet.getBox())) {
                scene.remove(bullet);
                _spaceship.bullets[_spaceship.bullets.indexOf(bullet)] = null;
                _spaceship.bullets = _spaceship.bullets.filter(function (el) {
                    return el != null;
                });
                var rock, size, lastLife;
                switch (_this.level) {
                    case 3:
                        size = _gameParameters.asteroidMidleSize;
                        lastLife = false;
                    break;
                    case 2:
                        size = _gameParameters.asteroidMinSize;
                        lastLife = false;
                    break;
                    case 1:
                        lastLife = true;
                    default:

                }
                if(!lastLife) {
                    for(var i = 0; i < _gameParameters.asteroidDivideNumer; i++) {
                        rock = new Asteroid(_gameParameters.asteroidMaxWidth, _gameParameters.asteroidMaxWidth, _gameParameters.asteroidMaxHeight, 0, _this.position, _this.level - 1);
                        asteroids.push(rock);
                    }
                }
                gameUI.scored(10);
                new Explosion(_this.position.x, _this.position.y, _this.position.z)
                audioHandler.explosionSound.play();
                scene.remove(_this);
                asteroids[asteroids.indexOf(_this)] = null;
                asteroids = asteroids.filter(function (el) {
                    return el != null;
                });
                if(asteroids.length == 0) {
                    levelUp(false);
                }
            }
        });
    }
}
