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

        this.playButton.addEventListener("click", function() {
            this.startGame();
        }.bind(this));

        this.optionsButton.addEventListener('click', function() {
            this.showOptions();
        }.bind(this));

        this.returnOptions.addEventListener('click', function(e) {
            this.hideOptions();
        }.bind(this));

        this.scoresButton.addEventListener('click', function() {
            this.showScores();
        }.bind(this));

        this.returnScores.addEventListener('click', function() {
            this.hideScores();
        }.bind(this));

        this.submitNewRecordButton.addEventListener('click', function() {
            let pseudo;
            if($("#pseudoInput").val() == "")
                pseudo = "Anonymous";
            else
                pseudo = $('#pseudoInput').val();

            storage.addNewRecord(new Score(pseudo, this.score), this.recordIndex);
            this.endGame();
            this.hideLoose();
        }.bind(this));
        this.returnLoose.addEventListener('click', function() {
            this.endGame();
            this.hideLoose();
        }.bind(this));

        this.resumeButton.addEventListener('click', function() {
            this.hideEscape(true);
        }.bind(this));

        this.endButton.addEventListener('click', function() {
            this.hideEscape(false);
        }.bind(this))

        // this.fullScreenElements.push(this.welcomeDiv);
        // this.fullScreenElements.push(this.levelUpDiv);
        // this.fullScreenElements.push(this.helpDiv);
        // this.fullScreenElements.push(this.livesDiv);
        // this.fullScreenElements.push(this.looseDiv);
        // this.fullScreenElements.push(this.scoreDiv);

        this.dataFromStorage = storage.getData();

        this.changeSlider($("#valueSliderMusic"), $("#sliderMusic"));
        this.changeSlider($("#valueSliderSound"), $("#sliderSound"));
        gameCore.audioHandler.changeMusicVolume(Number($("#sliderMusic").val()) / 100);
        gameCore.audioHandler.changeSoundVolume(Number($("#sliderSound").val()) / 100);
        $("#sliderMusic").on('input change', function(e) {
            this.changeSlider($("#valueSliderMusic"), $("#sliderMusic"));
            gameCore.audioHandler.changeMusicVolume(Number($("#sliderMusic").val()) / 100);
            storage.save();
        }.bind(this));
        $('#sliderSound').on('input change', function() {
            this.changeSlider($('#valueSliderSound'), $('#sliderSound'));
            gameCore.audioHandler.changeSoundVolume(Number($("#sliderSound").val()) / 100);
            storage.save();
        }.bind(this));
    }

    displayFromStorage() {
        if(this.dataFromStorage != null) {
            this.scoresContainer.innerHTML = "";
            this.dataFromStorage.scores.forEach(function(score) {
                this.scoresContainer.innerHTML += '<div class="score"><div class="right">' + score.pseudo + '</div><div class="left">' + score.score + '</div></div>';
            }, this);
        }
    }

    changeSlider($label, $slider) {
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

    editLives(livesnb, win) {
        if(livesnb >= 4) {
            if(win) {
                this.livesDiv[0].innerHTML += '<img src="src/medias/images/live_full.png" class="live"/>';
            } else {
                this.livesDiv[0].children[livesnb - 1].remove();
            }
        } else {
            if(win) {
                this.lives[livesnb -1 ].src = 'src/medias/images/live_full.png';
            } else {
                this.lives[livesnb - 1].src = 'src/medias/images/live_empty.png';
            }
        }
        this.lives = document.getElementsByClassName('live');
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
        gameCore.launchGame()
        this.isGameLaunched = true;
    }

    showTitle() {
        this.titleDiv.fadeIn(500);
    }

    hideTitle() {
        this.titleDiv.fadeOut(500);
    }

    showWelcome() {
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
        this.isLevelingUp = true;;
        this.level += 1;
        this.levelUpDiv.text("Level " + this.level);
        if(isCheat) {
            this.levelUpDiv[0].innerHTML += "<br/><small>(cheater !!!)</small>";
        }
        this.levelUpDiv.fadeIn(500);
        this.levelUpDiv.css('display', 'flex');
        this.size(this.width, this.height, new Array(this.levelUpDiv));
        setTimeout(() => {
            this.size(this.width, this.height, new Array(this.levelUpDiv));
            this.levelUpDiv.fadeOut(500);
            this.isLevelingUp = false;
        }, 2500);
    }

    showHelp() {
        if(!this.isHelpDisplayed) {
            this.isHelpDisplayed = true;
            this.helpDiv.fadeIn(500);
            this.helpDiv.css('display', 'flex');
            if(this.isGameLaunched) {
                this.isPaused = true;
            }
        } else if(this.isHelpDisplayed) {
            this.hideHelp();
        }
        if(!this.isWelcomeDisplayed && this.isHelpDisplayed) {
            this.titleDiv.text('PAUSED');
            this.titleDiv.css('font-size', '100px');
            this.showTitle();
        }
        if(this.isGameLaunched) {
            this.helpDiv.css('bottom', this.livesDiv.height() + 30 + "px");
        }
        gameCore.setIsPaused(this.isPaused);
    }
    hideHelp() {
        this.isHelpDisplayed = false;
        this.helpDiv.fadeOut(500, function() {
            this.isPaused = false;
            gameCore.setIsPaused(this.isPaused);
        }.bind(this));
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
        gameCore.setIsPaused(this.isPaused);
    }
    hideEscape(continu) {
        this.escapeDiv.fadeOut(500, function() {
            this.isPaused = false;
            gameCore.setIsPaused(this.isPaused);
        }.bind(this));
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
        gameParameters.level = 1;
        gameParameters.asteroid.number = 3;
        this.level = 0;
        this.score = 0;
        this.scoreValue.innerHTML = "0";
        this.showWelcome();
        this.hideScore();
        this.hideLives();
        this.isPaused = false;
        this.isGameLaunched = false;
        gameCore.endGame();
        gameCore.setIsPaused(this.isPaused);
    }
}
