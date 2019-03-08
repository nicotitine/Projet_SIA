"use strict";
var isLoading = true;
javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='src/lib/stats.js';document.head.appendChild(script);})()


var eventHandler = new EventHandler();
var storage = new Storage();
var _viewport = new Viewport();
var _gameParameters = new GameParameters();
var gameUI;
var audioHandler = new AudioHandler();
var jokers = new Jokers();
var gui;
var textureHandler = new TextureHandler();
var _spaceship = new Spaceship();
var bulletLoader = new BulletLoader();
//var jokerLoader = new JokerLoader();
var starfield = new Starfield(_gameParameters.starfield.number, _gameParameters.starfield.spread);



window.addEventListener('load', function() {
    storage.load()
    gameUI = new GameUI(_viewport.width / 2, _viewport.height / 2);
    setTimeout(function() {
        $("#preLoader").fadeOut(1000, function() {
            isLoading = false;
        });
        gameUI.displayFromStorage();
        gameUI.showWelcome();
    }, 1000);
    document.body.appendChild(renderer.domElement);
    gui = new dat.GUI({hideable: false});
    changeSlider($("#valueSliderMusic"), $("#sliderMusic"));
    changeSlider($("#valueSliderSound"), $("#sliderSound"));
    audioHandler.changeMusicVolume(Number($("#sliderMusic").val()) / 100);
    audioHandler.changeSoundVolume(Number($("#sliderSound").val()) / 100);
    $("#sliderMusic").on('input change', function(e) {
        changeSlider($("#valueSliderMusic"), $("#sliderMusic"));
        audioHandler.changeMusicVolume(Number($("#sliderMusic").val()) / 100);
        storage.save();
    });
    $('#sliderSound').on('input change', function() {
        changeSlider($('#valueSliderSound'), $('#sliderSound'));
        audioHandler.changeSoundVolume(Number($("#sliderSound").val()) / 100);
        storage.save();
    });
});



var changeSlider = function($label, $slider) {
    var newValue = $slider.val();
    $label.text(newValue);

    if(newValue > 66) {
        $slider.addClass("max");
    } else {
        $slider.removeClass("max");
    }

    if(newValue > 32 && newValue < 67) {
        $slider.addClass('mid');
    } else {
        $slider.removeClass('mid');
    }

    if(newValue < 33) {
        $slider.addClass('min');
    } else {
        $slider.removeClass('min');
    }

    if(newValue == 0) {
        $slider.addClass('muted');
    } else {
        $slider.removeClass('muted');
    }
}






var timestamp = Date.now();

var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({antialias: _gameParameters.antialias, preserveDrawingBuffer: true});
var cameraHandler = new CameraHandler();

var bullets = [], explosions = [];



var asteroids = createAsteroids();
//var asteroid = new Asteroid(_gameParameters.asteroidMaxWidth, _gameParameters.asteroidMaxWidth, _gameParameters.asteroidMaxHeight, 0, null, 3);

renderer.setSize(_viewport.width, _viewport.height);
renderer.context.getShaderInfoLog = function () { return '' };


function levelUp(isCheat) {
    _spaceship.shield.desactivate();
    if(!gameUI.isLevelingUp) {
        if(isCheat) {
            gameUI.isLevelingUp = true;
            asteroids.forEach(function(asteroid) {
                var explosion = new Explosion(asteroid.position.x, asteroid.position.y, asteroid.position.z);
                audioHandler.explosionSound.play();
                scene.remove(asteroid);
                asteroids[asteroids.indexOf(asteroid)] = null;
                asteroids = asteroids.filter(function (el) {
                    return el != null;
                });
            })
            setTimeout(function() {
                _gameParameters.level += 1;
                _gameParameters.asteroidSpeed *= 1.2;
                _gameParameters.asteroidNumber += 1;
                gameUI.showLevelUp(isCheat);
                asteroids = createAsteroids();
            }, 2000);
        } else {

            setTimeout(function() {
                _gameParameters.level += 1;
                _gameParameters.asteroidSpeed *= 1.2;
                _gameParameters.asteroidNumber += 1;
                gameUI.showLevelUp(isCheat);
                asteroids = createAsteroids();
            }, 1000);
        }
    }
}



scene.add(starfield);
var points = 0;
var pointsString = "";
var timestampPoints = Date.now();
var update = function() {
    if(isLoading && timestampPoints + 500 < Date.now()) {
        points++;
        switch (points % 4) {
            case 0:

            break;
            case 1:
                pointsString = ".";
            break;
            case 2:
                pointsString = "..";
            break;
            case 3:
                pointsString = "...";
            break;
            default:
        }
        $("#loading").text("Loading" + pointsString);
        timestampPoints = Date.now();
    }

    if(_spaceship != null && !_spaceship.isHitted)
        cameraHandler.update();

    if(_spaceship.isLoaded)
        _spaceship.update();

    if(starfield != null)
        starfield.update(cameraHandler.frustum, _gameParameters.starfield.speed, _gameParameters.starfield.spread);

    asteroids.forEach(function(asteroid) {
        asteroid.update();
    });

    if(gameUI != null && gameUI.isGameLaunched) {
        jokers.update();
    }
};

function getBigger(numbers) {
    var bigger = 0;
    numbers.forEach(function(number) {
        if(number > bigger) {
            bigger = number;
        }
    });
    return bigger;
}

function createAsteroids(){
    var asteroids = [];
    for(var i = 0; i < _gameParameters.asteroidNumber; i++){
        let asteroid = new Asteroid(_gameParameters.asteroidMaxWidth, _gameParameters.asteroidMaxWidth, _gameParameters.asteroidMaxHeight, 0, null, 3);
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
    var z = 0;
    cube.position.set(x,y,z)
    cube.r = {};
    cube.r.x = Math.random() * 0.005;
    cube.r.y = Math.random() * 0.005;
    cube.r.z = Math.random() * 0.005;
    scene.add(cube);
    cube.size =  new THREE.Vector3();
    var box = new THREE.Box3().setFromObject(cube);
    box.getSize(cube.size);
    cube.name = "Asteroid";
    cube.geometry.computeBoundingBox();
    cube.direction = new THREE.Vector3(getRandom(1), getRandom(1), 0);
    cube.vector = cube.direction.multiplyScalar(_gameParameters.asteroidSpeed, _gameParameters.asteroidSpeed, 0);
    cube.collide = function() {

    };
    return cube;
};

function rebuildGame() {
    scene.remove(_spaceship);
    scene.remove(_spaceship.shield);
    scene.remove(_spaceship.fire.fire);
    asteroids.forEach(function(asteroid) {
        scene.remove(asteroid);
    });
    _spaceship.bullets.forEach(function(bullet) {
        scene.remove(bullet);
    });
    _spaceship = new Spaceship(scene);
    asteroids = createAsteroids();
}

function addZeroToDate(x) {
    if(x < 10)
        return "0" + x;
    return x;
}
function saveAsImage() {
    var imgData, imgNode;
    var date = new Date();

    try {
        var strMime = "image/jpeg";
        var strDownloadMime = "image/octet-stream";
        imgData = renderer.domElement.toDataURL(strMime);
        saveFile(imgData.replace(strMime, strDownloadMime), "SpaceshipRunner (" + addZeroToDate(date.getDate()) +  addZeroToDate(date.getMonth() + 1) + (1900 + date.getYear()) + addZeroToDate(date.getHours()) + addZeroToDate(date.getMinutes()) + addZeroToDate(date.getSeconds()) + ").jpg");
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
    renderer.render(scene, cameraHandler.camera);
};

var GameLoop = function() {
    requestAnimationFrame(GameLoop);
    update();
    render();
}
GameLoop();
