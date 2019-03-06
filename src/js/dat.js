window.addEventListener('load', function() {
    var params = {
        interation: 5000,
        width: 200,
        spaceshipScale: _gameParameters.spaceship.scale,
        bulletScale: _gameParameters.bullet.scale,
        bulletSpeed: _gameParameters.bullet.speed,
        bulletTimestamp: _gameParameters.bullet.timestamp
    };

    gui.add(params, 'spaceshipScale').min(_gameParameters.spaceship.scale / 10).max(_gameParameters.spaceship.scale * 3).step(_gameParameters.spaceship.scale / 20).name('Spaceship scale').onFinishChange(function(newValue) {
        _spaceship.scale.set(newValue, newValue, newValue);
        _spaceship.size = new THREE.Vector3();
        _spaceship.fire.fire.scale.set(newValue * 50, newValue * 200, newValue * 100);
        new THREE.Box3().setFromObject(_spaceship).getSize(_spaceship.size);
        _gameParameters.spaceship.scale = newValue;
    });

    gui.add(params, 'bulletScale').min(_gameParameters.bullet.scale / 10).max(_gameParameters.bullet.scale * 3).step(_gameParameters.bullet.scale / 20).name('Bullet scale').onFinishChange(function(newValue) {
        _gameParameters.bullet.scale = newValue;
    });

    gui.add(params, 'bulletSpeed').min(_gameParameters.bullet.speed / 10).max(_gameParameters.bullet.speed * 3).step(_gameParameters.bullet.speed / 20).name('Bullet speed').onFinishChange(function(newValue) {
        _gameParameters.bullet.speed = newValue;
    });

    gui.add(params, 'bulletTimestamp').min(_gameParameters.bullet.timestamp / 10).max(_gameParameters.bullet.timestamp * 3).step(_gameParameters.bullet.timestamp / 20).name('Bullet timestamp').onFinishChange(function(newValue) {
        _gameParameters.bullet.timestamp = newValue;
    });
});
