class TextureHandler {
    constructor() {
        this.start = Date.now();
        this.loader = new THREE.OBJLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.MTLLoader = new THREE.MTLLoader();

        /* ######## GEOMETRY AND MODEL INSTANCING ########
            Les trois géométries sont créées une seule fois ici, en fonction de la taille des asteroids voulue
            materiel est null car pas encore chargé (voir fonction load en dessous) */
            this.asteroid = {
                path: 'src/medias/models/asteroid.png',
                geometry: [
                    new THREE.IcosahedronBufferGeometry(gameParameters.asteroid.size.min, 5),
                    new THREE.IcosahedronBufferGeometry(gameParameters.asteroid.size.middle, 5),
                    new THREE.IcosahedronBufferGeometry(gameParameters.asteroid.size.max, 5)
                ],
                material: null
            }
        /* ############################################### */

        this.laser = {
            geometry: new THREE.CylinderGeometry(1, 1, 32, 20),
            materialSpaceship: new THREE.MeshBasicMaterial({color: 0xff0000}),
            materialEnemy: new THREE.MeshBasicMaterial({color: 0x00ff00}),
        };

        this.spaceship = {
            pathOBJ: 'src/medias/models/spaceship/geometry.obj',
            pathMTL: 'src/medias/models/spaceship/material.mtl',
            geometry: null,
            material: null,
            texture: null
        };

        this.enemy = {
            pathOBJ: 'src/medias/models/ufo/geometry.obj',
            pathMTL: 'src/medias/models/ufo/material.mtl',
            geometry: null,
            material: null
        };

        this.shield = {
            path: 'src/medias/models/spaceship-shield.jpg',
            geometry: new THREE.SphereGeometry(1, 32, 32),
            material: null,
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
                'src/medias/models/spaceman/box/box-extra-life.png',
                'src/medias/models/spaceman/box/box.png'
            ],
            texture: []
        };

        this.load();
    }

    load() {
        this.MTLLoader.load(this.spaceship.pathMTL, materials => {
            // Spaceship material loading
            materials.preload();
            this.loader.setMaterials(materials).load(this.spaceship.pathOBJ, object => {
                // Spaceship geometry loading
                this.spaceship.geometry = object.children[0].geometry;
                this.spaceship.material = object.children[0].material;

                this.MTLLoader.load(this.enemy.pathMTL, materials => {
                    // UFO Material loading
                    materials.preload();
                    this.loader.setMaterials(materials).load(this.enemy.pathOBJ, object => {
                        // UFO geometry loading
                        this.enemy.geometry = object.children[0].geometry;
                        this.enemy.material = object.children[0].material;
                    });
                });
            });
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
                            value: .0
                        }
                    },
                    vertexShader: document.getElementById('vertexShader').textContent,
                    fragmentShader: document.getElementById('fragmentShader').textContent,
                    depthWrite: true,
                    depthTest: true,
                    opacity: 0.1

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
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            this.shield.material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                depthTest: true,
                depthWrite: true
            });
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
    }

    update(_t) {
        /* ######## MATERIAL UPDATE ######## */
            this.asteroid.material.uniforms['time'].value = _t / 10;
        /* ################################# */
    }
}
