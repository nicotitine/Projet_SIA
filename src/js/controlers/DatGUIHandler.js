

window.addEventListener('load', function() {
    var gui = new dat.GUI({
        hideable: false
    });

    var params = {

        width: 200,
        spaceshipSpeed: gameParameters.spaceship.speed,
        spaceshipFriction : gameParameters.spaceship.friction,
        spaceshipLaserSpeed: gameParameters.laser.spaceship.speed,
        spaceshipLaserTimestamp: gameParameters.laser.spaceship.timestamp,
        spaceshipLaserLifetime: gameParameters.laser.spaceship.lifetime,
        spaceshipLaserScale: gameParameters.laser.spaceship.scale,
        betterVelocity: false,
        spaceshipScale: gameParameters.spaceship.scale,
        enemyLaserSpeed: gameParameters.laser.enemy.speed,
        enemyLaserTimestamp: gameParameters.laser.enemy.timestamp,
        enemyLaserLifetime: gameParameters.laser.enemy.lifetime,
        enemyLaserScale: gameParameters.laser.enemy.scale,
        enemyScale: gameParameters.enemy.scale,
        enemySpeed: 1,
        asteroidScale: gameParameters.asteroid.scale,
        asteroidSpeed: gameParameters.asteroid.speed
        
    };

    var f1 = gui.addFolder('Spaceship options');
    var f11 = f1.addFolder('Laser');

    f11.add(params, 'spaceshipLaserScale').min(gameParameters.laser.spaceship.scale / 10).max(gameParameters.laser.spaceship.scale * 3).step(gameParameters.laser.spaceship.scale / 20).name('Scale').onFinishChange(function(_newValue) {
        gameParameters.laser.spaceship.scale = _newValue;
    });
    f11.add(params, 'spaceshipLaserSpeed').min(gameParameters.laser.spaceship.speed / 10).max(gameParameters.laser.spaceship.speed * 3).step(gameParameters.laser.spaceship.speed / 20).name('Speed').onFinishChange(function(_newValue) {
        gameParameters.laser.spaceship.speed = _newValue;
    });
    f11.add(params, 'spaceshipLaserTimestamp').min(gameParameters.laser.spaceship.timestamp / 10).max(gameParameters.laser.spaceship.timestamp * 3).step(gameParameters.laser.spaceship.timestamp / 20).name('Timestamp').onFinishChange(function(_newValue) {
        gameParameters.laser.spaceship.timestamp = _newValue;
    });
    f11.add(params, 'spaceshipLaserLifetime').min(gameParameters.laser.spaceship.lifetime / 10).max(gameParameters.laser.spaceship.lifetime * 3).step(gameParameters.laser.spaceship.lifetime / 20).name('Lifetime').onFinishChange(function(_newValue) {
        gameParameters.laser.spaceship.lifetime = _newValue;
    });
    f1.add(params, 'spaceshipScale').min(gameParameters.spaceship.scale / 10).max(gameParameters.spaceship.scale * 3).step(gameParameters.spaceship.scale / 20).name('Scale').onFinishChange(function(_newValue) {
        gameCore.spaceship.resize(_newValue, _newValue, _newValue);
        gameParameters.spaceship.scale = _newValue;
    });

    f1.add(params, 'spaceshipSpeed').min(gameParameters.spaceship.speed / 10).max(gameParameters.spaceship.speed * 3).step(gameParameters.spaceship.speed / 20).name('Speed').onFinishChange(function(_newValue) {
        gameParameters.spaceship.speed = _newValue;
    });

    f1.add(params, 'spaceshipFriction').min(0.9).max(1).step(gameParameters.spaceship.friction / 100).name('Friction').onFinishChange(function(_newValue) {
        gameParameters.spaceship.friction = _newValue;
    });

    f1.add(params, 'betterVelocity').name('Ez driving mode').onChange(function(_newValue) {
        if(_newValue) {
            gameParameters.spaceship.friction = 0.98;
        } else {
            gameParameters.spaceship.friction = 1.0;
        }       
        params.spaceshipFriction = gameParameters.spaceship.friction;
    });

    var f2 = gui.addFolder('Enemy options');
    var f21 = f2.addFolder('Laser')
    f21.add(params, 'enemyLaserScale').min(gameParameters.laser.enemy.scale / 10).max(gameParameters.laser.enemy.scale * 3).step(gameParameters.laser.enemy.scale / 20).name('Scale').onFinishChange(function(_newValue) {
        gameParameters.laser.enemy.scale = _newValue;
    });
    f21.add(params, 'enemyLaserSpeed').min(gameParameters.laser.enemy.speed / 10).max(gameParameters.laser.enemy.speed * 3).step(gameParameters.laser.enemy.speed / 20).name('Speed').onFinishChange(function(_newValue) {
        gameParameters.laser.enemy.speed = _newValue;
    });
    f21.add(params, 'enemyLaserTimestamp').min(gameParameters.laser.enemy.timestamp / 10).max(gameParameters.laser.enemy.timestamp * 3).step(gameParameters.laser.enemy.timestamp / 20).name('Timestamp').onFinishChange(function(_newValue) {
        gameParameters.laser.enemy.timestamp = _newValue;
    });
    f21.add(params, 'enemyLaserLifetime').min(gameParameters.laser.enemy.lifetime / 10).max(gameParameters.laser.enemy.lifetime * 3).step(gameParameters.laser.enemy.lifetime / 20).name('Lifetime').onFinishChange(function(_newValue) {
        gameParameters.laser.enemy.lifetime = _newValue;
    });

    f2.add(params, 'enemyScale').min(gameParameters.enemy.scale / 10).max(gameParameters.enemy.scale * 3).step(gameParameters.enemy.scale / 20).name('Scale').onFinishChange(function(_newValue) {
        gameCore.enemyHandler.enemies.forEach(function(_enemy) {
            _enemy.resize(_newValue, _newValue, _newValue);
        });
        gameParameters.enemy.scale = _newValue;
    });

    f2.add(params, 'enemySpeed').min(0).max(4).step(gameParameters.enemy.speed / 20).name('Multiply speed by').onFinishChange(function(_newValue) {
        gameCore.enemyHandler.enemies.forEach(function(_enemy) {
            _enemy.updateSpeed(_newValue);
        });
        gameParameters.enemy.speed *= _newValue;
    });

    var f3 = gui.addFolder('Asteroids options');
    f3.add(params, 'asteroidScale').min(gameParameters.asteroid.scale / 10).max(gameParameters.asteroid.scale * 3).step(gameParameters.asteroid.scale / 20).name('Scale').onFinishChange(function(_newValue) {
        gameCore.asteroidHandler.asteroids.forEach(function(_asteroid) {
            _asteroid.resize(_newValue, _newValue, _newValue);
        });
        gameParameters.asteroid.scale = _newValue;
    });
    f3.add(params, 'asteroidSpeed').min(0).max(4).step(gameParameters.asteroid.speed / 20).name('Multiply speed by').onFinishChange(function(_newValue) {
        gameCore.asteroidHandler.asteroids.forEach(function(_asteroid) {
            _asteroid.updateSpeed(_newValue);
        });
        gameParameters.asteroid.speed *= _newValue;
    });
});
