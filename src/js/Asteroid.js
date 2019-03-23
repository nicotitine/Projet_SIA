class Asteroid extends ResizableObject {
    constructor(position, level) {
        /* ######### GEOMETRY #########
            On récupère la géométrie et le materiel déjà créés */
            super(textureLoader.asteroid.geometry[level - 1], textureLoader.asteroid.material);
        /*############################# */

        this.level = level;

        /* ######### RANDOMNESS #########
            Pour donner un aspect "random" au materiel, car le materiel est unique, donc l'animation aussi */
            this.rotation.y = GameParameters.getRandom(Math.PI);
        /* ############################## */

        var x = gameParameters.asteroid.spawnRadius.width / 2 - Math.random() * gameParameters.asteroid.spawnRadius.width;
        var centeredness = 1 - (Math.abs(x) / (gameParameters.asteroid.spawnRadius.width / 2));
        var y = (gameParameters.asteroid.spawnRadius.height / 2 - Math.random() * gameParameters.asteroid.spawnRadius.height) * centeredness;
        var z = 0;

        if (position == null) {
            this.position.set(x, y, z);
        } else {
            this.position.copy(position);
        }

        this.name = "Asteroid";
        this.direction = new THREE.Vector3(GameParameters.getRandom(1), GameParameters.getRandom(1), 0);
        this.vector = this.direction.multiplyScalar(gameParameters.asteroid.speed, gameParameters.asteroid.speed, 0);
    }


    update() {

        /* ######## UPDATE ########
            ON NE MET PAS A JOUR LE MATERIEL ICI MAIS DANS TextureLoader !!!
            (fonction textureLoader.update() appelée dans la fonction update de gameCore)
         ######################## */

        // Update position
        if (gameUI != null && (!gameUI.isPaused || gameUI.isWelcomeDisplayed)) {
            this.position.x += this.vector.x;
            this.position.y += this.vector.y;
        }

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
