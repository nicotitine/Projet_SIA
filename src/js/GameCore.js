class GameCore {
    constructor() {

        this.glowingMesh = [];

        this.scene = new THREE.Scene();
        this.spaceship = new Spaceship(textureLoader.spaceship.geometry, textureLoader.spaceship.material);
        this.jokers = new Jokers();
        this.starfield = new Starfield(gameParameters.starfield.number, gameParameters.starfield.spread);
        this.cameraHandler = new CameraHandler();
        this.audioHandler = new AudioHandler();
        this.enemyHandler = new EnemyHandler();

        this.enemyCount = 0;
        this.difficulty = {
            level: 0,
            asteroidNumber: gameParameters.asteroid.number,
            asteroidSpeed: gameParameters.asteroid.speed
        };
        this.isPaused = false;

        this.collidableMeshesToSpaceship = [];
        this.collidableMeshesFromSpaceship = [];



        this.createAsteroids();

        this.scene.add(this.cameraHandler.light);
        this.scene.add(this.cameraHandler.camera);
        this.scene.add(this.starfield);
        this.scene.add(this.cameraHandler.limitLines);

        this.showSpaceship();
        this.initGlowingMeshes();
    }

    addEnemyLaser(_laser) {
        this.scene.add(_laser);
        this.collidableMeshesToSpaceship.push(_laser)
    }

    addSpaceshipLaser(_laser) {
        this.scene.add(_laser);
        this.collidableMeshesFromSpaceship.push(_laser);
    }

    removeMesh(_mesh) {
        this.scene.remove(_mesh);
        var indexTo = this.collidableMeshesToSpaceship.indexOf(_mesh);
        var indexFrom = this.collidableMeshesFromSpaceship.indexOf(_mesh)
        if(indexTo != -1) {
            this.collidableMeshesToSpaceship[indexTo] = null;
        }
        if(indexFrom != -1) {
            this.collidableMeshesFromSpaceship[indexFrom] = null;
        }
        console.log(_mesh);
        if(_mesh.name == "Enemy") {
            this.enemyHandler.remove(_mesh)
        }
        this.filterArrays();
    }

    setIsPaused(bool) {
        this.isPaused = bool;
    }

    showSpaceship() {
        this.scene.add(this.spaceship);
        this.scene.add(this.spaceship.shield);
        this.scene.add(this.spaceship.bonusTimer);
    }

    initGlowingMeshes() {
        this.glowingMesh.push(this.starfield);
        this.glowingMesh.push(this.spaceship.shield);
    }

    setGlowLayers(_value) {
        this.glowingMesh.forEach(function(_mesh) {
            if(_value == 0) {
                _mesh.layers.set(_value)
                this.spaceship.shield.material.opacity = 0.4;
            } else {
                _mesh.layers.enable(_value)
                this.spaceship.shield.material.opacity = 0.2;
            }
        }, this)
    }


    update() {
        this.enemyHandler.update(gameUI.isGameLaunched);

        textureLoader.update();

        if (this.spaceman != null) {
            this.spaceman.update();
        }

        if (this.spaceship != null && !this.spaceship.isHitted)
            this.cameraHandler.update();

        if (!this.isPaused)
            this.spaceship.update();


        if (this.starfield != null)
            this.starfield.update(this.cameraHandler.frustum, gameParameters.starfield.speed, gameParameters.starfield.spread);

        this.collidableMeshesToSpaceship.forEach(function(collidableMesh) {
            collidableMesh.update();
        })
        this.collidableMeshesFromSpaceship.forEach(function(collidableMesh) {
            collidableMesh.update();
        })

        if (gameUI != null && gameUI.isGameLaunched && !this.isPaused)
            this.jokers.update();

        if(gameUI.isGameLaunched) {

            for(var i = 0; i < this.collidableMeshesToSpaceship.length; i++) {
                for(var j = 0; j < this.collidableMeshesFromSpaceship.length; j++) {
                    if(this.collidableMeshesToSpaceship[i] != null && this.collidableMeshesToSpaceship[i].name != "Laser" && this.collidableMeshesToSpaceship[i].checkCollide(this.collidableMeshesFromSpaceship[j])) {
                        this.collidableMeshesToSpaceship[i].explode();

                        if(this.collidableMeshesToSpaceship[i].name == "Asteroid") {
                            this.enemyCount -= 1;
                            this.collidableMeshesToSpaceship[i].collide(this.difficulty.asteroidSpeed).forEach(function(_mesh) {
                                this.enemyCount += 1;
                                this.scene.add(_mesh);
                                this.collidableMeshesToSpaceship.push(_mesh);
                                this.glowingMesh.push(_mesh);
                            }, this);
                        }
                        this.removeMesh(this.collidableMeshesToSpaceship[i]);
                        this.removeMesh(this.collidableMeshesFromSpaceship[j]);

                        gameUI.scored(10);
                        if(this.enemyCount === 0) {
                            this.levelUp(false);
                        }
                    }
                }
                if(this.collidableMeshesToSpaceship[i] != null && !this.spaceship.shield.isActivated && this.collidableMeshesToSpaceship[i].checkCollide(this.spaceship)) {
                    if(this.spaceship.shield)
                    this.spaceship.explode();
                    this.spaceship.hitted();
                }
            }
        }

    }

    levelUp(_isCheat) {
        this.enemyHandler.levelUp();
        if (!gameUI.isLevelingUp) {
            if (_isCheat) {
                this.collidableMeshesToSpaceship.forEach(function(_collidableMesh) {
                    if(_collidableMesh.name == "Asteroid") {
                        _collidableMesh.explode();
                        this.removeMesh(_collidableMesh);
                        this.enemyCount -= 1;
                    }
                }, this);
            }
            setTimeout(() => {
                this.difficulty.level += 1;
                this.difficulty.asteroidSpeed *= 1.2;
                this.difficulty.asteroidNumber += 1;
                gameUI.showLevelUp(_isCheat);
                this.createAsteroids();
                this.spaceship.shield.activate(3, false);
                this.spaceship.displayBonusTimer(3000);
            }, 1000);
        }
        gameUI.isLevelingUp = true;
    }

    createAsteroids() {
        for (var i = 0; i < this.difficulty.asteroidNumber; i++) {
            let asteroid = new Asteroid(null, 3, this.difficulty.asteroidSpeed);
            this.enemyCount += 1;
            this.collidableMeshesToSpaceship.push(asteroid);
            this.scene.add(asteroid);
            this.glowingMesh.push(asteroid);
        }
    }

    launchGame() {
        this.rebuildGame();
        this.spaceship.isInvincible = false;
        this.spaceship.shield.activate(4, false);
        this.spaceship.displayBonusTimer(4000);
        this.enemyHandler.launch();
    }

    endGame() {
        this.rebuildGame();
        this.spaceship.isInvincible = true;
    }

    rebuildGame() {
        // Remove all objects from de scene
        this.enemyCount = 0;
        this.difficulty = {
            level: 0,
            asteroidNumber: gameParameters.asteroid.number,
            asteroidSpeed: gameParameters.asteroid.speed
        }
        this.scene.remove(this.spaceship);
        this.scene.remove(this.spaceship.shield);
        this.scene.remove(this.spaceship.fire);
        this.scene.remove(this.spaceship.bonusTimer)
        this.collidableMeshesToSpaceship.forEach(function(_mesh) {
            this.removeMesh(_mesh)
        }, this);
        this.collidableMeshesFromSpaceship.forEach(function(_mesh) {
            this.removeMesh(_mesh)
        }, this);
        this.filterArrays();
        this.glowingMesh = [];

        // Add the new objects
        this.spaceship = new Spaceship(textureLoader.spaceship.geometry, textureLoader.spaceship.material);
        this.createAsteroids();
        this.jokers.timestamp = Date.now();
        this.showSpaceship();
        this.initGlowingMeshes();
    }

    filterArrays() {
        this.collidableMeshesToSpaceship = this.collidableMeshesToSpaceship.filter(function(el) {
            return el != null;
        })

        this.collidableMeshesFromSpaceship = this.collidableMeshesFromSpaceship.filter(function(el) {
            return el != null;
        })
    }
}
