class GameUI {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.level = 0;
        this.score = 0;
        this.fullScreenElements = [];
        this.isLevelingUp = false;
        this.isHelpDisplayed = false;
        this.isWelcomeDisplayed = false;
        this.isGameLaunched = false;
        this.isPaused = false;
        this.isEscapeDisplayed = false;
        this.isOptionsDisplayed = false;
        this.isScoresDisplayed = false;

        this.welcomeDiv = $("#welcome");
        this.levelUpDiv = $("#level-up");
        this.helpDiv = $("#help");
        this.livesDiv = $("#lives");
        this.looseDiv = $("#loose");
        this.newrecordDiv = $("#newrecord");
        this.scoreDiv = $('#score');
        this.titleDiv = $('#title');
        this.optionsDiv = $('#options');
        this.scoresDiv = $('#scores');
        this.escapeDiv = $('#escape');


        this.scoreValue = document.getElementById('scoreValue');
        this.finalScore = document.getElementById('finalScore');

        this.playButton = document.getElementById('playButton');
        this.optionsButton = document.getElementById('optionsButton');
        this.scoresButton = document.getElementById('scoresButton');
        this.returnOptions = document.getElementById('returnOptions');
        this.returnScores = document.getElementById('returnScores');
        this.submitNewRecordButton = document.getElementById('submitNewRecord');
        this.returnLoose = document.getElementById('returnLoose');
        this.resumeButton = document.getElementById('resumeButton');
        this.endButton = document.getElementById('endButton');

        this.scoresContainer = document.getElementById('scoresContainer');

        this.lives = document.getElementsByClassName('live');

        this.recordIndex = 0;

        var _this = this;

        this.playButton.addEventListener("click", function() {
            _this.startGame();
        });

        this.optionsButton.addEventListener('click', function() {
            _this.showOptions();
        });

        this.returnOptions.addEventListener('click', function(e) {
            _this.hideOptions();
        });

        this.scoresButton.addEventListener('click', function() {
            _this.showScores();
        });

        this.returnScores.addEventListener('click', function() {
            _this.hideScores();
        });

        this.submitNewRecordButton.addEventListener('click', function() {
            let pseudo;
            if($("#pseudoInput").val() == "")
                pseudo = "Anonymous";
            else
                pseudo = $('#pseudoInput').val();

            //console.log(this.);
            storage.addNewRecord(new Score(pseudo, _this.score), _this.recordIndex);
            _this.endGame();
            _this.hideLoose();
        });
        this.returnLoose.addEventListener('click', function() {
            _this.endGame();
            _this.hideLoose();
        });

        this.resumeButton.addEventListener('click', function() {
            _this.hideEscape(true);
        });

        this.endButton.addEventListener('click', function() {
            _this.hideEscape(false);
        })

        // this.fullScreenElements.push(this.welcomeDiv);
        // this.fullScreenElements.push(this.levelUpDiv);
        // this.fullScreenElements.push(this.helpDiv);
        // this.fullScreenElements.push(this.livesDiv);
        // this.fullScreenElements.push(this.looseDiv);
        // this.fullScreenElements.push(this.scoreDiv);

        this.dataFromStorage = storage.getData();
    }

    displayFromStorage() {
        if(this.dataFromStorage != null) {
            var _this = this;
            this.scoresContainer.innerHTML = "";
            this.dataFromStorage.scores.forEach(function(score) {
                _this.scoresContainer.innerHTML += '<div class="score"><div class="right">' + score.pseudo + '</div><div class="left">' + score.score + '</div></div>';
            });
        }
    }

    size(width, height, elements) {
        // this.width = width;
        // this.height = height;
        // var isGameLaunched = this.isGameLaunched;
        // var bottomScreenElementsHeight = this.livesDiv.clientHeight;
        // elements.forEach(function(element) {
        //     if(element.id == "welcome" || element.id == "help" || element.id == "lives" ||element.id == "score") {
        //         element.style.bottom = 20 + "px";
        //         if(element.id == "help" && isGameLaunched)
        //             element.style.bottom = bottomScreenElementsHeight + 30 + "px";
        //     } else {
        //         element.style.top = (height / 2) - (element.clientHeight / 2) + "px";
        //     }
        //     if(element.id == "lives") {
        //         element.style.left = 20 + "px";
        //     } else if(element.id == "score") {
        //         element.style.right = 20 + "px";
        //     } else {
        //         element.style.left = (width / 2) - (element.clientWidth / 2) + "px";
        //     }
        // });
    }

    startGame() {
        for(var i = 0; i < this.lives.length; i++) {
            this.lives[i].src = "src/medias/images/live_full.png";
        }
        this.hideTitle();
        this.hideWelcome();
        this.hideHelp();
        this.showLevelUp(false);
        this.showLives();
        this.showScore();
        rebuildGame();
        jokers.timestamp = Date.now();
        this.isGameLaunched = true;
    }

    showTitle() {
        this.titleDiv.fadeIn(500);
    }

    hideTitle() {
        this.titleDiv.fadeOut(500);
    }

    showWelcome() {
        _spaceship.shield.activate();
        this.isLevelingUp = true;
        this.isWelcomeDisplayed = true;
        this.welcomeDiv.fadeIn(500);
        this.welcomeDiv.css("display", "flex")
        this.showTitle();
        this.showHelp();
        //this.size(this.width, this.height, new Array(this.welcomeDiv));
        this.titleDiv.innerHTML = "SPACE RUNNER";
        this.titleDiv.css('font-size', '150px');
    }
    hideWelcome() {
        this.hideTitle()
        this.hideHelp();
        this.welcomeDiv.fadeOut(500);
        this.isWelcomeDisplayed = false;
    }
    showLevelUp(isCheat) {
        _spaceship.shield.activate();
        this.isLevelingUp = true;;
        this.level += 1;
        this.levelUpDiv.text("Level " + this.level);
        if(isCheat) {
            this.levelUpDiv[0].innerHTML += "<br/><small>(cheater !!!)</small>";
        }
        this.levelUpDiv.fadeIn(500);
        this.levelUpDiv.css('display', 'flex');
        this.size(this.width, this.height, new Array(this.levelUpDiv));
        setTimeout(function(_this) {
            _this.size(_this.width, _this.height, new Array(_this.levelUpDiv));
            _this.levelUpDiv.fadeOut(500);
            _this.isLevelingUp = false;
            setTimeout(function() {
                _spaceship.shield.desactivate();
            }, 1000);
        }, 2500, this);
    }

    showHelp() {
        if(!this.isHelpDisplayed && !this.isOptionsDisplayed) {
            this.isHelpDisplayed = true;
            this.helpDiv.fadeIn(500);
            this.helpDiv.css('display', 'flex');
            this.size(this.width, this.height, new Array(this.helpDiv));
            if(this.isGameLaunched)
                this.isPaused = true;
        } else if(this.isHelpDisplayed) {
            this.hideHelp();
        }
        if(!this.isWelcomeDisplayed && this.isHelpDisplayed) {
            this.titleDiv.text('PAUSED');
            this.titleDiv.css('font-size', '100px');
            this.showTitle();
        }
        if(this.isGameLaunched) {
            console.log(this.livesDiv);
            this.helpDiv.css('bottom', this.livesDiv.height() + 30 + "px");
        }
    }
    hideHelp() {
        var _this = this;
        this.isHelpDisplayed = false;
        this.helpDiv.fadeOut(500, function() {
            _this.isPaused = false;
        });
        if(!this.isWelcomeDisplayed || (!this.isWelcomeDisplayed && !this.isHelpDisplayed)) {
            this.hideTitle();
        }
    }

    showLives() {
        this.livesDiv.fadeIn(500);
        this.size(this.width, this.height, new Array(this.livesDiv));
    }
    hideLives() {
        this.livesDiv.fadeOut(500);
    }

    showLoose() {
        this.finalScore.innerHTML = this.score;
        this.looseDiv.fadeIn(500);
        this.looseDiv.css('display', 'flex');
        this.size(this.width, this.height, new Array(this.looseDiv));
        this.isGameLaunched = false;
        let isNewRecord = storage.isNewRecord(this.score);
        if(isNewRecord[0]){
            this.recordIndex = isNewRecord[1];
            this.newrecordDiv.fadeIn(500);
        } else {
            this.newrecordDiv.hide();
        }
    }
    hideLoose() {
        this.looseDiv.fadeOut(500);
    }

    showScore() {
        this.scoreDiv.fadeIn(500);
        this.size(this.width, this.height, new Array(this.scoreDiv));
    }
    hideScore() {
        this.scoreDiv.fadeOut(500);
    }
    scored(points) {
        var actualValue = Number(this.scoreValue.innerText);
        this.scoreValue.innerHTML = actualValue + points;
        this.score += points;
    }

    showOptions() {
        this.hideWelcome();
        this.hideHelp();
        this.optionsDiv.fadeIn(500);
        this.isOptionsDisplayed = true;
    }
    hideOptions() {
        this.optionsDiv.fadeOut(500);
        this.showWelcome();
        this.isOptionsDisplayed = false;
    }

    showEscape() {
        if(this.isGameLaunched && !this.isEscapeDisplayed) {
            this.escapeDiv.fadeIn(500);
            this.isPaused = true;
            this.isEscapeDisplayed = true;
        } else if(this.isEscapeDisplayed) {
            this.hideEscape(true);
        }

    }
    hideEscape(continu) {
        var _this = this;
        this.escapeDiv.fadeOut(500, function() {
            _this.isPaused = false;
        });
        this.isEscapeDisplayed = false;
        if(!continu) {
            this.endGame();
        }
    }

    showScores() {
        this.hideWelcome();
        this.hideTitle();
        this.scoresDiv.fadeIn(500);
        this.isScoresDisplayed = true;
    }

    hideScores() {
        this.scoresDiv.fadeOut(500);
        this.showWelcome();
        this.isScoresDisplayed = false;
    }

    endGame() {
        _gameParameters.level = 1;
        _gameParameters.asteroidNumber = 3;
        this.level = 0;
        this.score = 0;
        this.scoreValue.innerHTML = "0";
        this.showWelcome();
        this.hideScore();
        this.hideLives();
        this.isPaused = false;
        this.isGameLaunched = false;
        rebuildGame();
    }
}
