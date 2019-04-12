class GameCore {
    constructor() {

        this.glowingMesh = [];

        this.scene = new THREE.Scene();


        this.starfield = new Starfield(gameParameters.starfield.number, gameParameters.starfield.spread);
        this.cameraHandler = new CameraHandler();
        this.audioHandler = new AudioHandler();

        this.clock = new THREE.Clock(true);
        this.enemyHandler = new EnemyHandler(this.clock.elapsedTime);
        this.jokerHandler = new JokerHandler(this.clock.elapsedTime);
        this.spaceship = new Spaceship(textureHandler.spaceship.geometry, textureHandler.spaceship.material, this.clock.elapsedTime);
        this.asteroidHandler = new AsteroidHandler(this.clock.elapsedTime);

        this.enemyCount = 0;
        this.difficulty = {
            level: 0,
            asteroidNumber: gameParameters.asteroid.number,
            asteroidSpeed: gameParameters.asteroid.speed
        };
        this.isPaused = false;

        this.collidableMeshesToSpaceship = [];
        this.collidableMeshesFromSpaceship = [];


        this.scene.add(this.cameraHandler.light);
        this.scene.add(this.cameraHandler.camera);
        this.scene.add(this.starfield);
        this.scene.add(this.cameraHandler.lightningStrikeMesh)
        this.cameraHandler.lightningBox.lightningsMesh.forEach(function(_lightningMesh) {
            this.scene.add(_lightningMesh);
        }, this);

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

    addAsteroid(_asteroid) {
        this.scene.add(_asteroid);
        this.collidableMeshesToSpaceship.push(_asteroid)
        this.glowingMesh.push(_asteroid);
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
        if(_mesh.name == "Asteroid") {
            this.asteroidHandler.remove(_mesh);
        }
        if(_mesh.name == "Enemy") {
            this.enemyHandler.remove(_mesh)
        }
        if(_mesh.name == "Joker") {
            this.jokerHandler.remove(_mesh)
        }
        if(_mesh.name == "Laser") {
            if(_mesh.type == gameParameters.laser.types.SPACESHIP) {
                this.spaceship.removeLaser(_mesh);
            } else {
                this.enemyHandler.removeLaser(_mesh);
            }
        }

        this.filterArrays();
    }

    setIsPaused(_bool) {
        this.isPaused = _bool;
    }

    showSpaceship() {
        this.scene.add(this.spaceship);
        this.scene.add(this.spaceship.shield);
        this.scene.add(this.spaceship.bonusTimer);
        this.scene.add(this.spaceship.fireLeft);
        this.scene.add(this.spaceship.fireRight);
    }

    initGlowingMeshes() {
        this.glowingMesh.push(this.starfield);
        this.glowingMesh.push(this.spaceship.shield);
        this.glowingMesh.push(this.spaceship.fireLeft);
        this.glowingMesh.push(this.spaceship.fireRight);
    }

    setGlowLayers(_value) {
        this.glowingMesh.forEach(function(_mesh) {
            if(_value == 0) {
                _mesh.layers.set(_value)
            } else {
                _mesh.layers.enable(_value)
            }
        }, this)
    }


    update() {
        var time = this.clock.getElapsedTime();

        if(!gameUI.isPaused) {
            textureHandler.update(time);
            this.enemyHandler.update(gameUI.isGameLaunched, time);
            this.collidableMeshesToSpaceship.forEach(function(collidableMesh) {
                collidableMesh.update(time);
            })
            this.collidableMeshesFromSpaceship.forEach(function(collidableMesh) {
                collidableMesh.update(time);
            })
            this.spaceship.update(time);

            if(gameUI.isGameLaunched) {
                this.jokerHandler.update(time);
            }
        }

        if (this.spaceman != null) {
            this.spaceman.update();
        }

        if (this.spaceship != null && !this.spaceship.isHitted)
            this.cameraHandler.update();

        if (this.starfield != null)
            this.starfield.update(this.cameraHandler.frustum, gameParameters.starfield.speed, gameParameters.starfield.spread);

        if(gameUI.isGameLaunched) {

            for(var i = 0; i < this.collidableMeshesToSpaceship.length; i++) {
                for(var j = 0; j < this.collidableMeshesFromSpaceship.length; j++) {
                    if(this.collidableMeshesToSpaceship[i] != null && this.collidableMeshesToSpaceship[i].name != "Laser" && this.collidableMeshesToSpaceship[i].checkCollide(this.collidableMeshesFromSpaceship[j])) {
                        this.collidableMeshesToSpaceship[i].explode();

                        if(this.collidableMeshesToSpaceship[i].name == "Asteroid") {
                            this.asteroidHandler.collide(this.collidableMeshesToSpaceship[i]);
                        }

                        this.removeMesh(this.collidableMeshesToSpaceship[i]);
                        this.removeMesh(this.collidableMeshesFromSpaceship[j]);

                        gameUI.scored(10);
                        if(this.asteroidHandler.asteroids.length === 0) {
                            this.levelUp(false, time);
                        }
                    }
                }
                if(this.collidableMeshesToSpaceship[i] != null && !this.spaceship.shield.isActivated && this.collidableMeshesToSpaceship[i].checkCollide(this.spaceship)) {
                    if(this.spaceship.shield)
                    this.spaceship.explode();
                    this.spaceship.hitted(time);
                }
            }
        }

    }

    levelUp(_isCheat, _t) {
        this.enemyHandler.levelUp();
        if (!gameUI.isLevelingUp) {
            if (_isCheat) {
                this.asteroidHandler.asteroids.forEach(function(_collidableMesh) {
                    if(_collidableMesh.name == "Asteroid") {
                        _collidableMesh.explode();
                        this.removeMesh(_collidableMesh);
                        this.asteroidHandler.remove(_collidableMesh)
                    }
                }, this);
            }
            setTimeout(() => {
                this.asteroidHandler.levelUp();
                gameUI.showLevelUp(_isCheat);
                this.spaceship.shield.activate(3, _t);
                this.spaceship.displayBonusTimer(3.0, _t);
            }, 1000);
        }
        gameUI.isLevelingUp = true;
    }

    launchGame(_t) {
        this.rebuildGame();
        this.spaceship.isInvincible = false;
        this.spaceship.shield.activate(4, _t);
        this.spaceship.displayBonusTimer(4.0, _t);
        this.enemyHandler.launch(this.clock.elapsedTime);
        this.jokerHandler.launch(this.clock.elapsedTime);
        this.asteroidHandler.launch(this.clock.elapsedTime);
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
        this.scene.remove(this.spaceship.fireLeft);
        this.scene.remove(this.spaceship.fireRight);
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
        this.spaceship = new Spaceship(textureHandler.spaceship.geometry, textureHandler.spaceship.material, this.clock.elapsedTime);

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
