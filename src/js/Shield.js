class Shield extends THREE.Mesh {
    constructor(radius, position) {
        var texture = new THREE.TextureLoader().load('src/medias/models/shield.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );
        var geometry = new THREE.SphereGeometry( radius, 32, 32 );
        var material = new THREE.MeshLambertMaterial( {map: texture, transparent: true, depthWrite: false, depthTest: true} );
        material.opacity = 0.1;
        super(geometry, material);
        this.position.copy(position);
        this.isOn = false;
        this.visible = false;
        this.name = "Shield";
    }

    update(position) {
        this.rotation.y += 0.02;
        this.position.copy(position);
    }

    activate(time, isBounce) {
        if(time != null) {
            var _this = this;
            this.visible = true;
            this.isOn = true;
            setTimeout(function() {
                _this.desactivate();
            }, time * 1000);
        } else {
            this.visible = true;
            this.isOn = true;
        }
    }

    desactivate() {
        this.visible = false;
        this.isOn = false;
    }
}
