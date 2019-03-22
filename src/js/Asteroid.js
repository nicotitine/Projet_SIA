class Asteroid extends ResizableObject {
    constructor(position, level) {
        // ADD ASTEROID MODELS !!!
        var geometry;
        var color = '#ffffff';
        var texture;
        var size = 0;

        switch (level) {
            case 1:
                size = gameParameters.asteroid.size.min;
                break;
            case 2:
                size = gameParameters.asteroid.size.middle;
                break;
            case 3:
                size = gameParameters.asteroid.size.max;
                break;
            default:
                size = gameParameters.asteroid.size.max;
        }

        geometry = new THREE.DodecahedronGeometry(size, 1);
        geometry.vertices.forEach(function(v) {
            v.x += (0 - Math.random() * (size / 4));
            v.y += (0 - Math.random() * (size / 4));
            v.z += (0 - Math.random() * (size / 4));
        });

        texture = new THREE.MeshStandardMaterial();

        super(geometry, texture);

        color = this.colorLuminance(color, 2 + Math.random() * 10);
        this.material = new THREE.MeshStandardMaterial({
            color: color,
            flatShading: true,
            roughness: 0.8,
            metalness: 1,
            depthTest: true,
            depthWrite: true,
            opacity: 1
        });

        this.castShadow = true;
        this.receiveShadow = true;
        this.scale.set(1, 1, 1);
        this.level = level;

        var x = gameParameters.asteroid.spawnRadius.width / 2 - Math.random() * gameParameters.asteroid.spawnRadius.width;
        var centeredness = 1 - (Math.abs(x) / (gameParameters.asteroid.spawnRadius.width / 2));
        var y = (gameParameters.asteroid.spawnRadius.height / 2 - Math.random() * gameParameters.asteroid.spawnRadius.height) * centeredness;
        var z = 0;

        if (position == null) {
            this.position.set(x, y, z);
        } else {
            this.position.copy(position);
        }

        this.size = new THREE.Vector3();
        this.box = new THREE.Box3().setFromObject(this);
        this.box.getSize(this.size);

        this.name = "Asteroid";
        this.direction = new THREE.Vector3(GameParameters.getRandom(1), GameParameters.getRandom(1), 0);
        this.vector = this.direction.multiplyScalar(gameParameters.asteroid.speed, gameParameters.asteroid.speed, 0);
        this.geometry.computeBoundingBox();
    }

    colorLuminance(hex, lum) {
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;
        var rgb = "#",
            c, i;
        for (var i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }
        return rgb;
    }

    update() {
        // Update position
        if (gameUI != null && (!gameUI.isPaused || gameUI.isWelcomeDisplayed)) {
            this.position.x += this.vector.x;
            this.position.y += this.vector.y;
        }

        // this.rotation.x += gameParameters.asteroid.rotation;
        // this.rotation.y += gameParameters.asteroid.rotation;

        // Check if out of screen
        if (Math.abs(this.position.x) > gameCore.cameraHandler.size.x / 2) {
            this.position.x = -this.position.x;
        }
        if (Math.abs(this.position.y) > gameCore.cameraHandler.size.y / 2) {
            this.position.y = -this.position.y;
        }
    }

    collide() {
        var rock, size, lastLife, newAsteroids = [];
        switch (this.level) {
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
                newAsteroids.push(new Asteroid(this.position, this.level - 1));
            }
        }
        gameUI.scored(10);
        return newAsteroids;
    }
}
