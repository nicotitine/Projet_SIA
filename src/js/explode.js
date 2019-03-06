 function Explosion(x, y, z) {
    this.group = new SPE.Group( {
            texture: {
                value: new THREE.TextureLoader().load( './src/medias/models/sprite-explosion2.png' ),
                frames: new THREE.Vector2( 5, 5 ),
                loop: 1
            },
            depthTest: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            scale: 600
    });
    this.fireball = new SPE.Emitter( {
        particleCount: 20,
        type: SPE.distributions.SPHERE,
        position: {
            radius: 1
        },
        maxAge: { value: 2 },
        duration: 1,
        activeMultiplier: 20,
        velocity: {
            value: new THREE.Vector3( 10 )
        },
        size: { value: [_gameParameters.explosionRadius, 10] },
        color: {
            value: [
                new THREE.Color( 0.5, 0.1, 0.05 ),
                new THREE.Color( 0.2, 0.2, 0.2 )
            ]
        },
        opacity: { value: [0.5, 0.35, 0.1, 0] }
    });
    this.flash = new SPE.Emitter( {
        particleCount: 50,
        position: { spread: new THREE.Vector3( 5, 5, 5 ) },
        velocity: {
            spread: new THREE.Vector3( 30 ),
            distribution: SPE.distributions.SPHERE
        },
        size: { value: [200, 200, 200, 200] },
        maxAge: { value: 2 },
        activeMultiplier: 2000,
        opacity: { value: [0.5, 0.25, 0, 0] }
    } );

    this.group.addEmitter( this.fireball ).addEmitter( this.flash );
    this.group.mesh.position.set(x, y, z);
    scene.add(this.group.mesh);



    var group = this.group;
    this.group.mesh.onBeforeRender = function() {
        group.tick();
    }
    setTimeout(function() {
        scene.remove(group.mesh);
    }, 3000);



}
