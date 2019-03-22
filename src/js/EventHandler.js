class EventHandler {
    constructor() {
        this.keys = [];
        this.jokerCheatTimestamp = Date.now();

        window.addEventListener('resize', function() {
            _viewport.scale = window.innerWidth / _viewport.width;
            _viewport.width = window.innerWidth;
            _viewport.height = window.innerHeight;
            _viewport.ratio = _viewport.width / _viewport.height;

            renderer.setSize(_viewport.width, _viewport.height);
            gameCore.cameraHandler.resize();
            gameUI.size(_viewport.width, _viewport.height, gameUI.fullScreenElements);
        }.bind(this));

        document.addEventListener('keydown', function(e) {
            this.keys[e.which] = true;
            if (e.key == "Escape") {
                gameUI.showEscape();
            }
        }.bind(this), false);

        document.addEventListener('keyup', function(e) {
            this.keys[e.which] = false;
        }.bind(this), false);

        document.addEventListener("keypress", function(e) {
            if (e.key == "0") {
                gameCore.cameraHandler.cameraType = gameCore.cameraHandler.cameraTypes.FIXED;
            }
            if (e.key == "1") {
                gameCore.cameraHandler.cameraType = gameCore.cameraHandler.cameraTypes.MOVING;
            }
            if (e.key == "0") {
                gameCore.cameraHandler.changeToFixed();
            }
            if (e.key == "1") {
                gameCore.cameraHandler.changeToMoving();
            }
            if (e.key == "2") {
                gameCore.cameraHandler.changeToPursuit();
            }
            if (e.key == "p" || e.key == "P") {
                saveAsImage();
                gameUI.showEscape();
            }
            if ((e.key == "k" || e.key == "K") && !gameUI.isLevelingUp && !gameUI.isPaused) {
                gameCore.levelUp(true);
            }
            if (e.key == "h" || e.key == "H") {
                gameUI.showHelp();
            }
            if (e.key == "i" || e.key == "I") {
                if (gameCore.spaceship.shield.isActivated) {
                    gameCore.spaceship.isInvincible = false;
                    gameCore.spaceship.shield.desactivate();
                } else
                    gameCore.spaceship.isInvincible = true;
            }
            if ((e.key == "j" || e.key == "J") && this.jokerCheatTimestamp + 1000 < Date.now()) {
                this.jokerCheatTimestamp = Date.now();
                gameCore.jokers.spawn();
            }
        }.bind(this), false);
    }
}
