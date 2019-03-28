class TextureLoader {
    constructor() {
        this.start = Date.now();
        this.loader = new THREE.OBJLoader();
        this.loader.crossOrigin = '';
        this.textureLoader = new THREE.TextureLoader();
        this.material = new THREE.MeshStandardMaterial({
            color: "#ffffff",
            flatShading: true,
            roughness: 0.8,
            metalness: 1
        });;

        /* ######## GEOMETRY AND MODEL INSTANCING ########
            Les trois géométries sont créées une seule fois ici, en fonction de la taille des asteroids voulue
            materiel est null car pas encore chargé (voir fonction load en dessous) */
            this.asteroid = {
                path: 'src/medias/models/explosion0.png',
                geometry: [
                    new THREE.IcosahedronBufferGeometry(gameParameters.asteroid.size.min, 5),
                    new THREE.IcosahedronBufferGeometry(gameParameters.asteroid.size.middle, 5),
                    new THREE.IcosahedronBufferGeometry(gameParameters.asteroid.size.max, 5)
                ],
                material: null
            }
        /* ############################################### */

        this.bullet = {
            path: "src/medias/models/missile-2.obj",
            geometry: null,
            material: this.material
        };

        this.spaceship = {
            path: 'src/medias/models/spaceship.obj',
            pathTexture: 'src/medias/models/spaceshipTexture.jpg',
            geometry: null,
            material: null,
            texture: null
        };

        this.shield = {
            path: 'src/medias/models/spaceship-shield.jpg',
            texture: null
        };

        this.fire = {
            path: 'src/medias/models/spaceship-fire.png',
            texture: null,
        };

        this.explosion = {
            path: 'src/medias/models/explosion.png',
            texture: null
        };

        this.spaceman = {
            path: [
                'src/medias/models/spaceman/1.png',
                'src/medias/models/spaceman/2.png',
                'src/medias/models/spaceman/3.png',
                'src/medias/models/spaceman/4.png',
                'src/medias/models/spaceman/5.png',
                'src/medias/models/spaceman/6.png',
                'src/medias/models/spaceman/7.png',
                'src/medias/models/spaceman/8.png',
                'src/medias/models/spaceman/9.png',
                'src/medias/models/spaceman/10.png',
                'src/medias/models/spaceman/11.png',
                'src/medias/models/spaceman/12.png',
                'src/medias/models/spaceman/13.png',
                'src/medias/models/spaceman/14.png',
                'src/medias/models/spaceman/15.png',
                'src/medias/models/spaceman/16.png',
                'src/medias/models/spaceman/17.png',
                'src/medias/models/spaceman/18.png',
                'src/medias/models/spaceman/19.png',
                'src/medias/models/spaceman/20.png',
                'src/medias/models/spaceman/21.png',
                'src/medias/models/spaceman/22.png',
                'src/medias/models/spaceman/23.png',
                'src/medias/models/spaceman/24.png',
                'src/medias/models/spaceman/25.png',
                'src/medias/models/spaceman/26.png',
                'src/medias/models/spaceman/27.png',
                'src/medias/models/spaceman/28.png',
                'src/medias/models/spaceman/29.png',
                'src/medias/models/spaceman/30.png',
                'src/medias/models/spaceman/31.png'
            ],
            texture: []
        };

        this.spacemanBox = {
            path: [
                'src/medias/models/spaceman/box/box-rapid-fire.png',
                'src/medias/models/spaceman/box/box-shield.png',
                'src/medias/models/spaceman/box/box-extra-life.png'
            ],
            texture: []
        }

        this.worldWrapperSide = {
            path: 'src/medias/models/plasmaSide.png',
            texture: null
        };
        this.worldWrapperFront = {
            path: 'src/medias/models/plasmaFront.png',
            texture: null
        };

        this.load();
    }

    load() {
        this.loader.load(this.spaceship.path, object => {
            this.spaceship.geometry = new THREE.Geometry().fromBufferGeometry(object.children[0].geometry);
            this.textureLoader.load(this.spaceship.pathTexture, texture => {
                this.spaceship.texture = texture;
                this.spaceship.material = this.material
            })
        });
        this.loader.load(this.bullet.path, object => {
            this.bullet.geometry = object.children[0].geometry;
        });

        /* ######## MODEL LOADING ########
            On charge la texture et on créé le matériel avec dans la foulée */
            this.textureLoader.load(this.asteroid.path, texture => {
                this.asteroid.material = new THREE.ShaderMaterial({
                    uniforms: {
                        tExplosion: {
                            type: "t",
                            value: texture
                        },
                        time: {
                            type: "f",
                            value: 0.0
                        },
                        weight: {
                            type: "f",
                            value: 5.0
                        }
                    },
                    vertexShader: document.getElementById('vertexShader').textContent,
                    fragmentShader: document.getElementById('fragmentShader').textContent

                });
                // A EVITER ABSOLUMENT :
                //      Appliquer n'importe quelle fonction sur la géométrie dans Asteroid.js
                // A FAIRE ABSOLUMENT :
                //      Appliquer les fonctions liées à la géométrie ici, une seule fois par géométrie
                this.asteroid.geometry.forEach(function(geometry) {
                    // Utile pour avoir le rayon de l'asteroid, pour la collision
                    // Utilisation : geometry.boundingSphere.radius
                    geometry.computeBoundingSphere();
                })
            });
        /* #################### */


        this.textureLoader.load(this.shield.path, texture => {
            this.shield.texture = texture;
        });
        this.textureLoader.load(this.fire.path, texture => {
            this.fire.texture = texture;
        });
        this.textureLoader.load(this.explosion.path, texture => {
            this.explosion.texture = texture;
        });

        this.spaceman.path.forEach(function(path, i) {
            this.textureLoader.load(path, texture => {
                this.spaceman.texture[i] = texture;
            });
        }, this);

        this.spacemanBox.path.forEach(function(path, i) {
            this.textureLoader.load(path, texture => {
                this.spacemanBox.texture[i] = texture;
            });
        }, this);
        this.textureLoader.load(this.worldWrapperSide.path, texture => {
            this.worldWrapperSide.texture = texture;
        });
        this.textureLoader.load(this.worldWrapperFront.path, texture => {
            this.worldWrapperFront.texture = texture;
        });
    }

    update() {
        /* ######## MATERIAL UPDATE ######## */
            this.asteroid.material.uniforms['time'].value = .00010 * (Date.now() - this.start);
        /* ################################# */
    }

    getBullet() {
        return this.bullet;
    }

    getSpaceship() {
        return this.spaceship;
    }

    getAsteroid() {
        return this.asteroid;
    }

    getShield() {
        return this.shield;
    }

    getFire() {
        return this.fire;
    }

    getExplosion() {
        return this.explosion;
    }

    getSpaceman() {
        return this.spaceman;
    }

    getSpacemanBox() {
        return this.spacemanBox;
    }

    getWorldWrapperSide() {
        return this.worldWrapperSide;
    }

    getWorldWrapperFront() {
        return this.worldWrapperFront;
    }
}
