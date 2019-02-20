javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='src/lib/stats.js';document.head.appendChild(script);})()



var timestamp = Date.now();

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({antialias: _gameParameters.antialias, preserveDrawingBuffer: true});
var spaceship = {};
var frustum = new THREE.Frustum();
var cameraViewProjectionMatrix = new THREE.Matrix4();
var userControlsSpaceship = {
    up: false,
    right: false,
    down: false,
    left: false,
    space: false
};

var bullets = [];
var _viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: window.innerWidth / window.innerHTML,
    scale: 1
}
var camera = new THREE.PerspectiveCamera(50, _viewport.width / _viewport.height, 0.1, 1000);
var directions = {
    NE : 1,
    SE : 2,
    SO : 3,
    NO : 4
};
var starsGeometry = new THREE.Geometry();
var starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
var starField = new THREE.Points(starsGeometry, starsMaterial);
var ambient = new THREE.AmbientLight(0xffffff);
var light;
var iDiv = document.createElement('div');
var pseudoInputElement = document.createElement('input');
var asteroids = createAsteroids();
var playButton;
var spaceshipLoader = new THREE.OBJLoader();
var missileLoader = new THREE.OBJLoader();
var missile;
var fontLoader = new THREE.FontLoader();
var raycaster = new THREE.Raycaster();

light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI);
light.position.set(0, 0, 500);
light.target.position.set(0, 0, 0);


scene.add(ambient);
scene.add(light);

renderer.setSize(_viewport.width, _viewport.height);
renderer.context.getShaderInfoLog = function () { return '' };

document.body.appendChild(renderer.domElement);
pseudoInputElement.class = "input";
pseudoInputElement.id = "pseudoInputElement";
pseudoInputElement.placeholder = "Pseudo...";
iDiv.class = "container";
iDiv.id = "welcome";
iDiv.innerHTML += "<div>Ici c'est les fleches</div><div><a href='#' id='playButton'>Jouer</a><a href='#' id='scoresButton'>Scores</a><a href='#' id='optionsButton'>Options</a></div><div>Et la les autres</div>";
document.body.appendChild(iDiv);
iDiv.style.left = (_viewport.width / 2) - (iDiv.clientWidth / 2) + "px";
iDiv.style.top = (_viewport.height) - (iDiv.clientHeight) + "px";

playButton = document.getElementById('playButton');
playButton.addEventListener("click", function() {
    iDiv.style.display = "none";
    scene.remove(welcomeText)
});


spaceshipLoader.load('src/medias/models/spaceship.obj', function (object) {
    spaceship = object;
    spaceship.rotation.x = Math.PI / 2;
    spaceship.velocity = {
        x: 0, y: 50,
        vx: 0, vy: 0,
        ax: 0, ay: 0,
        r: 0,
        vrl: 0, vrr: 0,
        arl: 0, arr: 0
    }
    spaceship.children.forEach(function(child) {
        child.material = new THREE.MeshStandardMaterial({color: "#ffffff", flatShading: true, /*  shininess: 0.5 */ roughness: 0.8, metalness: 1});
        //child.computeBoundingBox();
    });
    spaceship.name = "spaceship";
    spaceship.position.z = 0;
    spaceship.scale.set(_gameParameters.spaceshipScale, _gameParameters.spaceshipScale, _gameParameters.spaceshipScale);
    spaceship.size = new THREE.Vector3();
    new THREE.Box3().setFromObject(spaceship).getSize(spaceship.size);
    scene.add(spaceship);
});


missileLoader.load('src/medias/models/missile.obj', function(object) {

    object.traverse(function(child) {
        child.material = new THREE.MeshStandardMaterial({color: "#ffffff", flatShading: true, /*  shininess: 0.5 */ roughness: 0.8, metalness: 1});
    });
    missile = object;
});

window.addEventListener('resize', function() {
    _viewport.scale = window.innerWidth / _viewport.width;
    _viewport.width = window.innerWidth;
    _viewport.height = window.innerHeight;
    _viewport.ratio = _viewport.width / _viewport.height;

    welcomeText.scale = new THREE.Vector3(_viewport.scale, _viewport.scale, _viewport.scale);

    renderer.setSize(_viewport.width, _viewport.height);
    camera.aspect = _viewport.ratio;
    camera.updateProjectionMatrix();
    iDiv.style.left = (_viewport.width / 2) - (iDiv.clientWidth / 2) + "px";
    iDiv.style.top = (_viewport.height) - (iDiv.clientHeight) + "px";
});

var keys = [];
document.addEventListener('keydown', function(e){
        keys[e.which] = true;
});
document.addEventListener('keyup', function(e){
    keys[e.which] = false;
});
document.addEventListener("keypress", function(e) {
    if(e.which == 80) {
        saveAsImage();
    }
});

function shoot() {
        var bullet = missile.clone();
        var matrix = new THREE.Matrix4();
        matrix.extractRotation(spaceship.matrix);
        bullet.rotation = matrix;
        var direction = new THREE.Vector3(-1, 0, 0);
        direction.applyMatrix4(matrix);
        bullet.position.x = spaceship.position.x;
        bullet.position.y = spaceship.position.y;
        bullet.direction = direction;
        bullet.scale.set(_gameParameters.bulletScale, _gameParameters.bulletScale, _gameParameters.bulletScale);
        bullet.rotation.x = spaceship.rotation.x;
        bullet.rotation.y = spaceship.rotation.y + Math.PI *  1.5;
        bullet.vector = bullet.direction.multiplyScalar(_gameParameters.bulletSpeed, _gameParameters.bulletSpeed, _gameParameters.bulletSpeed);
        bullet.spawnTime = Date.now();
        bullet.size =  new THREE.Vector3();
        var box = new THREE.Box3().setFromObject(cube);
        box.getSize(bullet.size);
        bullet.name = "bullet";
        scene.add(bullet)
        bullets.push(bullet);
}



fontLoader = new THREE.FontLoader();
fontLoader.load('src/medias/models/welcomeFont.json', function (font) {
    var textGeo = new THREE.TextBufferGeometry("Space   Runner", {
        font: font,
        size: 40
    });
    textGeo.computeBoundingBox();

    var textMaterial = new THREE.MeshPhongMaterial({ color: 0x555555});
    welcomeText = new THREE.Mesh(textGeo, textMaterial);
    welcomeText.position.z = 200;
    welcomeText.geometry.center();
    welcomeText.position.y += 90;
    scene.add(welcomeText);
});

var params = {
				color1: '#ffffff',
				color2: '#ffa000',
				color3: '#000000',
				colorBias: 0.8,
				burnRate: 0.35,
				diffuse: 1.33,
				viscosity: 0.25,
				expansion: - 0.25,
				swirl: 50.0,
				drag: 0.35,
				airSpeed: 12.0,
				windX: 0.0,
				windY: 0.75,
				speed: 500.0,
				massConservation: false
			};

var controller = {
               speed       : 1.0,
               magnitude   : 3.5,
               lacunarity  : 0.0,
               gain        : 0.5,
               noiseScaleX : 1.0,
               noiseScaleY : 2.0,
               noiseScaleZ : 1.0,
               wireframe   : false
           };

var clock = new THREE.Clock();

var plane = new THREE.PlaneBufferGeometry( 20, 20 );
				fireT = new THREE.Fire( plane, {
					textureWidth: 512,
					textureHeight: 512,
					debug: false
				} );
				fireT.position.z = - 2;
				scene.add( fireT );

var fireTex = THREE.ImageUtils.loadTexture("src/medias/models/index.png");

           var wireframeMat = new THREE.MeshBasicMaterial({
               color : new THREE.Color(0xffffff),
               wireframe : true
           });

           var fire = new THREE.Fire(fireTex);

           var wireframe = new THREE.Mesh(fire.geometry, wireframeMat.clone());
           fire.add(wireframe);
           wireframe.visible = false;
           fire.quaternion.x = 0;
           fire.quaternion.y = 0;
           fire.quaternion.z = 0;
           fire.scale.set(10, 40, 20);
           fire.position.z = 0;
           scene.add(fire);
           fire.material.uniforms.magnitude.value = controller.magnitude;
           fire.material.uniforms.lacunarity.value = controller.lacunarity;



for (var i = 0; i < _gameParameters.starsNumber; i++) {
    let star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread(4000);
    star.y = THREE.Math.randFloatSpread(2000);
    star.z = THREE.Math.randFloatSpread(2000);
    starsGeometry.vertices.push(star);
}
scene.add(starField);

camera.position.z = 500;

function updatePosition() {
    spaceship.velocity.vx += spaceship.velocity.ax;
    spaceship.velocity.vy += spaceship.velocity.ay;
    spaceship.velocity.vrl += spaceship.velocity.arl;   // velocity for rotation left at time = t
    spaceship.velocity.vrr += spaceship.velocity.arr;   // velocity for rotation right at time = t
    spaceship.velocity.vx *= _gameParameters.friction;
    spaceship.velocity.vy *= _gameParameters.friction;
    spaceship.velocity.vrl *= _gameParameters.rotationFriction; // each multiplied by the rotationFriction
    spaceship.velocity.vrr *= _gameParameters.rotationFriction; //  "       "      "   "         "
    spaceship.velocity.x += spaceship.velocity.vx;
    spaceship.velocity.y += spaceship.velocity.vy;
    spaceship.velocity.r += spaceship.velocity.vrr + spaceship.velocity.vrl;    // the sum represents the real rotation of the ship at time = t
}

var update = function() {
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.getInverse(camera.matrixWorld);
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromMatrix(cameraViewProjectionMatrix);
    if(spaceship != null) {
        if(keys[37]) spaceship.velocity.arl = _gameParameters.spaceshipRotationSpeed; else spaceship.velocity.arl = 0;
        if(keys[39]) spaceship.velocity.arr = -_gameParameters.spaceshipRotationSpeed; else spaceship.velocity.arr = 0;
        if(keys[38]){
            spaceship.velocity.ax = -Math.cos(spaceship.velocity.r) * _gameParameters.spaceshipSpeed;
            spaceship.velocity.ay = -Math.sin(spaceship.velocity.r) * _gameParameters.spaceshipSpeed;
            if(fire.material.uniforms.magnitude.value > 0) {
                fire.material.uniforms.magnitude.value -= 0.2;
            }

        } else {
            spaceship.velocity.ax = spaceship.velocity.ay = 0;
            if(fire.material.uniforms.magnitude.value < 3.5) {
                fire.material.uniforms.magnitude.value += 0.2;
            }
        }
        if(keys[32]) {
            if(timestamp + _gameParameters.bulletTimestamp < Date.now()) {
                timestamp = Date.now();
                shoot();
            }
        }
        updatePosition();
        spaceship.position.x = spaceship.velocity.x + spaceship.velocity.x;
        spaceship.position.y = spaceship.velocity.y + spaceship.velocity.y;
        spaceship.rotation.y = spaceship.velocity.r;
        isOutOfScreen(spaceship, frustum);
    }
    var delta = clock.getDelta();
    var t = clock.elapsedTime * controller.speed;
    fire.update(t);
    fire.position.x = spaceship.position.x + spaceship.size.x * Math.cos(spaceship.rotation.y);        // just playing with numbers lol. dont know how did i get here
    fire.position.y = spaceship.position.y + spaceship.size.x * Math.sin(spaceship.rotation.y);

    fire.rotation.x = spaceship.rotation.x;
    fire.rotation.y = spaceship.rotation.y;
    fire.rotation.z = -Math.PI / 2;
    bullets.forEach(function(bullet) {
        if(bullet != null) {
            if(bullet.spawnTime + _gameParameters.bulletLifeTime < Date.now()) {
                scene.remove(bullet);
                bullets[bullets.indexOf(bullet)] = null;
                bullets = bullets.filter(function (el) {
                    return el != null;
                });
            } else {
                bullet.position.x += bullet.vector.x;
                bullet.position.y += bullet.vector.y;
                bullet.position.z += bullet.vector.z;
                isOutOfScreen(bullet, frustum);
                box = new THREE.Box3().setFromObject(bullet);
                asteroids.forEach(function(asteroid) {
                    if(asteroid != null) {
                        asteroidBox = new THREE.Box3().setFromObject(asteroid);
                        if(box.intersectsBox(asteroidBox)) {
                            scene.remove(bullet);
                            bullets[bullets.indexOf(bullet)] = null;
                            bullets = bullets.filter(function (el) {
                                return el != null;
                            });
                            asteroid.collide();
                            console.log(bullets.length, asteroids.length);
                            if(asteroids.length == 0) {
                                iDiv.style.display = "flex";
                            }
                        }
                    }
                });
            }
        }
    });

    asteroids.forEach(function(asteroid) {

        if(spaceship != null && asteroid != null) {
            var box = new THREE.Box3().setFromObject(spaceship);
            var asBox = new THREE.Box3().setFromObject(asteroid);
            if(box.intersectsBox(asBox)) {
                console.log("collision");
            }
        }

        if(asteroid != null) {
            asteroid.position.x += asteroid.vector.x;
            asteroid.position.y += asteroid.vector.y;

            asteroid.rotation.x += _gameParameters.asteroidRotation;
            asteroid.rotation.y += _gameParameters.asteroidRotation;

            isOutOfScreen(asteroid, frustum);
        }
    });

    for(var i = 0; i < starsGeometry.vertices.length; i++) {
        camera.updateMatrix();
        camera.updateMatrixWorld();
        if(!frustum.containsPoint(starsGeometry.vertices[i])) {
            starsGeometry.vertices[i].x = THREE.Math.randFloatSpread(4000);
            starsGeometry.vertices[i].y = THREE.Math.randFloatSpread(2000);
            starsGeometry.vertices[i].z = THREE.Math.randFloatSpread(2000);
        }
        starsGeometry.vertices[i].z += _gameParameters.starsSpeed;
    }
    starsGeometry.verticesNeedUpdate = true;
};

function isOutOfScreen(object, frustum) {
    if(object.name == "spaceship") {
        object.children.forEach(function(child) {
            if(!frustum.intersectsObject(child)) {
                let isX = new THREE.Vector3(object.position.x, 0, object.position.z);
                let isY = new THREE.Vector3(0, object.position.y, object.position.z);

                if(!frustum.containsPoint(isX)) {
                    if(object.position.x > 0) {
                        object.velocity.x = -object.velocity.x + (object.size.x / 4);
                        object.position.x = -object.position.x + (object.size.x / 4);
                    } else {
                        object.velocity.x = -object.velocity.x - (object.size.x / 4);
                        object.position.x = -object.position.x - (object.size.x / 4);
                    }
                }
                if(!frustum.containsPoint(isY)) {
                    if(object.position.y > 0) {
                        object.velocity.y = -object.velocity.y + (object.size.y / 4);
                        object.position.y = -object.position.y + (object.size.y / 4);
                    } else {
                        object.velocity.y = -object.velocity.y - (object.size.y / 4);
                        object.position.y = -object.position.y - (object.size.y / 4);
                    }
                }
            }
        });
    } else if(object.name == "bullet") {
        object.children.forEach(function(child) {
            if(!frustum.intersectsObject(child)) {
                let isX = new THREE.Vector3(object.position.x, 0, object.position.z);
                let isY = new THREE.Vector3(0, object.position.y, object.position.z);

                if(!frustum.containsPoint(isX)) {
                    if(object.position.x > 0) {
                        object.position.x = -object.position.x + (object.size.x / 4);
                    } else {
                        object.position.x = -object.position.x - (object.size.x / 4);
                    }
                }
                if(!frustum.containsPoint(isY)) {
                    if(object.position.y > 0) {
                        object.position.y = -object.position.y + (object.size.y / 4);
                    } else {
                        object.position.y = -object.position.y - (object.size.y / 4);
                    }
                }
            }
        });
    } else {
        if(!frustum.intersectsObject(object)) {
            let isX = new THREE.Vector3(object.position.x, 0, object.position.z);
            let isY = new THREE.Vector3(0, object.position.y, object.position.z);

                if(!frustum.containsPoint(isX)) {
                    if(object.position.x > 0) {
                        object.position.x = -object.position.x + (object.size.x / 2);
                    } else {
                        object.position.x = -object.position.x - (object.size.x / 2);
                    }
                }
                if(!frustum.containsPoint(isY)) {
                    if(object.position.y > 0) {
                        object.position.y = -object.position.y + (object.size.y / 2);
                    } else {
                        object.position.y = -object.position.y - (object.size.y / 2);
                    }
                }
        }
    }

}

function getRandomDirection() {
    return Math.floor(Math.random() * Math.floor(4)) + 1;
}

function getRandom() {
    return Math.random() * 2 - 1;
}

function createAsteroids(){
    var maxWidth = 1000;
    var asteroids = [];
    for(var i = 0; i < 3; i++){
        let asteroid = createRock(_gameParameters.asteroidSize, _gameParameters.asteroidMaxWidth, _gameParameters.asteroidMaxWidth, _gameParameters.asteroidMaxHeight, 0);
        //asteroid.direction = getRandomDirection();
        asteroid.level = 3;
        asteroids.push(asteroid);
    }
    return asteroids;
}

function createRock(size, spreadX, maxWidth, maxHeight, maxDepth){
    geometry = new THREE.DodecahedronGeometry(size, 1);
    geometry.vertices.forEach(function(v){
        v.x += (0 - Math.random() * (size/4));
        v.y += (0 - Math.random() * (size/4));
        v.z += (0 - Math.random() * (size/4));
    });
    var color = '#ffffff';
    color = ColorLuminance(color, 2 + Math.random() * 10);
    texture = new THREE.MeshStandardMaterial({
        color: color,
        flatShading: true,
        //   shininess: 0.5,
        roughness: 0.8,
        metalness: 1
    });
    cube = new THREE.Mesh(geometry, texture);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.scale.set(1, 1, 1);

    var x = spreadX/2-Math.random()*spreadX;
    var centeredness = 1-(Math.abs(x)/(maxWidth/2));
    var y = (maxHeight/2-Math.random()*maxHeight)*centeredness
    var z = 0
    cube.position.set(x,y,z)
    cube.r = {};
    cube.r.x = Math.random() * 0.005;
    cube.r.y = Math.random() * 0.005;
    cube.r.z = 0;
    scene.add(cube);
    cube.size =  new THREE.Vector3();
    var box = new THREE.Box3().setFromObject(cube);
    box.getSize(cube.size);
    cube.name = "Asteroid";
    cube.geometry.computeBoundingBox();
    cube.direction = new THREE.Vector3(getRandom(), getRandom(), 0);
    cube.vector = cube.direction.multiplyScalar(_gameParameters.asteroidSpeed, _gameParameters.asteroidSpeed, 0);
    cube.collide = function() {
        var rock, size, lastLife;
        switch (this.level) {
            case 3:
                size = _gameParameters.asteroidMidleSize;
                lastLife = false;
            break;
            case 2:
                size = _gameParameters.asteroidMinSize;
                lastLife = false;
            break;
            case 1:
                lastLife = true;
            default:

        }
        if(!lastLife) {
            for(var i = 0; i < _gameParameters.asteroidDivideNumer; i++) {
                rock = createRock(size, _gameParameters.asteroidMaxWidth, _gameParameters.asteroidMaxWidth, _gameParameters.asteroidMaxHeight, 0);
                rock.level = this.level - 1;
                rock.position.set(this.position.x, this.position.y, this.position.z);
                asteroids.push(rock);
            }
        }
        scene.remove(this);
        asteroids[asteroids.indexOf(this)] = null;
        asteroids = asteroids.filter(function (el) {
            return el != null;
        });
    };
    return cube;
};

function ColorLuminance(hex, lum) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    var rgb = "#", c, i;
    for (var i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}


function saveAsImage() {
    var imgData, imgNode;
    try {
        var strMime = "image/jpeg";
        var strDownloadMime = "image/octet-stream";
        imgData = renderer.domElement.toDataURL(strMime);
        saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");
    } catch (e) {
        return;
    }
};

var saveFile = function (strData, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link);
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link);
    } else {
        location.replace(uri);
    }
};

var render = function() {
    renderer.render(scene, camera);
};

var GameLoop = function() {
    requestAnimationFrame(GameLoop);
    update();
    render();
}
GameLoop();
