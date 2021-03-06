class Spaceship extends ExplosiveMesh {
    constructor(_geometry, _material, _t) {

        super(_geometry, _material, new THREE.Vector3(gameParameters.spaceship.scale, gameParameters.spaceship.scale, gameParameters.spaceship.scale), 2);

        this.isHitted = false;

        this.rotation.x = Math.PI / 2;
        this.rotation.y = 0;
        this.velocity = {
            distanceToAddX: 0,
            distanceToAddY: 0,
            forwardX: 0,
            forwardY: 0,
            vrl: 0,
            vrr: 0,
            arl: 0,
            arr: 0
        };
        this.name = "Spaceship";
        this.position.z = 0;

        this.lives = 3;
        this.size = new THREE.Vector3();
        new THREE.Box3().setFromObject(this).getSize(this.size);
        this.isLoaded = true;

        this.fireLeft = new Fire(1);
        this.fireRight = new Fire(2);

        this.shield = new Shield(textureHandler.shield.geometry, textureHandler.shield.material, this.size, this.position, _t)
        this.isInvincible = true;

        this.isBonusTimerDisplayed = false;
        this.layers.set(0);
        this.bonusTimer = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
            color: 0xffffff,
            depthTest: false
        }));
        this.bonusTimer.position.set(this.position.x, this.position.y - this.size.y, 0);
        this.shotTimestamp = 0;

        this.shootBonusTimestamp = 0;
        this.shootBonusLifetime = 0;

        this.laserShootBonusTimestamp = 0;

        this.lasers = [];
    }

    activateShootBonus(_lifetime, _t) {
        this.displayBonusTimer(_lifetime, _t);
        this.shootBonusTimestamp = _t;
        this.shootBonusLifetime = _lifetime;
        this.laserShootBonusTimestamp = _t;
    }

    removeLaser(_laser) {
        this.lasers[this.lasers.indexOf(_laser)] = null;
        this.lasers = this.lasers.filter(function(el) {
            return el != null;
        })
    }

    shoot(_isBonus, _t) {
        if (!this.isHitted) {
            var laserPositionLeft = new THREE.Vector3().set(this.position.x - 20 * -Math.sin(this.rotation.y + Math.PI / 2), this.position.y - 20 * Math.cos(this.rotation.y + Math.PI / 2), 0);
            var laserPositionRight = new THREE.Vector3().set(this.position.x + 20 * -Math.sin(this.rotation.y + Math.PI / 2), this.position.y + 20 * Math.cos(this.rotation.y + Math.PI / 2), 0);
            var laser;

            if (_isBonus) {
                laser = new Laser(textureHandler.laser.geometry, textureHandler.laser.materialSpaceship, laserPositionLeft, this.rotation.y, this.rotation, gameParameters.laser.types.SPACESHIP, _t);
                var additionalLaser = new Laser(textureHandler.laser.geometry, textureHandler.laser.materialSpaceship, laserPositionRight, this.rotation.y, this.rotation, gameParameters.laser.types.SPACESHIP, _t);
                gameCore.addSpaceshipLaser(additionalLaser);
                this.lasers.push(additionalLaser);
            } else {
                laser = new Laser(textureHandler.laser.geometry, textureHandler.laser.materialSpaceship, this.position, this.rotation.y, this.rotation, gameParameters.laser.types.SPACESHIP, _t);
            }
            gameCore.audioHandler.fireSound.play();
            gameCore.addSpaceshipLaser(laser);
            this.lasers.push(laser);
        }
    }

    addLife() {
        if (this.lives < 10) {
            this.lives += 1;
            gameUI.editLives(this.lives, true)
        }
    }

    hitted(_t) {

        this.isHitted = true;
        this.visible = false;
        this.fireLeft.visible = false;
        this.fireRight.visible = false;
        this.position.z = 2000;
        this.fireLeft.position.z = 2000;
        this.fireRight.position.z = 2000;
        gameUI.editLives(this.lives, false)
        this.lives -= 1;
        this.hideBonusTimer();

        if (this.lives > 0) {
            setTimeout(() => {
                this.isHitted = false;
                this.fireLeft.position.z = -5;
                this.fireRight.position.z = -5;
                this.visible = true;
                this.fireLeft.visible = true;
                this.fireRight.visible = true;
                this.position.set(0, 0, 0);
                this.shield.activate(5, _t);
                this.displayBonusTimer(5.0, _t)
                this.rotation.x = Math.PI / 2;
                this.velocity = {
                    distanceToAddX: 0,
                    distanceToAddY: 0,
                    forwardX: 0,
                    forwardY: 0,
                    vrl: 0,
                    vrr: 0,
                    arl: 0,
                    arr: 0
                };
            }, 2000);
        } else {
            gameUI.showLoose();
        }
    }

    displayBonusTimer(_bonusLifetime, _t) {
        this.bonusTimer.spawntime = _t;
        this.bonusTimer.lifetime = _bonusLifetime;
        this.bonusTimer.position.set(this.position.x, this.position.y - this.size.y, 0);
        this.bonusTimer.visible = true;
        this.bonusTimer.scale.set(100, 2, 1);
        this.isBonusTimerDisplayed = true;
    }

    hideBonusTimer() {
        this.isBonusTimerDisplayed = false;
        this.bonusTimer.visible = false;
    }

    update(_t) {
        ////////// Keys event handling //////////
        // left arrow key : eventHandler.keys[37]
        // right arrow key : eventHandler.keys[39]
        // up arrow key : eventHandler.keys[38]
        if (eventHandler.keys[37]) this.velocity.arl = gameParameters.spaceship.rotationSpeed;
        else this.velocity.arl = 0;
        if (eventHandler.keys[39]) this.velocity.arr = -gameParameters.spaceship.rotationSpeed;
        else this.velocity.arr = 0;
        if (eventHandler.keys[38]) {
            this.velocity.forwardX = -Math.cos(this.rotation.y + Math.PI / 2) * gameParameters.spaceship.speed;
            this.velocity.forwardY = -Math.sin(this.rotation.y + Math.PI / 2) * gameParameters.spaceship.speed;
            //gameCore.engineFire.trailTarget.position.y += 0.5;
            this.fireLeft.increase(0.2);
            this.fireRight.increase(0.2);
        } else {
            this.velocity.forwardX = this.velocity.forwardY = 0;
            this.fireLeft.decrease(0.2);
            this.fireRight.decrease(0.2);
        }


        // Spacebar key handling
        if (eventHandler.keys[32] && this.shotTimestamp + gameParameters.laser.spaceship.timestamp < _t) {
            this.shoot(false, _t);
            this.shotTimestamp = _t;
        }

        if (this.shootBonusTimestamp + this.shootBonusLifetime > _t) {
            if (this.laserShootBonusTimestamp + gameParameters.jokers.shoot.timestamp < _t) {
                this.shoot(true, _t);
                this.laserShootBonusTimestamp = _t
            }
        }


        if (gameUI != null) {
            //////////////////// Movement handling ////////////////////
            // Forward //
            // 2 cases :  - the user is at stop and starts pushing the arrow up key
            //            - the user is moving and stops pushing the arrow up key (this.velocity.forward{X, Y} = 0)
            // 1st case :
            // this.velocity.forward{X, Y} : spaceship speed calculated in function of its rotation and the speed factor (initial speed)
            // this.velocity.distanceToAdd{X, Y} : starts from 0. The spaceship initial speed is added.
            //      Then, it is multiplied by a number lower than 1 (friction)
            //      Finaly, the distanceToAdd is added to the spaceship's position
            // In this case, it will create an effect of progressive acceleration
            // 2nd case :
            // this.velocity.forward{X, Y} : 0
            // this.velocity.distanceToAdd{X, Y} : starts from spaceship's speed and will decrease until 0
            //      0 is added and it's multiplied by a number lowaer than 1, distanceToAdd{X, Y} will decrease
            // In this case, it will create an effect of progressive slowing down

            // /!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\ ISSUE /!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\
            // /!\ If the user keeps moving forward, the spaceship's speed will endless very slowly increase                   /!\
            // /!\ If the user does nothing, distanceToAdd{X, Y} will never go down to 0. It will endledd very slowly decrease /!\
            // /!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\ ISSUE /!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\
            this.velocity.distanceToAddX += this.velocity.forwardX;
            this.velocity.distanceToAddY += this.velocity.forwardY;
            this.velocity.distanceToAddX *= gameParameters.spaceship.friction;
            this.velocity.distanceToAddY *= gameParameters.spaceship.friction;
            this.position.x += this.velocity.distanceToAddX;
            this.position.y += this.velocity.distanceToAddY;


            // Rotation //
            // The same system is used, except that for rotation, we are handling two sides (left and right)
            // Thats's why the sum is made at the end
            this.velocity.vrl += this.velocity.arl; // velocity for rotation left at time = t
            this.velocity.vrr += this.velocity.arr; // velocity for rotation right at time = t
            this.velocity.vrl *= gameParameters.spaceship.rotationFriction; // each multiplied by the rotationFriction
            this.velocity.vrr *= gameParameters.spaceship.rotationFriction; //  "       "      "   "         "
            this.rotation.y += this.velocity.vrl + this.velocity.vrr; // the sum represents the real rotation of the ship at time = t

            // Checks if out of scene
            this.checkOutOfScreen();

            // Bonus timer updating
            if (this.isBonusTimerDisplayed && this.bonusTimer.scale.x > 1) {
                let tick = (_t - this.bonusTimer.spawntime) / this.bonusTimer.lifetime * 100;
                if (gameCore.cameraHandler.cameraType == gameCore.cameraHandler.cameraTypes.PURSUIT) {
                    this.bonusTimer.rotation.set(0, 0, this.rotation.y)
                    this.bonusTimer.position.x = this.position.x + this.size.x * Math.cos(this.rotation.y + Math.PI / 2);
                    this.bonusTimer.position.y = this.position.y + this.size.x * Math.sin(this.rotation.y + Math.PI / 2);
                    this.bonusTimer.position.z = -5;
                } else {
                    this.bonusTimer.position.set(this.position.x, this.position.y - this.size.y, 0);
                    this.bonusTimer.rotation.set(0, 0, 0);
                }
                this.bonusTimer.scale.set(100 - tick, 2, 1);
                if (this.bonusTimer.scale.x < 25) {
                    this.bonusTimer.material.color.setHex(0xff0000);
                } else if (this.bonusTimer.scale.x < 50) {
                    this.bonusTimer.material.color.setHex(0xffff00);
                } else {
                    this.bonusTimer.material.color.setHex(0xffffff);
                }
            } else {
                this.hideBonusTimer();
            }
        }

        // Update the shield
        if (this.shield != null) {
            this.shield.update(this.position, this.isInvincible, _t);
        }

        // Update the fire
        if (this.fireRight != null && this.fireLeft != null && this.position != null) {
            this.fireLeft.update(this.position, this.size, this.rotation);
            this.fireRight.update(this.position, this.size, this.rotation);
        }
    }
}
