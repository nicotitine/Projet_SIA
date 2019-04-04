class EventHandler {
    constructor() {
        this.keys = [];
        this.jokerCheatTimestamp = Date.now();

        window.addEventListener('resize', function() {
            _viewport.scale = window.innerWidth / _viewport.width;
            _viewport.width = window.innerWidth;
            _viewport.height = window.innerHeight;
            _viewport.ratio = _viewport.width / _viewport.height;
            gameCore.cameraHandler.resize(_viewport.ratio);

            renderer.setSize(_viewport.width, _viewport.height);
            composer.setSize(_viewport.width, _viewport.height);
            bloomPass.setSize(_viewport.width, _viewport.height);
        }.bind(this));

        document.addEventListener('keydown', function(_e) {
            this.keys[_e.which] = true;
            if (_e.key == "Escape") {
                gameUI.showEscape();
            }
        }.bind(this), false);

        document.addEventListener('keyup', function(_e) {
            this.keys[_e.which] = false;
        }.bind(this), false);

        document.addEventListener("keypress", function(_e) {
            if (_e.key == "0") {
                gameCore.cameraHandler.cameraType = gameCore.cameraHandler.cameraTypes.FIXED;
            }
            if (_e.key == "1") {
                gameCore.cameraHandler.cameraType = gameCore.cameraHandler.cameraTypes.MOVING;
            }
            if (_e.key == "0") {
                gameCore.cameraHandler.changeToFixed();
            }
            if (_e.key == "1") {
                gameCore.cameraHandler.changeToMoving();
            }
            if (_e.key == "2") {
                gameCore.cameraHandler.changeToPursuit();
            }
            if (_e.key == "p" || _e.key == "P") {
                saveAsImage();
                gameUI.showEscape();
            }
            if ((_e.key == "k" || _e.key == "K") && !gameUI.isLevelingUp && !gameUI.isPaused) {
                gameCore.levelUp(true);
            }
            if (_e.key == "h" || _e.key == "H") {
                gameUI.showHelp();
            }
            if (_e.key == "i" || _e.key == "I") {
                if (gameCore.spaceship.shield.isActivated) {
                    gameCore.spaceship.isInvincible = false;
                    gameCore.spaceship.shield.desactivate();

                } else {
                    gameCore.spaceship.isInvincible = true;
                }
            }
            if ((_e.key == "j" || _e.key == "J") && this.jokerCheatTimestamp + 1000 < Date.now()) {
                this.jokerCheatTimestamp = Date.now();
                gameCore.jokers.spawn();
            }
        }.bind(this), false);
    }
}
