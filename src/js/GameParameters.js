class GameParameters {
    constructor() {
        this.antialias = true;
        this.level = 1;
        this.explosionRadius = 200;

        this.asteroid = {
            divideNumber: 2,
            rotation: 0.01,
            speed: 1,
            number: 3,
            size: {
                min: 15,
                middle: 30,
                max: 50
            },
            spawnRadius: {
                width: 900,
                height: 500
            }
        }

        this.spaceship = {
            friction: 1,
            rotationFriction: 0.92,
            rotationSpeed: 0.005,
            speed: 0.05,
            scale: 0.08,
            fire: {
                scale: {
                    x: 10,
                    y: 30,
                    z: 12
                }
            },
            shield: {
                ratio: 0.9
            }
        }

        this.enemy = {
            shotTimespawn: 3.0,
            speed: 2.0,
            spawntime: 20.0
        };

        this.laser = {
            spaceship: {
                speed: 10,
                scale: 1,
                timestamp: 0.5,
                lifetime: 1.5
            },
            enemy :{
                speed: 1,
                scale: 1,
                timestamp: 3.0,
                lifetime: 5.0
            },
            types: {
                SPACESHIP: 1,
                ENEMY: 2
            },

        };

        this.jokers = {
            spaceman: {
                speedMax: 5,
                speedMin: 2
            },
            shoot: {
                timestamp: 0.3
            },
            lifetime: 10.0,
            timestamp: 20.0
        }

        this.starfield = {
            number: 1000,
            speed: 2,
            spread: new THREE.Vector3(3000, 3000, 1500)
        };

        this.worldWrapper = {
            speed: 0.005
        }
    }

    static getRandom(_x) {
        return THREE.Math.randFloatSpread(_x)
    }

    static getRandomInt(_min, _max) {
        return THREE.Math.randInt(_min, _max)
    }
};
