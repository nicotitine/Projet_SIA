class Jokers {
    constructor() {
        this.jokers = [];
        this.lifetime = 10000;
        this.spawntime = 20000;
        this.timestamp = Date.now();
        this.types = {
            SHIELD: 1,
            LIFE: 2,
            RAPID_FIRE: 0
        }
    }

    spawn() {
        var joker = new Spaceman(THREE.Math.randInt(0, 2), gameCore.cameraHandler.size);
        this.timestamp = Date.now();
        if (gameCore.cameraHandler.cameraType == gameCore.cameraHandler.cameraTypes.PURSUIT)
            joker.rotation.z = -Math.PI / 2;

        this.jokers.push(joker);
        gameCore.scene.add(joker);
        setTimeout(() => {
            gameCore.scene.remove(joker);
            this.jokers[this.jokers.indexOf(joker)] = null;
            this.jokers = this.jokers.filter(function(el) {
                return el != null;
            });
        }, this.lifetime);
    }

    update() {
        if (this.timestamp + this.spawntime < Date.now() && gameUI.isGameLaunched && !gameUI.isPaused) {
            this.spawn();
        } else if (!gameUI.isGameLaunched || gameUI.isPaused) {
            this.timestamp = Date.now();
        }
        this.jokers.forEach(function(joker) {
            joker.update();
            if (joker.boxPosition.distanceTo(gameCore.spaceship.position) < gameCore.spaceship.size.x) {
                switch (joker.type) {
                    case 1:
                        gameCore.spaceship.shield.activate(10, true);
                        gameCore.spaceship.displayBonusTimer(this.lifetime);
                        break;
                    case 2:
                        gameCore.spaceship.addLife();
                        break;
                    case 0:
                        gameCore.spaceship.shoot(true);
                        gameCore.spaceship.displayBonusTimer(this.lifetime);
                        gameCore.spaceship.isRapidFireActivated = true;
                        setTimeout(() => {
                            gameCore.spaceship.isRapidFireActivated = false;
                        }, this.lifetime);
                        break;

                }
                gameCore.scene.remove(joker);
                this.jokers[this.jokers.indexOf(joker)] = null;
                this.jokers = this.jokers.filter(function(el) {
                    return el != null;
                });
            }

            if (gameCore.cameraHandler.cameraType == gameCore.cameraHandler.cameraTypes.PURSUIT) {
                //joker.lookAt(gameCore.cameraHandler.camera.position.x, gameCore.cameraHandler.camera.position.y, 0);
                joker.rotation.x = Math.PI / 2;
                joker.rotation.z = 0;


            }
        }, this);
    }
}
