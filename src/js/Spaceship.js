 class Spaceship extends THREE.Mesh {
    constructor() {
        super();
        this.bullets = [];
        this.isHitted = false;
        this.needToReload = false;
        this.reloadSoundPlayed = false;
        this.isLoaded = false;
        this.textureLoader = new THREE.OBJLoader().load('src/medias/models/spaceship.obj', geometry => {
            this.geometry = geometry.children[0].geometry;
            this.material = new THREE.MeshStandardMaterial({color: "#ffffff", flatShading: true, /*  shininess: 0.5 */ roughness: 0.8, metalness: 1});
            this.rotation.x = Math.PI / 2;
            this.velocity = {
                x: 0, y: 0,
                vx: 0, vy: 0,
                ax: 0, ay: 0,
                r: 0,
                vrl: 0, vrr: 0,
                arl: 0, arr: 0
            };
            this.name = "Spaceship";
            this.position.z = 0;
            this.scale.set(_gameParameters.spaceship.scale, _gameParameters.spaceship.scale, _gameParameters.spaceship.scale);
            this.shield = new Shield(50, this.position)
            this.shield.activate();
            this.lives = 3;
            this.fireScale = new THREE.Vector3(10, 40, 20);
            this.fire = new Fire(this.fireScale);
            this.size = new THREE.Vector3();
            new THREE.Box3().setFromObject(this).getSize(this.size);
            this.intersectBox = new THREE.Box3().setFromObject(this);
            this.isLoaded = true;

            scene.add(this);
            scene.add(this.shield);
        });
    }

    shoot(isBonus) {
        if(isBonus) {

        } else {
            var bullet = new Bullet(bulletLoader.getNewBullet(), _spaceship, _gameParameters.bullet.scale, _gameParameters.bullet.speed);
            this.bullets.push(bullet)
            scene.add(bullet);
            audioHandler.fireSound.play();
            this.needToReload = true;
            this.reloadSoundPlayed = false;
        }
    }

    addLife() {
        if(this.lives < 10) {
            this.lives += 1;
            gameUI.editLives(this.lives, true)
        }
    }


    hitted() {
        var explosion = new Explosion(this.position.x, this.position.y, this.position.z);
        audioHandler.explosionSound.play();
        this.isHitted = true;
        this.visible = false;
        this.fire.visible = false;
        this.position.z = 2000;
        this.fire.fire.position.z = 2000;
        gameUI.editLives(this.lives, false)
        this.lives -= 1;


        if(this.lives > 0) {
            var _this = this;
            setTimeout(function() {
                _this.isHitted = false;
                _this.fire.fire.position.z = 10;
                _this.visible = true;
                _this.fire.fire.visible = true;
                _this.position.set(0, 0, 0);
                _this.shield.activate();
                _this.rotation.x = Math.PI / 2;
                _this.velocity = {
                    x: 0, y: 0,
                    vx: 0, vy: 0,
                    ax: 0, ay: 0,
                    r: 0,
                    vrl: 0, vrr: 0,
                    arl: 0, arr: 0
                };
                setTimeout(function() {
                    _this.shield.desactivate();
                }, 5000);
            }, 2000);
        } else {
            gameUI.showLoose();
        }
    }

    update() {
        this.intersectBox = new THREE.Box3().setFromObject(this);
        // Keys event handling
        if(eventHandler.keys[37]) this.velocity.arl = _gameParameters.spaceship.rotationSpeed; else this.velocity.arl = 0;
        if(eventHandler.keys[39]) this.velocity.arr = -_gameParameters.spaceship.rotationSpeed; else this.velocity.arr = 0;
        if(gameUI != null && !gameUI.isPaused && eventHandler.keys[38]){
            this.velocity.ax = -Math.cos(this.velocity.r) * _gameParameters.spaceship.speed;
            this.velocity.ay = -Math.sin(this.velocity.r) * _gameParameters.spaceship.speed;
            if(this.fire.fire.material.uniforms.magnitude.value > 0) {
                this.fire.fire.material.uniforms.magnitude.value -= 0.2;
            }

        } else {
            this.velocity.ax = this.velocity.ay = 0;
            if(this.fire.fire != null && this.fire.fire.material.uniforms.magnitude.value < 3.5) {
                this.fire.fire.material.uniforms.magnitude.value += 0.2;
            }
        }
        if(eventHandler.keys[32] && !this.needToReload) {
            this.shoot(false);
            timestamp = Date.now();
        }

        if(timestamp + _gameParameters.bullet.timestamp < Date.now() + 400 && this.needToReload && !this.reloadSoundPlayed) {
            audioHandler.reloadSound.play();
            this.reloadSoundPlayed = true;
        }

        if(timestamp + _gameParameters.bullet.timestamp < Date.now() && this.needToReload) {
            this.needToReload = false;
        }

        // Movements handling
        if(gameUI != null && !gameUI.isPaused) {
            this.velocity.vx += this.velocity.ax;
            this.velocity.vy += this.velocity.ay;
            this.velocity.vrl += this.velocity.arl;   // velocity for rotation left at time = t
            this.velocity.vrr += this.velocity.arr;   // velocity for rotation right at time = t
            this.velocity.vx *= _gameParameters.spaceship.friction;
            this.velocity.vy *= _gameParameters.spaceship.friction;
            this.velocity.vrl *= _gameParameters.spaceship.rotationFriction;    // each multiplied by the rotationFriction
            this.velocity.vrr *= _gameParameters.spaceship.rotationFriction;    //  "       "      "   "         "
            this.velocity.x += this.velocity.vx;
            this.velocity.y += this.velocity.vy;
            this.velocity.r += this.velocity.vrr + this.velocity.vrl;    // the sum represents the real rotation of the ship at time = t

            this.position.x = this.velocity.x + this.velocity.x;
            this.position.y = this.velocity.y + this.velocity.y;
            this.rotation.y = this.velocity.r;

            // Check if out of scene
            if(Math.abs(this.position.x) > cameraHandler.size.x / 2) {
                this.position.x = -this.position.x;
                this.velocity.x = -this.velocity.x;
            }
            if(Math.abs(this.position.y) > cameraHandler.size.y / 2) {
                this.position.y = -this.position.y;
                this.velocity.y = -this.velocity.y;
            }
        }

        if(this.shield != null)
            this.shield.update(this.position);

        if(this.fire != null && this.position != null)
            this.fire.update(this.position, this.size, this.rotation);

        // Bullet updating
        var bullets = this.bullets;

        this.bullets.forEach(function(bullet) {
            if(bullet.spawnTime + _gameParameters.bullet.lifetime < Date.now()) {
                scene.remove(bullet);
                bullets[bullets.indexOf(bullet)] = null;
                bullets = bullets.filter(function (el) {
                    return el != null;
                });
            } else {
                bullet.update();
            }
        });
        this.bullets = bullets;
    }

    getBox() {
        return this.intersectBox;
    }
}
