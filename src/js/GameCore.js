class GameCore {
    constructor() {
        this.scene = new THREE.Scene();
        this.spaceship = new Spaceship();
        this.jokers = new Jokers();
        this.starfield = new Starfield(gameParameters.starfield.number, gameParameters.starfield.spread);
        this.cameraHandler = new CameraHandler();
        this.audioHandler = new AudioHandler();

        this.bullets = [];
        this.explosions = [];
        this.asteroids = [];
        this.createAsteroids();
        this.worldWrapper = new WorldWrapper(this.cameraHandler.size, this.scene, this.cameraHandler.camera, this.asteroids);
        this.scene.add(this.cameraHandler.ambient);
        this.scene.add(this.cameraHandler.light);
        this.scene.add(this.cameraHandler.camera);
        this.scene.add(this.starfield);
        //this.scene.add(this.worldWrapper);

        this.isPaused = false;





        this.showSpaceship();

    }

    setIsPaused(bool) {
        this.isPaused = bool;
    }

    showSpaceship() {
        this.scene.add(this.spaceship);
        this.scene.add(this.spaceship.shield);
        this.scene.add(this.spaceship.fire)
        //this.scene.add(this.cameraHandler.limitLines);
        this.scene.add(this.spaceship.bonusTimer);
    }


    update() {

        this.worldWrapper.update();

        //console.log(this.bullets.length, this.scene.children.length);
        this.scene.children.forEach(function(child) {
            //if(child.name == "Bullet")
                //console.log("bullet");
        })
        if(this.spaceman != null) {
            this.spaceman.update();
        }

        if(this.spaceship != null && !this.spaceship.isHitted)
            this.cameraHandler.update();

        if(this.spaceship.isLoaded && !this.isPaused)
            this.spaceship.update();


        if(this.starfield != null)
            this.starfield.update(this.cameraHandler.frustum, gameParameters.starfield.speed, gameParameters.starfield.spread);

        if(!this.isPaused) {
            this.asteroids.forEach(function(asteroid) {
                asteroid.update();

                for(var i = 0; i < this.bullets.length; i++) {
                    let distanceToAsteroid = this.bullets[i].position.distanceTo(asteroid.position);
                    if(gameUI.isGameLaunched && asteroid.geometry.boundingSphere != null && distanceToAsteroid < (asteroid.geometry.boundingSphere.radius + (this.bullets[i].size.x + this.bullets[i].size.y) / 2)) {
                        let newAsteroids = asteroid.collide();
                        this.explosions.push(new Explosion(asteroid.position))
                        this.bullets[i].geometry.dispose();
                        this.bullets[i].material.dispose();
                        this.scene.remove(this.bullets[i]);
                        this.scene.remove(asteroid);
                        this.bullets[i] = null;

                        this.audioHandler.explosionSound.play();

                        newAsteroids.forEach(function(newAsteroid) {
                            this.scene.add(newAsteroid);
                            this.asteroids.push(newAsteroid);
                        }, this);

                        this.asteroids[this.asteroids.indexOf(asteroid)] = null;
                        this.filterArrays();
                        if(this.asteroids.length == 0) {
                            this.levelUp(false);
                        }
                    }
                }

                let distanceToSpacehip = asteroid.position.distanceTo(this.spaceship.position);
                if(gameUI.isGameLaunched && !this.spaceship.shield.isActivated && distanceToSpacehip < asteroid.size.x) {
                    this.spaceship.hitted();
                    this.audioHandler.explosionSound.play();
                }
            }, this);
        }

        if(gameUI != null && gameUI.isGameLaunched && !this.isPaused)
            this.jokers.update();

        // Bullet updating
        if(!this.isPaused) {
            for(var i = 0; i < this.bullets.length; i++) {
                if(this.bullets[i].spawnTime + gameParameters.bullet.lifetime < Date.now()) {
                    //console.log(bullet);
                    this.scene.remove(this.bullets[i]);
                    this.bullets[i] = null;
                    this.filterArrays();
                } else {
                    this.bullets[i].update();
                }
            }
        }
    }

    levelUp(isCheat) {
        this.bullets.forEach(function(bullet, i) {
            this.scene.remove(bullet);
            this.bullets[i] = null;
        }, this);
        this.filterArrays();
        if(!gameUI.isLevelingUp) {
            if(isCheat) {
                this.asteroids.forEach(function(asteroid, i) {
                    var explosion = new Explosion(asteroid.position);
                    this.audioHandler.explosionSound.play();
                    this.scene.remove(asteroid);
                    this.asteroids[i] = null;
                }, this);
                this.filterArrays();
            }
            setTimeout(() => {
                gameParameters.level += 1;
                gameParameters.asteroid.speed *= 1.2;
                gameParameters.asteroid.number += 1;
                gameUI.showLevelUp(isCheat);
                this.createAsteroids();
                this.spaceship.shield.activate(3, false);
                this.spaceship.displayBonusTimer(3000);
            }, 1000);
        }
        gameUI.isLevelingUp = true;
    }

    createAsteroids(){
        for(var i = 0; i < gameParameters.asteroid.number; i++){
            let asteroid = new Asteroid(null, 3);
            this.asteroids.push(asteroid);
            this.scene.add(asteroid);
        }
    }

    launchGame() {
        this.rebuildGame();
        this.spaceship.isInvincible = false;
        this.spaceship.shield.activate(4, false);
        this.spaceship.displayBonusTimer(4000);
    }

    endGame() {
        this.rebuildGame();
        this.spaceship.isInvincible = true;
    }

    rebuildGame() {
        // Remove all objects from de scene
        this.scene.remove(this.spaceship);
        this.scene.remove(this.spaceship.shield);
        this.scene.remove(this.spaceship.fire);
        this.scene.remove(this.spaceship.bonusTimer)
        this.asteroids.forEach(function(asteroid, i) {
            this.scene.remove(asteroid);
            this.asteroids[i] = null;
        }, this);
        this.bullets.forEach(function(bullet, i) {
            this.scene.remove(bullet);
            this.bullets[i] = null;
        }, this);
        this.filterArrays();

        // Add the new objects
        this.spaceship = new Spaceship();
        this.createAsteroids();
        this.jokers.timestamp = Date.now();
        this.showSpaceship();
    }

    filterArrays() {
        //console.log("filtering");
        this.asteroids = this.asteroids.filter(function (el) {
            return el != null;
        });
        this.bullets = this.bullets.filter(function (el) {
            return el != null;
        });
    }
}
