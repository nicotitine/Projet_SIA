class JokerHandler {
    constructor(_t) {
        this.types = {
            SHIELD: 1,
            LIFE: 2,
            RAPID_FIRE: 0
        }
        this.init(_t);
    }

    init(_t) {
        this.jokers = [];
        this.lifetime = gameParameters.jokers.lifetime;
        this.spawntime = gameParameters.jokers.timestamp;
        this.timestamp = _t;
    }

    launch(_t) {
        this.init(_t);
    }

    remove(_mesh) {
        this.jokers[this.jokers.indexOf(_mesh)] = null;
        this.jokers = this.jokers.filter(function(el) {
            return el != null;
        });
    }

    spawn(_t) {
        var joker = new Spaceman(THREE.Math.randInt(0, 2), gameCore.cameraHandler.size, gameCore.cameraHandler.isPursuitCamera, this.lifetime, _t);


        this.jokers.push(joker);
        gameCore.scene.add(joker);
        this.timestamp = _t;
    }

    update(_t) {
        if (this.timestamp + this.spawntime < _t) {
            this.spawn(_t);
        }

        this.jokers.forEach(function(joker) {
            joker.update(gameCore.cameraHandler.isPursuitCamera, _t);
            if (joker.boxPosition.distanceTo(gameCore.spaceship.position) < gameCore.spaceship.size.x) {
                switch (joker.type) {
                    case 1:
                        gameCore.spaceship.shield.activate(this.lifetime, _t);
                        gameCore.spaceship.displayBonusTimer(this.lifetime, _t);
                        break;
                    case 2:
                        gameCore.spaceship.addLife();
                        break;
                    case 0:
                        gameCore.spaceship.activateShootBonus(this.lifetime, _t);
                        break;

                }
                gameCore.scene.remove(joker);
                this.jokers[this.jokers.indexOf(joker)] = null;
                this.jokers = this.jokers.filter(function(el) {
                    return el != null;
                });
            }

            if (gameCore.cameraHandler.cameraType == gameCore.cameraHandler.cameraTypes.PURSUIT) {
                joker.rotation.x = Math.PI / 2;
                joker.rotation.z = 0;
            }
        }, this);
    }
}
