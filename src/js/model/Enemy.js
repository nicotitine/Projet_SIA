class Enemy extends ExplosiveMesh {
    constructor(_geometry, _material, _cameraSize, _aimbot, _isPursuitCamera, _t) {

        super(_geometry, _material, new THREE.Vector3(1, 1, 1), 2);

        this.borders = {
            TOP: 1,
            RIGHT: 2,
            BOTTOM: 3,
            LEFT: 4
        }

        if(_isPursuitCamera) {
            this.rotation.x = Math.PI/2;
        }

        this.borderToSpawn = GameParameters.getRandomInt(this.borders.TOP, this.borders.LEFT)
        switch (this.borderToSpawn) {
            case this.borders.TOP:
                this.position.set(GameParameters.getRandom(_cameraSize.x/2), _cameraSize.y/2, 0)
                break;
            case this.borders.RIGHT:
                this.position.set(_cameraSize.x/2, GameParameters.getRandom(_cameraSize.y/2), 0)
                break;
            case this.borders.BOTTOM:
            this.position.set(GameParameters.getRandom(_cameraSize.x/2), -_cameraSize.y/2, 0)
            break;
            case this.borders.LEFT:
                this.position.set(-_cameraSize.x/2, GameParameters.getRandom(_cameraSize.y/2), 0)
                break;
        }

        this.timestamp = _t;
        this.direction = new THREE.Vector3(GameParameters.getRandom(1), GameParameters.getRandom(1), 0);
        this.shootDirection = 0;
        this.vector = this.direction.multiplyScalar(gameParameters.enemy.speed, gameParameters.enemy.speed, 0);
        this.aimbot = {
            activated: _aimbot.activated,
            level: _aimbot.level
        }
        this.name = "Enemy";
        this.layers.enable(1);

        this.lasers = [];
    }

    removeLaser(_laser) {

    }

    shoot(_t) {
        var shootDirection, laser;
        if(this.aimbot.activated) {
            let angleToSpaceship = Math.atan2(gameCore.spaceship.position.y - this.position.y, gameCore.spaceship.position.x - this.position.x);
            let precisionEffect = GameParameters.getRandom(Math.PI / this.aimbot.level)
            shootDirection =  angleToSpaceship - Math.PI/2 + GameParameters.getRandom(Math.PI/2 / this.aimbot.level)
        } else {
            shootDirection = this.shootDirection;
        }
        this.timestamp = _t;
        laser = new Laser(textureHandler.laser.geometry, textureHandler.laser.materialEnemy, this.position, shootDirection, this.rotation, gameParameters.laser.types.ENEMY, _t)
        gameCore.addEnemyLaser(laser);
        gameCore.enemyHandler.lasers.push(laser);
        this.shootDirection += Math.PI/4;
    }

    update(_t) {
        this.position.x += this.vector.x;
        this.position.y += this.vector.y

        this.checkOutOfScreen();

        if(this.timestamp + gameParameters.laser.enemy.timestamp < _t) {
            this.shoot(_t)
        }

        this.rotation.y += 0.0125;
    }
}
