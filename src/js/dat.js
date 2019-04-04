window.addEventListener('load', function() {
    var params = {
        interation: 5000,
        width: 200,
        spaceshipScale: gameParameters.spaceship.scale,
        laserScale: gameParameters.laser.spaceship.scale,
        laserSpeed: gameParameters.laser.spaceship.speed,
        laserTimestamp: gameParameters.laser.spaceship.timestamp
    };

    gui.add(params, 'spaceshipScale').min(gameParameters.spaceship.scale / 10).max(gameParameters.spaceship.scale * 3).step(gameParameters.spaceship.scale / 20).name('Spaceship scale').onFinishChange(function(newValue) {
        gameCore.spaceship.resize(newValue, newValue, newValue);
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
