"use strict";
var isLoading = true;
javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='src/lib/stats.js';document.head.appendChild(script);})()


var eventHandler = new EventHandler();
var storage = new Storage();
var _viewport = new Viewport();
var gameParameters = new GameParameters();
var gameUI;


var gui;
var textureLoader = new TextureLoader();

var gameCore;






window.addEventListener('load', function() {
    gameCore = new GameCore();
    storage.load()
    gameUI = new GameUI(_viewport.width / 2, _viewport.height / 2);
    setTimeout(function() {
        $("#preLoader").fadeOut(1000, function() {
            isLoading = false;
        });
        gameUI.displayFromStorage();
        gameUI.showWelcome();
    }, 1000);

    //renderer.setPixelRatio(0.7);
    document.body.appendChild(renderer.domElement);
    gui = new dat.GUI({hideable: false});

});








var timestamp = Date.now();


var renderer = new THREE.WebGLRenderer({antialias: gameParameters.antialias, preserveDrawingBuffer: true});





//var asteroid = new Asteroid(gameParameters.asteroidMaxWidth, gameParameters.asteroidMaxWidth, gameParameters.asteroidMaxHeight, 0, null, 3);

renderer.setSize(_viewport.width, _viewport.height);
//renderer.context.getShaderInfoLog = function () { return '' };







var points = 0;
var pointsString = "";
var timestampPoints = Date.now();
var update = function() {
    if(isLoading && timestampPoints + 500 < Date.now()) {
        points++;
        switch (points % 4) {
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

    if(gameCore != null) {
        gameCore.update();
    }
    renderer.renderLists.dispose();
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
    if(gameCore != null)
        renderer.render(gameCore.scene, gameCore.cameraHandler.camera);
};

var GameLoop = function() {
    requestAnimationFrame(GameLoop);
    update();
    render();
}
GameLoop();
