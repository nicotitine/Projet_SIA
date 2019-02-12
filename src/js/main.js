javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='src/lib/stats.js';document.head.appendChild(script);})()
var width = window.innerWidth;
var height = window.innerHeight;
var scene = new THREE.Scene();
var ratio = width / height;
var camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000);
var renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
var raycaster = new THREE.Raycaster(); // create once
var mouse = new THREE.Vector2(); // create once
var intersect = null;
var clock = new THREE.Clock();
var spaceship;


var directions = {
    NE : 1,
    SE : 2,
    SO : 3,
    NO : 4
};



var starsGeometry = new THREE.Geometry();
var starsMaterial = new THREE.PointsMaterial( { color: 0xffffff } );
var starField = new THREE.Points( starsGeometry, starsMaterial );

var ambient = new THREE.AmbientLight( 0xffffff );
scene.add( ambient );
var light;
var iDiv = document.createElement('div');
var pseudoInputElement = document.createElement('input');
var welcomeText;
var asteroids = createAsteroids();

light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
light.position.set( 0, 1500, 1000 );
light.target.position.set( 0, 0, 0 );
light.castShadow = true;
light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );
light.shadow.bias = 0.0001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 1024;
scene.add( light );

renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

pseudoInputElement.class = "input";
pseudoInputElement.id = "pseudoInputElement";
pseudoInputElement.placeholder = "Pseudo...";

iDiv.class = "container";
iDiv.id = "welcome";
iDiv.innerHTML += "<a href='#' id='playButton'>Jouer</a><a href='#' id='scoresButton'>Scores</a><a href='#' id='optionsButton'>Options</a>";

document.body.appendChild(iDiv);

console.log(iDiv.clientWidth);

iDiv.style.left = (width / 2) - (iDiv.clientWidth / 2) + "px";

var playButton = document.getElementById('playButton');
playButton.addEventListener("click", function() {
    iDiv.style.display = "none";
    scene.remove(welcomeText)
});


THREEx.SpaceShips.loadSpaceFighter02(function(object3d){
    object3d.scale.x = 1;
    object3d.scale.y = 1;
    object3d.scale.z = 1;
    object3d.position.z = 0;
    object3d.traverse( function ( child ) {
        scene.add(child);
        spaceship = child;
        child.rotation.x = Math.PI / 2;
        var box = new THREE.Box3().setFromObject( spaceship );
        child.size = box.getSize();
    });

    console.log(spaceship);

});



// initialize object to perform world/screen calculations


// when the mouse moves, call the given function


window.addEventListener('resize', function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width  / height;
    camera.updateProjectionMatrix();
});

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 80) {
        saveAsImage();
    }
}


var loader = new THREE.FontLoader();
loader.load( 'src/medias/models/welcomeFont.json', function ( font ) {
    var textGeo = new THREE.TextBufferGeometry( "Space Runner", {
        font: font,
        size: 200,
        curveSegments: 20
    } );
    textGeo.computeBoundingBox();
    var centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    var textMaterial = new THREE.MeshPhongMaterial( { color: 0x888888} );
    welcomeText = new THREE.Mesh( textGeo, textMaterial );


    welcomeText.position.z = 100;
    welcomeText.geometry.center();
    welcomeText.position.y += 400;
    scene.add( welcomeText );
} );

scene.add(cube);

for ( var i = 0; i < 2000; i ++ ) {
    let star = new THREE.Vector3();
    star.x = THREE.Math.randFloatSpread( 4000 );
    star.y = THREE.Math.randFloatSpread( 2000 );
    star.z = THREE.Math.randFloatSpread( 2000 );

    starsGeometry.vertices.push( star );
}
scene.add( starField );
camera.position.z = 1900;

var update = function() {
    var frustum = new THREE.Frustum();
    var cameraViewProjectionMatrix = new THREE.Matrix4();
    var delta = clock.getDelta();

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( scene.children);

    if(intersects.length > 0) {
        intersect = intersects[0].object;
        if(intersect.name == "play" || intersect.name == "leave") {
            intersect.material.color.setHex(0xffff00);
        }
    } else {
        if(intersect != null && (intersect.name == "play" || intersect.name == "leave")) {
            intersect.material.color.setHex(0xffffff);
            intersect = null;
        }
    }

    camera.updateMatrixWorld();
    camera.matrixWorldInverse.getInverse( camera.matrixWorld );
    cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
    frustum.setFromMatrix( cameraViewProjectionMatrix );


    if(spaceship != null) {
        spaceship.position.x += 18;
        spaceship.position.y += 5;
        spaceship.rotation.y += 0.01;
        isOutOfScreen(spaceship, frustum);
    }

    asteroids.forEach(function(asteroid) {
        switch(asteroid.direction) {
            case directions.NE :
                asteroid.position.x += 15;
                asteroid.position.y += 10;
            break;
            case directions.SE :
                asteroid.position.x += 15;
                asteroid.position.y += -10;
            break;
            case directions.SO :
                asteroid.position.x += -15;
                asteroid.position.y += -10;
            break;
            case directions.NO :
                asteroid.position.x += -15;
                asteroid.position.y += 10;
            break;
        }

        asteroid.rotation.x += 0.01;
        asteroid.rotation.y += 0.01;
        isOutOfScreen(asteroid, frustum);
    });




    for(var i = 0; i < starsGeometry.vertices.length; i++) {
        camera.updateMatrix();
        camera.updateMatrixWorld();

        if(!frustum.containsPoint(starsGeometry.vertices[i])) {
            starsGeometry.vertices[i].x = THREE.Math.randFloatSpread( 4000 );
            starsGeometry.vertices[i].y = THREE.Math.randFloatSpread( 2000 );
            starsGeometry.vertices[i].z = THREE.Math.randFloatSpread( 2000 );
        }
        starsGeometry.vertices[i].z += 2;
    }
    starsGeometry.verticesNeedUpdate = true;
};

function isOutOfScreen(object, frustum) {
    if(!frustum.intersectsObject(object)) {
        let isX = new THREE.Vector3(object.position.x, 0, object.position.z);
        let isY = new THREE.Vector3(0, object.position.y, object.position.z);
        if(!frustum.containsPoint(isX)) {;
            object.position.x = -object.position.x + (object.size.x / 2);
        }
        if(!frustum.containsPoint(isY)) {
            object.position.y = -object.position.y + (object.size.y / 2);
        }
    }
}

function getRandomDirection() {
    return Math.floor(Math.random() * Math.floor(4)) + 1;
}

function createAsteroids(){
    var maxWidth = 1000;
    var asteroids = [];
    for(var i=0;i<7;i++){
        let asteroid = createRock(100,4000,4000,2000,0);
        asteroid.direction = getRandomDirection();
        asteroids.push(asteroid);
    }
    return asteroids;
}

function createRock(size,spreadX,maxWidth,maxHeight,maxDepth){
    geometry = new THREE.DodecahedronGeometry(size, 1);
  geometry.vertices.forEach(function(v){
    v.x += (0-Math.random()*(size/4));
    v.y += (0-Math.random()*(size/4));
    v.z += (0-Math.random()*(size/4));
  })
  var color = '#111111';
  color = ColorLuminance(color,2+Math.random()*10);
    texture = new THREE.MeshStandardMaterial({color:color,
                                        flatShading: true,
                                     //   shininess: 0.5,
                                            roughness: 0.8,
                                            metalness: 1
                                        });

    cube = new THREE.Mesh(geometry, texture);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.scale.set(1, 1, 1);
    //cube.rotation.y = Math.PI/4;
    //cube.rotation.x = Math.PI/4;
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
    var box = new THREE.Box3().setFromObject( cube );
    cube.size = box.getSize();
  return cube;
};

function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
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
            console.log(e);
            return;
        }
    }

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
    }

// draw scene
var render = function() {
    renderer.render(scene, camera);
};

// run game loop
var GameLoop = function() {
    requestAnimationFrame(GameLoop);
    update();
    render();
}
GameLoop();
