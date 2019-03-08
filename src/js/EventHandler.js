class EventHandler {
    constructor() {
        this.keys = [];
        var _this = this;
        window.addEventListener('resize', function() {
            _viewport.scale = window.innerWidth / _viewport.width;
            _viewport.width = window.innerWidth;
            _viewport.height = window.innerHeight;
            _viewport.ratio = _viewport.width / _viewport.height;

            renderer.setSize(_viewport.width, _viewport.height);
            cameraHandler.resize();
            gameUI.size(_viewport.width, _viewport.height, gameUI.fullScreenElements);
        });

        document.addEventListener('keydown', function(e){
                _this.keys[e.which] = true;
                if(e.key == "Escape") {
                    gameUI.showEscape();
                }
        });
        document.addEventListener('keyup', function(e){
            _this.keys[e.which] = false;
        });

        document.addEventListener("keypress", function(e) {
            if(e.key == "0") {
                cameraHandler.cameraType = cameraHandler.cameraTypes.FIXED;
            }
            if(e.key == "1") {
                cameraHandler.cameraType = cameraHandler.cameraTypes.MOVING;
            }
            if(e.key == "0") {
                cameraHandler.changeToFixed();
            }
            if(e.key == "1") {
                cameraHandler.changeToMoving();
            }
            if(e.key == "2") {
                cameraHandler.changeToPursuit();
            }
            if(e.key == "p" || e.key == "P") {
                saveAsImage();
                gameUI.showEscape();
            }
            if((e.key == "k" || e.key == "K") && !gameUI.isLevelingUp && !gameUI.isPaused) {
                levelUp(true);
            }
            if(e.key == "h" || e.key == "H") {
                gameUI.showHelp();
            }
            if(e.key == "i" || e.key == "I") {
                if(_spaceship.shield.isOn)
                    _spaceship.shield.desactivate();
                else
                    _spaceship.shield.activate();
            }
        });
    }
}
