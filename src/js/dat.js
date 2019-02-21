var params = {
    interation: 5000,
    width: 200,
    spaceshipScale: _gameParameters.spaceshipScale,
    bulletScale: _gameParameters.bulletScale,
    bulletSpeed: _gameParameters.bulletSpeed,
    bulletTimestamp: _gameParameters.bulletTimestamp
};



console.log(_gameParameters.spaceshipScale);
gui.add(params, 'spaceshipScale').min(_gameParameters.spaceshipScale / 10).max(_gameParameters.spaceshipScale * 3).step(_gameParameters.spaceshipScale / 20).name('Spaceship scale').onFinishChange(function(newValue) {
    spaceship.scale.set(newValue, newValue, newValue);
    spaceship.size = new THREE.Vector3();
    fire.scale.set(newValue * 50, newValue * 200, newValue * 100);
    new THREE.Box3().setFromObject(spaceship).getSize(spaceship.size);
    _gameParameters.spaceshipScale = newValue;
});

gui.add(params, 'bulletScale').min(_gameParameters.bulletScale / 10).max(_gameParameters.bulletScale * 3).step(_gameParameters.bulletScale / 20).name('Bullet scale').onFinishChange(function(newValue) {
    _gameParameters.bulletScale = newValue;
});

gui.add(params, 'bulletSpeed').min(_gameParameters.bulletSpeed / 10).max(_gameParameters.bulletSpeed * 3).step(_gameParameters.bulletSpeed / 20).name('Bullet speed').onFinishChange(function(newValue) {
    _gameParameters.bulletSpeed = newValue;
});

gui.add(params, 'bulletTimestamp').min(_gameParameters.bulletTimestamp / 10).max(_gameParameters.bulletTimestamp * 3).step(_gameParameters.bulletTimestamp / 20).name('Bullet timestamp').onFinishChange(function(newValue) {
    _gameParameters.bulletTimestamp = newValue;
});
