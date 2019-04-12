class EnemyHandler {
    constructor(_t) {
        this.init(_t);
    }

    init(_t) {
        this.enemies = [];
        this.lasers = [];
        this.timestamp = _t;
        this.enemiesCount = 0;

        this.difficulty = {
            level: 1,
            enemiesPerLevel:  1,
            spawntime: gameParameters.enemy.spawntime,
            aimbot: {
                activated: false,
                level: 0
            }
        };
    }

    launch(_t) {
        this.init(_t);
    }

    levelUp() {
        this.difficulty.enemiesPerLevel += 1;
        if(this.difficulty.spawntime > 10) {
            this.difficulty.spawntime -= 1;
        }
        this.difficulty.level += 1;
        if(this.difficulty.level > 2) {
            this.difficulty.aimbot.activated = true;
            this.difficulty.aimbot.level += 1;
        }
        this.enemies.forEach(function(_enemy) {
            _enemy.aimbot = this.difficulty.aimbot;
        }, this);
    }

    removeLaser(_laser) {
        this.lasers[this.lasers.indexOf(_laser)] = null;
        this.lasers = this.lasers.filter(function(el) {
            return el != null;
        });
    }

    remove(_mesh) {
        this.enemies[this.enemies.indexOf(_mesh)] = null;
        this.enemies = this.enemies.filter(function(el) {
            return el != null;
        });
        this.enemyCount -= 1;
    }

    spawn(_t) {
        var enemy = new Enemy(textureHandler.enemy.geometry, textureHandler.enemy.material, gameCore.cameraHandler.size, this.difficulty.aimbot, gameCore.cameraHandler.isPursuitCamera, _t);
        gameCore.scene.add(enemy);
        gameCore.collidableMeshesToSpaceship.push(enemy);
        this.enemies.push(enemy);
        this.timestamp = _t;
    }


    update(_gameLaunched, _t) {
        if(_gameLaunched && this.timestamp + this.difficulty.spawntime < _t && this.enemies.length < this.difficulty.enemiesPerLevel) {
            this.spawn(_t);
        }
    }
}
