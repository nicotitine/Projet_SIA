class Explosion {
    constructor(position, level) {
        this.group = new SPE.Group({
            texture: {
                value: textureLoader.getExplosion().texture,
                frames: new THREE.Vector2(5, 5),
                loop: 1
            },
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            scale: 600 * level
        });
        this.fireball = new SPE.Emitter({
            particleCount: 20,
            type: SPE.distributions.SPHERE,
            position: {
                radius: 1
            },
            maxAge: {
                value: 2
            },
            duration: 1,
            activeMultiplier: 20,
            velocity: {
                value: new THREE.Vector3(10)
            },
            size: {
                value: [gameParameters.explosionRadius, 10]
            },
            color: {
                value: [
                    new THREE.Color(0.5, 0.1, 0.05),
                    new THREE.Color(0.2, 0.2, 0.2)
                ]
            },
            opacity: {
                value: [0.5, 0.35, 0.1, 0]
            }
        });
        
        this.group.addEmitter(this.fireball);
        this.group.mesh.position.copy(position);
        gameCore.scene.add(this.group.mesh);

        this.group.mesh.onBeforeRender = function() {
            this.group.tick();
        }.bind(this);

        setTimeout(() => {
            gameCore.scene.remove(this.group.mesh);
        }, 3000);
    }
}
