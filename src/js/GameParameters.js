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
                min: 10,
                middle: 20,
                max: 100
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
            scale: 0.2,
            fire: {
                scale: {
                    x: 10,
                    y: 40,
                    z: 20
                }
            },
            shield: {
                ratio: 1.3
            }
        }

        this.bullet = {
            speed: 8,
            scale: 1,
            timestamp: 800,
            lifetime: 1500
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

    static getRandom(x) {
        return THREE.Math.randFloatSpread(x)
    }

    static getRandomInt(min, max) {
        return THREE.Math.randInt(min, max)
    }
};
