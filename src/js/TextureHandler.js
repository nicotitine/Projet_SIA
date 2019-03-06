class TextureHandler {
    constructor() {
        this.isSpaceshipTextureLoaded = false;
        this.isBulletTextureLoaded = false;
        this.isShieldTextureLoaded = false;
        this.isFireTextureLoaded = false;
        this.isShieldIconTextureLoaded = false;
        this.isLifeIconTextureLoaded = false;
        this.isThroughIconTextureLoaded = false;
        this.isFireIconTextureLoaded = false;

        this.spaceshipLoader = new THREE.OBJLoader();
        this.bulletLoader = new THREE.OBJLoader();
        this.shieldLoader = new THREE.TextureLoader();
        this.fireLoader = new THREE.TextureLoader();

        this.spaceshipTexture;
    }

    getSpaceship() {
        return this.spaceshipTexture.clone();
    }
}
