window.addEventListener('load', function() {
    var params = {
        interation: 5000,
        width: 200,
        spaceshipScale: gameParameters.spaceship.scale,
        bulletScale: gameParameters.bullet.scale,
        bulletSpeed: gameParameters.bullet.speed,
        bulletTimestamp: gameParameters.bullet.timestamp
    };

    gui.add(params, 'spaceshipScale').min(gameParameters.spaceship.scale / 10).max(gameParameters.spaceship.scale * 3).step(gameParameters.spaceship.scale / 20).name('Spaceship scale').onFinishChange(function(newValue) {
        gameCore.spaceship.resize(newValue, newValue, newValue);
    });

    gui.add(params, 'bulletScale').min(gameParameters.bullet.scale / 10).max(gameParameters.bullet.scale * 3).step(gameParameters.bullet.scale / 20).name('Bullet scale').onFinishChange(function(newValue) {
        gameCore.bullets.forEach(function(bullet) {
            bullet.resize(newValue, newValue, newValue);
            console.log("resize");
        });
        gameParameters.bullet.scale = newValue;
    });

    gui.add(params, 'bulletSpeed').min(gameParameters.bullet.speed / 10).max(gameParameters.bullet.speed * 3).step(gameParameters.bullet.speed / 20).name('Bullet speed').onFinishChange(function(newValue) {
        gameParameters.bullet.speed = newValue;
        gameCore.bullets.forEach(function(bullet) {
            bullet.updateSpeed();
        });
    });

    gui.add(params, 'bulletTimestamp').min(gameParameters.bullet.timestamp / 10).max(gameParameters.bullet.timestamp * 3).step(gameParameters.bullet.timestamp / 20).name('Bullet timestamp').onFinishChange(function(newValue) {
        gameParameters.bullet.timestamp = newValue;
    });
});
