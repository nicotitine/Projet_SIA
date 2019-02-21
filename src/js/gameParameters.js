var _viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: window.innerWidth / window.innerHTML,
    scale: 1
}

var _gameParameters = {
    friction: 0.98,
    rotationFriction: 0.92,
    bulletSpeed : 6,
    bulletScale: 0.05,
    bulletTimestamp: 500,
    bulletLifeTime : 1500,
    spaceshipRotationSpeed: 0.005,
    spaceshipSpeed: 0.05,
    spaceshipScale: 0.2,
    asteroidSpeed: 1,
    asteroidNumber: 3,
    asteroidSize: 30,
    asteroidMidleSize: 20,
    asteroidMinSize: 10,
    asteroidMaxWidth: 900,
    asteroidMaxHeight: 500,
    asteroidDivideNumer: 3,
    asteroidRotation: 0.01,
    starsNumber: 1000,
    starsSpeed: 2,
    antialias: true,
    level: 1,
    explosionRadius: 200
}

var levelUpDiv = document.createElement('div');
levelUpDiv.id = "level-up"
levelUpDiv.customShow = function(isCheat) {
    levelUpDiv.innerHTML = "Level " + _gameParameters.level;
    if(isCheat)
        levelUpDiv.innerHTML += " <br/><small>(cheater !!!)</small>";
    levelUpDiv.style.display = "block";
    levelUpDiv.style.left = (_viewport.width / 2) - (levelUpDiv.clientWidth / 2) + "px";
    levelUpDiv.style.top = (_viewport.height / 2) - (levelUpDiv.clientHeight / 2) + "px";
    setTimeout(function () {
        levelUpDiv.style.display = "none";
    }, 1000);
}
