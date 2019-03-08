class GameParameters {
    constructor() {
        this.asteroidSpeed = 1;
        this.asteroidNumber = 3;
        this.asteroidMaxSize = 30;
        this.asteroidMidleSize = 20;
        this.asteroidMinSize = 10;
        this.asteroidMaxWidth = 900;
        this.asteroidMaxHeight = 500;
        this.asteroidDivideNumer = 3;
        this.asteroidRotation = 0.01;
        this.antialias = true;
        this.level = 1;
        this.explosionRadius = 200;

        this.spaceship = {
            friction: 0.98,
            rotationFriction: 0.92,
            rotationSpeed: 0.005,
            speed: 0.05,
            scale: 0.2
        }

        this.bullet = {
            speed: 6,
            scale: 1,
            timestamp: 800,
            lifetime: 1500
        };

        this.starfield = {
            number: 1000,
            speed: 2,
            spread: new THREE.Vector3(4000, 4000, 2000)
        };
    }

    static getRandom(x) {
        return THREE.Math.randFloatSpread(x)
    }
};
