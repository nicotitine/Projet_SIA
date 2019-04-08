"use strict";
var isLoading = true;
javascript: (function() {
    var script = document.createElement('script');
    script.onload = function() {
        var stats = new Stats();
        document.body.appendChild(stats.dom);
        requestAnimationFrame(function loop() {
            stats.update();
            requestAnimationFrame(loop)
        });
    };
    script.src = 'src/lib/stats.js';
    document.head.appendChild(script);
})()


var eventHandler = new EventHandler();
var storageHandler = new StorageHandler();
var _viewport = new Viewport();
var gameParameters = new GameParameters();
var gameUI;
var textureHandler = new TextureHandler();
var gameCore;
var composer, renderScene, bloomPass;
var outlinePass;

window.addEventListener('load', function() {
    gameCore = new GameCore();
    storageHandler.load()
    gameUI = new GameUI(_viewport.width / 2, _viewport.height / 2);
    renderScene = new THREE.RenderPass( gameCore.scene, gameCore.cameraHandler.camera );

    bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1, 0, -1. )
    bloomPass.renderToScreen = true;

    composer = new THREE.EffectComposer( renderer )
    composer.setSize( window.innerWidth, window.innerHeight )
    composer.addPass( renderScene )
    composer.addPass( bloomPass )

    setTimeout(function() {
        $("#preLoader").fadeOut(1000, function() {
            isLoading = false;
        });
        gameUI.displayFromStorage();
        gameUI.showWelcome();
    }, 1000);

    document.body.appendChild(renderer.domElement);

});

var timestamp = Date.now();

var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.context.disable(renderer.context.DEPTH_TEST);
renderer.sortObjects = false;
renderer.gammaOutput = true;
renderer.gammaInput = true;
renderer.autoClear = false;

var points = 0;
var pointsString = "";
var timestampPoints = Date.now();
var update = function() {
    if (isLoading && timestampPoints + 500 < Date.now()) {
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

    if (gameCore != null) {
        gameCore.update();
    }
};

function getBigger(_numbers) {
    var bigger = 0;
    _numbers.forEach(function(_number) {
        if (_number > bigger) {
            bigger = _number;
        }
    });
    return bigger;
}

function addZeroToDate(_x) {
    if (x < 10)
        return "0" + _x;
    return x;
}

function saveAsImage() {
    var imgData, imgNode;
    var date = new Date();

    try {
        var strMime = "image/jpeg";
        var strDownloadMime = "image/octet-stream";
        imgData = renderer.domElement.toDataURL(strMime);
        saveFile(imgData.replace(strMime, strDownloadMime), "SpaceshipRunner (" + addZeroToDate(date.getDate()) + addZeroToDate(date.getMonth() + 1) + (1900 + date.getYear()) + addZeroToDate(date.getHours()) + addZeroToDate(date.getMinutes()) + addZeroToDate(date.getSeconds()) + ").jpg");
    } catch (e) {
        return;
    }
};

var saveFile = function(_strData, _filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link);
        link.download = _filename;
        link.href = _strData;
        link.click();
        document.body.removeChild(link);
    } else {
        location.replace(uri);
    }
};

var render = function() {
    requestAnimationFrame(render);

    if (gameCore != null) {
        renderer.clear();

        renderScene.camera.layers.set(1);
        update();
        composer.render();

        renderer.clearDepth();
        renderScene.camera.layers.set(0);
        renderer.render(gameCore.scene, gameCore.cameraHandler.camera);
    }
};

var GameLoop = function() {
    render();
}
render();
