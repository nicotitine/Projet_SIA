 class Spaceship extends THREE.Mesh {
    constructor() {
        super(textureHandler.getSpaceship().children[0].geometry, new THREE.MeshStandardMaterial({color: "#ffffff", flatShading: true, /*  shininess: 0.5 */ roughness: 0.8, metalness: 1}));

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
        this.fire = new Fire(scene, this.fireScale, function(fire) {
            scene.add(fire)
        });
        this.bullets = [];
        this.isHitted = false;
        this.needToReload = false;
        this.reloadSoundPlayed = false;
        this.size = new THREE.Vector3();
        new THREE.Box3().setFromObject(this).getSize(this.size);

        scene.add(this);
        scene.add(this.shield);
    }

    shoot() {
        var bullet = new Bullet(bulletLoader.getNewBullet(), _spaceship, _gameParameters.bullet.scale, _gameParameters.bullet.speed);
        this.bullets.push(bullet)
        scene.add(bullet);
        audioHandler.fireSound.play();
        this.needToReload = true;
        this.reloadSoundPlayed = false;
    }

    update(keys, frustum) {
        // Keys event handling
        if(keys[37]) this.velocity.arl = _gameParameters.spaceship.rotationSpeed; else this.velocity.arl = 0;
        if(keys[39]) this.velocity.arr = -_gameParameters.spaceship.rotationSpeed; else this.velocity.arr = 0;
        if(gameUI != null && !gameUI.isPaused && keys[38]){
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
        if(keys[32] && !this.needToReload) {
            this.shoot();
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
                bullet.update(frustum);
            }
        });
        this.bullets = bullets;
    }
}
