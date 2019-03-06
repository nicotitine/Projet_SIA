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
        var box = new THREE.Box3().setFromObject(this);
        box.getSize(this.size);

        this.name = "Asteroid";
        this.geometry.computeBoundingBox();

        this.direction = new THREE.Vector3(GameParameters.getRandom(1), GameParameters.getRandom(1), 0);
        this.vector = this.direction.multiplyScalar(_gameParameters.asteroidSpeed, _gameParameters.asteroidSpeed, 0);

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

    update(spaceship) {
        var asteroidBox = new THREE.Box3().setFromObject(this);
        var spaceshipBox = new THREE.Box3().setFromObject(spaceship);
        var bulletBox;

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
        if(gameUI!= null && gameUI.isGameLaunched && !spaceship.shield.isOn && spaceshipBox.intersectsBox(asteroidBox)) {
            var explosion = new Explosion(spaceship.position.x, spaceship.position.y, spaceship.position.z);
            audioHandler.explosionSound.play();
            spaceship.isHitted = true;
            spaceship.visible = false;
            spaceship.fire.visible = false;
            spaceship.position.z = 2000;
            spaceship.fire.fire.position.z = 2000;
            spaceship.lives -= 1;
            document.getElementsByClassName('live')[spaceship.lives].src = "src/medias/images/live_empty.png";
            if(spaceship.lives > 0) {
                setTimeout(function() {
                    spaceship.isHitted = false;
                    spaceship.fire.fire.position.z = 10;
                    spaceship.visible = true;
                    spaceship.fire.fire.visible = true;
                    spaceship.position.set(0, 0, 0);
                    _spaceship.shield.activate();
                    setTimeout(function() {
                        _spaceship.shield.desactivate();
                    }, 5000);
                }, 2000);
            } else {
                gameUI.showLoose();
            }
        }

        let _this = this;
        spaceship.bullets.forEach(function(bullet) {
            bulletBox = new THREE.Box3().setFromObject(bullet);
            if(gameUI.isGameLaunched && bulletBox.intersectsBox(asteroidBox)) {
                scene.remove(bullet);
                spaceship.bullets[spaceship.bullets.indexOf(bullet)] = null;
                spaceship.bullets = spaceship.bullets.filter(function (el) {
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
            }
        })

    }
}
