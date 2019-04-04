class EnemyHandler {
    constructor() {
        this.enemies = [];
        this.timestamp = Date.now();
        this.enemiesCount = 0;

        this.difficulty = {
            level: 1,
            enemiesPerLevel:  1,
            spawntime: gameParameters.enemy.spawntime,
            aimbot: {
                activated: false,
                level: 0
            }
        }
    }

    launch() {
        this.timestamp = Date.now();
    }

    levelUp() {
        this.difficulty.enemiesPerLevel += 1;
        if(this.difficulty.spawntime > 10000) {
            this.difficulty.spawntime -= 1000;
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

    remove(_mesh) {
        this.enemies[this.enemies.indexOf(_mesh)] = null;
        this.enemies = this.enemies.filter(function(el) {
            return el != null;
        });
        this.enemyCount -= 1;
    }

    spawn() {
        var enemy = new Enemy(textureLoader.enemy.geometry, textureLoader.enemy.material, gameCore.cameraHandler.size, this.difficulty.aimbot);
        gameCore.scene.add(enemy);
        gameCore.collidableMeshesToSpaceship.push(enemy);
        this.enemies.push(enemy);
        this.timestamp = Date.now();
    }


    update(_gameLaunched) {
        if(_gameLaunched && this.timestamp + this.difficulty.spawntime < Date.now() && this.enemies.length < this.difficulty.enemiesPerLevel) {
            this.spawn();
        }
    }
}
