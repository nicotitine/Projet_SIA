class AsteroidHandler {
    constructor(_t) {
        //this.init(_t);
    }

    init(_t) {
        this.asteroids = [];
        this.timestamp = _t;

        this.difficulty = {
            level: 1,
            asteroidPerLevel:  gameParameters.asteroid.number,
            asteroidSpeed : gameParameters.asteroid.speed
        }

        this.createAsteroids();
    }

    launch(_t) {
        this.init(_t);
    }

    levelUp() {
        this.level += 1;
        this.difficulty.asteroidSpeed *= 1.2;
        this.difficulty.asteroidPerLevel += 1;
        this.createAsteroids();
    }

    remove(_mesh) {
        this.asteroids[this.asteroids.indexOf(_mesh)] = null;
        this.asteroids = this.asteroids.filter(function(el) {
            return el != null;
        });
    }


    collide(_asteroid) {
        var size, lastLife;
        switch (_asteroid.level) {
            case 3:
                size = gameParameters.asteroidMidleSize;
                lastLife = false;
                break;
            case 2:
                size = gameParameters.asteroidMinSize;
                lastLife = false;
                break;
            case 1:
                lastLife = true;
            default:
        }

        if (!lastLife) {
            for (var i = 0; i < gameParameters.asteroid.divideNumber; i++) {
                var asteroid = new Asteroid(_asteroid.position, _asteroid.level - 1, this.difficulty.asteroidSpeed);
                this.asteroids.push(asteroid);
                gameCore.addAsteroid(asteroid);
            }
        }
    }

    createAsteroids() {
        for (var i = 0; i < this.difficulty.asteroidPerLevel; i++) {
            let asteroid = new Asteroid(null, 3, this.difficulty.asteroidSpeed);
            this.asteroids.push(asteroid);
            gameCore.addAsteroid(asteroid);
        }
    }
}
