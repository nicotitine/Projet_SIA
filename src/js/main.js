javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='src/lib/stats.js';document.head.appendChild(script);})()

var _gameParameters = {
    friction: 0.98,
    bulletSpeed : 4,
    bulletScale: 0.05,
    bulletTimestamp: 500,
    spaceshipRotationSpeed: 0.05,
    spaceshipSpeed: 0.1,
    asteroidSpeed: 2,
    asteroidSize: 30,
    asteroidMaxWidth: 900,
    asteroidMaxHeight: 500,
    starsNumber: 2000,
    asteroidRotation: 0.01,
    antialias: true,
    spaceshipScale: 0.2,
    starsSpeed: 2
}

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
var missileGeometry = [], missileTexture;
var fontLoader = new THREE.FontLoader();

light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI);
light.position.set(0, 0, 100);
light.target.position.set(0, 0, 0);


scene.add(ambient);
scene.add(light);

renderer.setSize(_viewport.width, _viewport.height);

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
    object.traverse(function(child) {

    });
    spaceship = object;
    console.log(spaceship);
    spaceship.rotation.x = Math.PI / 2;
    //spaceship.geometry.computeBoundingBox();
    spaceship.velocity = {
        x: 0, y: 50,
        vx: 0, vy: 0,
        ax: 0, ay: 0,
        r: 0
    }
    spaceship.children.forEach(function(child) {
        child.material = new THREE.MeshStandardMaterial({color: "#ffffff", flatShading: true, /*  shininess: 0.5 */ roughness: 0.8, metalness: 1});
    });
    spaceship.name = "spaceship";
    spaceship.position.z = 0;
    spaceship.scale.set(_gameParameters.spaceshipScale, _gameParameters.spaceshipScale, _gameParameters.spaceshipScale);
    spaceship.size =  new THREE.Box3().setFromObject(spaceship).getSize();
    scene.add(spaceship);
});


missileLoader.load('src/medias/models/missile.obj', function(object) {
    object.traverse(function(child) {
        missileGeometry.push(child.geometry);
    });
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
    missileGeometry.forEach(function(missile) {
        var bullet = new THREE.Mesh(missile, new THREE.MeshStandardMaterial({color: "#ffffff", flatShading: true, /*  shininess: 0.5 */ roughness: 0.8, metalness: 1}));
        bullet.geometry.computeBoundingBox();
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
        scene.add(bullet);
        bullets.push(bullet);
    }) ;

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
    spaceship.velocity.vx *= _gameParameters.friction;
    spaceship.velocity.vy *= _gameParameters.friction;
    spaceship.velocity.x += spaceship.velocity.vx;
    spaceship.velocity.y += spaceship.velocity.vy;
}

var update = function() {
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.getInverse(camera.matrixWorld);
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromMatrix(cameraViewProjectionMatrix);
    if(spaceship != null) {
        if(keys[37]) spaceship.velocity.r += _gameParameters.spaceshipRotationSpeed;
        if(keys[39]) spaceship.velocity.r -= _gameParameters.spaceshipRotationSpeed;
        if(keys[38]){
            spaceship.velocity.ax = -Math.cos(spaceship.velocity.r) * _gameParameters.spaceshipSpeed;
            spaceship.velocity.ay = -Math.sin(spaceship.velocity.r) * _gameParameters.spaceshipSpeed;
        } else {
            spaceship.velocity.ax = spaceship.velocity.ay = 0;
        }
        if(keys[32]) {
            if(timestamp + _gameParameters.bulletTimestamp < Date.now()) {
                timestamp = Date.now();
                shoot();
            }
        }
        updatePosition(spaceship);
        spaceship.position.x = spaceship.velocity.x;
        spaceship.position.y = spaceship.velocity.y;
        spaceship.rotation.y = spaceship.velocity.r;
        isOutOfScreen(spaceship, frustum);
    }

    bullets.forEach(function(bullet) {
        bullet.position.x += bullet.vector.x;
        bullet.position.y += bullet.vector.y;
        bullet.position.z += bullet.vector.z;

    });

    asteroids.forEach(function(asteroid) {

        if(spaceship != null) {
            var box = new THREE.Box3().setFromObject(spaceship);
            var asBox = new THREE.Box3().setFromObject(asteroid);
            if(box.intersectsBox(asBox)) {
                console.log("collision");
            }
        }


        asteroid.position.x += asteroid.vector.x;
        asteroid.position.y += asteroid.vector.y;

        asteroid.rotation.x += _gameParameters.asteroidRotation;
        asteroid.rotation.y += _gameParameters.asteroidRotation;

        isOutOfScreen(asteroid, frustum);
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
    //console.log(object);
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
    for(var i = 0; i < 7; i++){
        let asteroid = createRock(_gameParameters.asteroidSize, _gameParameters.asteroidMaxWidth, _gameParameters.asteroidMaxWidth, _gameParameters.asteroidMaxHeight, 0);
        //asteroid.direction = getRandomDirection();
        asteroids.push(asteroid);
        asteroid.geometry.computeBoundingBox();
        asteroid.direction = new THREE.Vector3(getRandom(), getRandom(), 0);
        asteroid.vector = asteroid.direction.multiplyScalar(_gameParameters.asteroidSpeed, _gameParameters.asteroidSpeed, 0);
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
    var box = new THREE.Box3().setFromObject(cube);
    cube.size = box.getSize();
    cube.name = "Asteroid";
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
