class WorldWrapper extends ResizableObject {
    constructor(size) {
        var model = textureLoader.getWorldWrapper().texture;
        var geometry = new THREE.BoxGeometry(size.x, size.y, 150);
        var material = new THREE.MeshBasicMaterial({map: model, side: THREE.DoubleSide, transparent: true, opacity: 0.3, depthTest: false});
        var materials = [
            new THREE.MeshBasicMaterial({map: model, side: THREE.DoubleSide, transparent: true, opacity: 0.3, depthTest: false}),
            new THREE.MeshBasicMaterial({map: model, side: THREE.DoubleSide, transparent: true, opacity: 0.3, depthTest: false}),
            new THREE.MeshBasicMaterial({map: model, side: THREE.DoubleSide, transparent: true, opacity: 0.3, depthTest: false}),
            new THREE.MeshBasicMaterial({map: model, side: THREE.DoubleSide, transparent: true, opacity: 0.3, depthTest: false}),
            new THREE.MeshBasicMaterial({visible: false, transparent: true}),
            new THREE.MeshBasicMaterial({visible: false, transparent: true})
        ];
        super(geometry, materials);
    }
}
