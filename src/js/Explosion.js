class Explosion {
    constructor(position) {
        this.group = new SPE.Group({
            texture: {
                value: textureLoader.getExplosion().texture,
                frames: new THREE.Vector2(5, 5),
                loop: 1
            },
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            scale: 600
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
        this.flash = new SPE.Emitter({
            particleCount: 50,
            position: {
                spread: new THREE.Vector3(5, 5, 5)
            },
            velocity: {
                spread: new THREE.Vector3(30),
                distribution: SPE.distributions.SPHERE
            },
            size: {
                value: [200, 200, 200, 200]
            },
            maxAge: {
                value: 2
            },
            activeMultiplier: 2000,
            opacity: {
                value: [0.5, 0.25, 0, 0]
            }
        });

        this.group.addEmitter(this.fireball).addEmitter(this.flash);
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
