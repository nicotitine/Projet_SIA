class WorldWrapper extends ResizableObject {
    constructor(size, scene, camera) {
        console.log(scene, camera);
        // var left = textureLoader.getWorldWrapperSide().texture;
        // left.wrapS = left.wrapT = THREE.RepeatWrapping;
        //
        // var right = left.clone();
        // right.needsUpdate = true;
        //
        // var back = textureLoader.getWorldWrapperFront().texture;
        // back.wrapS = back.wrapT = THREE.RepeatWrapping;
        //
        // var front = back.clone();
        // front.needsUpdate = true;

        var geometry = new THREE.BoxGeometry(size.x, size.y, 150);
        // var materials = [
        //     new THREE.MeshBasicMaterial({map: left, side: THREE.DoubleSide, transparent: true, opacity: 0.3, depthTest: true, depthWrite: false}),
        //     new THREE.MeshBasicMaterial({map: right, side: THREE.DoubleSide, transparent: true, opacity: 0.3, depthTest: true, depthWrite: false}),
        //     new THREE.MeshBasicMaterial({map: back, side: THREE.DoubleSide, transparent: true, opacity: 0.3, depthTest: true, depthWrite: false}),
        //     new THREE.MeshBasicMaterial({map: front, side: THREE.DoubleSide, transparent: true, opacity: 0.3, depthTest: true, depthWrite: false}),
        //     new THREE.MeshBasicMaterial({visible: false, transparent: true}),
        //     new THREE.MeshBasicMaterial({visible: false, transparent: true})
        // ];
        super();
        this.clock = new THREE.Clock();
        var textureLoader = new THREE.TextureLoader();
		this.uniforms = {
			"fogDensity": { value: 0.45 },
			"fogColor": { value: new THREE.Vector3( 0, 0, 0 ) },
			"time": { value: 1.0 },
			"uvScale": { value: new THREE.Vector2( 3.0, 1.0 ) },
			"texture1": { value: textureLoader.load( 'src/medias/models/cloud.png' ) },
			"texture2": { value: textureLoader.load( 'src/medias/models/lavatile.jpg' ) }
		};

		this.uniforms[ "texture1" ].value.wrapS = this.uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
	    this.uniforms[ "texture2" ].value.wrapS = this.uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;
		var material = new THREE.ShaderMaterial( {
			uniforms: this.uniforms,
			vertexShader: document.getElementById('vertexShader').textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
		});

        this.geometry = geometry;
        this.material = material;
        this.needsUpdate = true;

        console.log(material);
    }

    update() {
        for(var i = 0; i < 2; i++) {
            //this.material[i].map.offset.y += 1;
        }
        var delta = 5 * this.clock.getDelta();
		this.uniforms[ "time" ].value += 0.2 * delta;
        renderer.clear();
        //this.composer.render( 0.01 );
    }
}
