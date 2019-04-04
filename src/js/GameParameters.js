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
            friction: 0.98,
            rotationFriction: 0.92,
            rotationSpeed: 0.005,
            speed: 0.10,
            scale: 0.08,
            fire: {
                scale: {
                    x: 10,
                    y: 40,
                    z: 20
                }
            },
            shield: {
                ratio: 0.9
            }
        }

        this.enemy = {
            shotTimespawn: 3000,
            speed: 2,
            spawntime: 20000
        };

        this.laser = {
            spaceship: {
                speed: 10,
                scale: 1,
                timestamp: 500,
                lifetime: 1500
            },
            enemy :{
                speed: 1,
                lifetime: 5000
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
            }
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
