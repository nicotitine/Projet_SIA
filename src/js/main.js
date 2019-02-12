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

var geometry = new THREE.BoxGeometry(150,150,50);
var cubeMaterials = [
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('src/medias/images/1.jpg'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('src/medias/images/2.jpg'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('src/medias/images/3.jpg'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('src/medias/images/4.jpg'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('src/medias/images/5.jpg'), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('src/medias/images/6.jpg'), side: THREE.DoubleSide})
];

var material = new THREE.MeshBasicMaterial(0xFFFFFF);
var cube = new THREE.Mesh(geometry, cubeMaterials);
var starsGeometry = new THREE.Geometry();
var starsMaterial = new THREE.PointsMaterial( { color: 0xffffff } );
var starField = new THREE.Points( starsGeometry, starsMaterial );

var ambient = new THREE.AmbientLight( 0xffffff );
scene.add( ambient );
var light;
var iDiv = document.createElement('div');
var pseudoInputElement = document.createElement('input');
var welcomeText;

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
    spaceship = object3d;
    console.log(object3d);
    object3d.scale.x = 1;
    object3d.scale.y = 1;
    object3d.scale.z = 1;
	scene.add(object3d);
});



// initialize object to perform world/screen calculations


// when the mouse moves, call the given function
document.addEventListener('mousemove', onDocumentMouseMove, false);

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

controls = new THREE.FlyControls( camera );
				controls.movementSpeed = 1000;
				controls.domElement = renderer.domElement;
				controls.rollSpeed = Math.PI / 24;
				controls.autoForward = false;
				controls.dragToLook = false;


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

    cube.position.x += 15;
    cube.position.y += 10;
    if(spaceship != null) {
        spaceship.position.x += 10;
        spaceship.position.y += 5;
    }


    if(!frustum.intersectsObject(cube)) {
        let isX = new THREE.Vector3(cube.position.x, 0, cube.position.z);
        let isY = new THREE.Vector3(0, cube.position.y, cube.position.z);
        if(!frustum.containsPoint(isX)) {;
            cube.position.x = -cube.position.x +100;
        }
        if(!frustum.containsPoint(isY)) {
            cube.position.y = -cube.position.y +100;
        }
    }

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

function onDocumentMouseMove(event) {
  // the following line would stop any other event handler from firing
  // (such as the mouse's TrackballControls)
  // event.preventDefault();

  // update the mouse variable
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
