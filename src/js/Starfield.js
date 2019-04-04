class Starfield extends THREE.Points {
    constructor(_number, _spread) {

        super(new THREE.Geometry(), new THREE.PointsMaterial({color: 0xffffff}));

        for (var i = 0; i < _number; i++) {
            let star = new THREE.Vector3();
            star.x = GameParameters.getRandom(_spread.x);
            star.y = GameParameters.getRandom(_spread.y);
            star.z = GameParameters.getRandom(_spread.z);
            this.geometry.vertices.push(star);
        }

        this.name = "Starfield";
        this.layers.set(1);
    }

    update(_frustum, _speed, _spread) {
        for (var i = 0; i < this.geometry.vertices.length; i++) {
            if(gameCore.cameraHandler.cameraType != gameCore.cameraHandler.cameraTypes.PURSUIT) {
                if (!_frustum.containsPoint(this.geometry.vertices[i])) {
                    this.geometry.vertices[i].x = GameParameters.getRandom(_spread.x);
                    this.geometry.vertices[i].y = GameParameters.getRandom(_spread.y)
                    this.geometry.vertices[i].z = GameParameters.getRandom(_spread.z);
                }
                this.geometry.vertices[i].z += _speed;
            }
        }
        this.geometry.verticesNeedUpdate = true;
    }
}
