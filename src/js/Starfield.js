class Starfield extends THREE.Points {
    constructor(number, spread) {
        var geometry = new THREE.Geometry();
        var material = new THREE.PointsMaterial({color: 0xffffff});
        super(geometry, material);
        for(var i = 0; i < number; i++) {
            let star = new THREE.Vector3();
            star.x = GameParameters.getRandom(spread.x);
            star.y = GameParameters.getRandom(spread.y);
            star.z = GameParameters.getRandom(spread.z);
            this.geometry.vertices.push(star);
        }
    }

    update(frustum, speed, spread) {
        for(var i = 0; i < this.geometry.vertices.length; i++) {
            if(!frustum.containsPoint(this.geometry.vertices[i])) {
                this.geometry.vertices[i].x = GameParameters.getRandom(spread.x);
                this.geometry.vertices[i].y = GameParameters.getRandom(spread.y)
                this.geometry.vertices[i].z = GameParameters.getRandom(spread.z);
            }
            if(cameraHandler.cameraType != cameraHandler.cameraTypes.PURSUIT)
                this.geometry.vertices[i].z += speed;
        }
        this.geometry.verticesNeedUpdate = true;
    }
}
