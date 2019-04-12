

window.addEventListener('load', function() {
    var gui = new dat.GUI({
        hideable: false
    });

    var params = {

        width: 200,
        spaceshipScale: gameParameters.spaceship.scale,
        spaceshipSpeed: gameParameters.spaceship.speed,
        spaceshipLaserSpeed: gameParameters.laser.spaceship.speed,
        spaceshipLaserTimestamp: gameParameters.laser.spaceship.timestamp,
        spaceshipLaserLifetime: gameParameters.laser.spaceship.lifetime,
        spaceshipLaserScale: gameParameters.laser.spaceship.scale,
        enemyLaserSpeed: gameParameters.laser.enemy.speed,
        enemyLaserTimestamp: gameParameters.laser.enemy.timestamp,
        enemyLaserLifetime: gameParameters.laser.enemy.lifetime,
        enemyLaserScale: gameParameters.laser.enemy.scale,
        betterVelocity: false,
        laserScale: gameParameters.laser.spaceship.scale,
        laserSpeed: gameParameters.laser.spaceship.speed,
        laserTimestamp: gameParameters.laser.spaceship.timestamp
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
    f1.add(params, 'spaceshipScale').min(gameParameters.spaceship.scale / 10).max(gameParameters.spaceship.scale * 3).step(gameParameters.spaceship.scale / 20).name('Scale').onFinishChange(function(newValue) {
        gameCore.spaceship.resize(newValue, newValue, newValue);
    });

    f1.add(params, 'spaceshipSpeed').min(gameParameters.spaceship.speed / 10).max(gameParameters.spaceship.speed * 3).step(gameParameters.spaceship.scale / 20).name('Speed').onFinishChange(function(_newValue) {
        gameParameters.spaceship.speed = _newValue;
    });

    f1.add(params, 'betterVelocity').name('Ez driving mode').onChange(function(_newValue) {
        if(_newValue) {
            gameParameters.spaceship.friction = 0.98;
        } else {
            gameParameters.spaceship.friction = 1.0;
        }
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

    gui.add(params, 'laserScale').min(gameParameters.laser.spaceship.scale / 10).max(gameParameters.laser.spaceship.scale * 3).step(gameParameters.laser.spaceship.scale / 20).name('Bullet scale').onFinishChange(function(newValue) {
        gameCore.bullets.forEach(function(bullet) {
            bullet.resize(newValue, newValue, newValue);
            console.log("resize");
        });
        gameParameters.laser.spaceship.scale = newValue;
    });

    gui.add(params, 'laserSpeed').min(gameParameters.laser.spaceship.speed / 10).max(gameParameters.laser.spaceship.speed * 3).step(gameParameters.laser.spaceship.speed / 20).name('Bullet speed').onFinishChange(function(newValue) {
        gameParameters.laser.spaceship.speed = newValue;
        gameCore.bullets.forEach(function(bullet) {
            bullet.updateSpeed();
        });
    });

    gui.add(params, 'laserTimestamp').min(gameParameters.laser.spaceship.timestamp / 10).max(gameParameters.laser.spaceship.timestamp * 3).step(gameParameters.laser.spaceship.timestamp / 20).name('Bullet timestamp').onFinishChange(function(newValue) {
        gameParameters.laser.spaceship.timestamp = newValue;
    });
});
