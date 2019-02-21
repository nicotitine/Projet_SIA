function Explosion(x, y, z) {
    this.group = new SPE.Group( {
            texture: {
                value: new THREE.ImageUtils.loadTexture( './src/medias/models/sprite-explosion2.png' ),
                frames: new THREE.Vector2( 5, 5 ),
                loop: 1
            },
            depthTest: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            scale: 600
        });
    this.shockwaveGroup = new SPE.Group( {
        texture: {
            value: new THREE.ImageUtils.loadTexture( './src/medias/models/smokeparticle.png' ),
        },
        depthTest: false,
        depthWrite: true,
        blending: THREE.NormalBlending,
    });
    this.shockwave = new SPE.Emitter( {
        particleCount: 200,
        type: SPE.distributions.DISC,
        position: {
            radius: 5,
            spread: new THREE.Vector3( 5 )
        },
        maxAge: {
            value: 2,
            spread: 0
        },
        duration: 1,
        activeMultiplier: 2000,

        velocity: {
            value: new THREE.Vector3( 40 )
        },
        rotation: {
            axis: new THREE.Vector3( 1, 0, 0 ),
            angle: Math.PI * 0.5,
            static: true
        },
        size: { value: 200 },
        color: {
            value: [
                new THREE.Color( 0.4, 0.2, 0.1 ),
                new THREE.Color( 0.2, 0.2, 0.2 )
            ]
        },
        opacity: { value: [0.5, 0.2, 0] }
    });
    this.debris = new SPE.Emitter( {
        particleCount: 100,
        type: SPE.distributions.SPHERE,
        position: {
            radius: 0.1,
        },
        maxAge: {
            value: 2
        },
        duration: 1,
        activeMultiplier: 40,

        velocity: {
            value: new THREE.Vector3( 100 )
        },
        acceleration: {
            value: new THREE.Vector3( 0, -20, 0 ),
            distribution: SPE.distributions.BOX
        },
        size: { value: 200 },
        drag: {
            value: 1
        },
        color: {
            value: [
                new THREE.Color( 1, 1, 1 ),
                new THREE.Color( 1, 1, 0 ),
                new THREE.Color( 1, 0, 0 ),
                new THREE.Color( 0.4, 0.2, 0.1 )
            ]
        },
        opacity: { value: [0.4, 0] }
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
    this.mist = new SPE.Emitter( {
        particleCount: 50,
        position: {
            spread: new THREE.Vector3( 10, 10, 10 ),
            distribution: SPE.distributions.SPHERE
        },
        maxAge: { value: 2 },
        duration: 1,
        activeMultiplier: 2000,
        velocity: {
            value: new THREE.Vector3( 8, 3, 10 ),
            distribution: SPE.distributions.SPHERE
        },
        size: { value: 400 },
        color: {
            value: new THREE.Color( 0.2, 0.2, 0.2 )
        },
        opacity: { value: [0, 0, 0.2, 0] }
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
    this.shockwaveGroup.addEmitter( this.debris ).addEmitter( this.mist );
    this.group.mesh.position.set(x, y, z);
    scene.add(this.group.mesh);
    scene.add(this.shockwaveGroup.mesh);

    var group = this.group;
    this.group.mesh.onBeforeRender = function() {
        group.tick();
    }



}
