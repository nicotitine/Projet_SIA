class Asteroid extends ExplosiveMesh {
    constructor(_position, _level, _speed) {
        /* ######### GEOMETRY #########
            On récupère la géométrie et le materiel déjà créés */
            super(textureHandler.asteroid.geometry[_level - 1], textureHandler.asteroid.material, new THREE.Vector3(gameParameters.asteroid.scale, gameParameters.asteroid.scale, gameParameters.asteroid.scale), _level);
        /*############################# */

        this.level = _level;

        /* ######### RANDOMNESS #########
            Pour donner un aspect "random" au materiel, car le materiel est unique, donc l'animation aussi */
            this.rotation.set(GameParameters.getRandom(Math.PI), GameParameters.getRandom(Math.PI), GameParameters.getRandom(Math.PI));
        /* ############################## */

        var x = gameParameters.asteroid.spawnRadius.width / 2 - Math.random() * gameParameters.asteroid.spawnRadius.width;
        var centeredness = 1 - (Math.abs(x) / (gameParameters.asteroid.spawnRadius.width / 2));
        var y = (gameParameters.asteroid.spawnRadius.height / 2 - Math.random() * gameParameters.asteroid.spawnRadius.height) * centeredness;
        var z = 0;

        if (_position == null) {
            this.position.set(x, y, z);
        } else {
            this.position.copy(_position);
        }

        this.name = "Asteroid";
        this.direction = new THREE.Vector3(GameParameters.getRandom(1), GameParameters.getRandom(1), 0);
        this.vector = this.direction.multiplyScalar(_speed, _speed, 0);
        if(storageHandler.data.options.glowingEffect) {
            this.layers.enable(1);
        } else {
            this.layers.set(0);
        }
    }


    update() {
        // Update position
        if (gameUI != null && (!gameUI.isPaused || gameUI.isWelcomeDisplayed)) {
            this.position.x += this.vector.x;
            this.position.y += this.vector.y;
        }
        this.checkOutOfScreen();
    }
}
