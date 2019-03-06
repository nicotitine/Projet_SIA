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

    loadSpaceship() {
        var _this = this;
        this.spaceshipLoader.load('src/medias/models/spaceship.obj', geometry => {
            this.spaceshipTexture = geometry;
            initSpaceship();
            //console.log(this.loadTexture('src/medias/models/shield.png'));
            this.loadMaterial();
        });
    }

    loadTexture(url) {
        console.log("texture");
        return new Promise(resolve => {
            new THREE.TextureLoader().load(url, resolve);
            console.log(resolve);
        })
    }

    loadMaterial() {
        console.log("material");
        const textures = {
            map: 'src/medias/models/shield.png'
        };
        const params = {};

        const promises = Object.keys(textures).map(key => {

            return this.loadTexture(textures[key]).then(texture => {
                params[key] = texture;
                console.log(this.loadTexture());
                console.log(params);
            })
        })

        return Promise.all(promises).then(() => {
            console.log(params);
        });
    }

    getSpaceship() {
        return this.spaceshipTexture.clone();
    }
}
