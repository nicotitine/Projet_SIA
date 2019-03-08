class BulletLoader {
    constructor() {
        this.bulletPath = "src/medias/models/missile-2.obj";
        this.isLoaded = false;
        this.loader = new THREE.OBJLoader();
        this.loader.crossOrigin = '';
        this.skin = null;
        this.load();
    }

    load() {
        var _this = this;
        this.loader.load(_this.bulletPath, function(object) {
            _this.loaded(object, _this);
        });
    }

    loaded(object, _this) {
        object.traverse(function(child) {
            if(child.type == "Mesh")
                child.material = new THREE.MeshStandardMaterial({color: "#ffffff", flatShading: true, /*  shininess: 0.5 */ roughness: 0.8, metalness: 1});
        });
        _this.skin = object;
    }

    getNewBullet() {
        if(this.skin != null)
            return this.skin.clone();
    }
}
