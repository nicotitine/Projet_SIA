class CollidableMesh extends ResizableMesh {
    constructor(_geometry, _material, _scale) {
        super(_geometry, _material, _scale);
    }

    checkOutOfScreen() {
        if (Math.abs(this.position.x) > gameCore.cameraHandler.size.x / 2) {
            if(this.position.x > 0) {
                this.position.x = -this.position.x + this.radius / 2;
            } else {
                this.position.x = -this.position.x - this.radius / 2;
            }
        }
        if (Math.abs(this.position.y) > gameCore.cameraHandler.size.y / 2) {
            if(this.position.y > 0) {
                this.position.y = -this.position.y + this.radius / 2;
            } else {
                this.position.y = -this.position.y - this.radius / 2;
            }
        }
    }

    checkCollide(_mesh) {
        var distance = this.position.distanceTo(_mesh.position);
        if(distance - _mesh.radius - this.radius <= 0 ) {
            console.log("checking for ", this.name, " -> ", _mesh.name);
            var thisBox = new THREE.Box3().setFromObject(this);
            var otherBox = new THREE.Box3().setFromObject(_mesh);
            return thisBox.intersectsBox(otherBox);
        } else {
            return false;
        }
    }
}
