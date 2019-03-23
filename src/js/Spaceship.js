 class Spaceship extends ResizableObject {
     constructor() {
         var model = textureLoader.getSpaceship();

         super(model.geometry, model.material);

         this.bullets = [];
         this.isHitted = false;
         this.needToReload = false;
         this.reloadSoundPlayed = false;
         this.isLoaded = false;

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
         this.name = "Spaceship";
         this.position.z = 0;
         this.scale.set(gameParameters.spaceship.scale, gameParameters.spaceship.scale, gameParameters.spaceship.scale);
         this.geometry.center();
         this.lives = 3;
         this.size = new THREE.Vector3();
         new THREE.Box3().setFromObject(this).getSize(this.size);
         this.isLoaded = true;
         this.fire = new Fire(gameParameters.spaceship.fire.scale);
         this.shield = new Shield(this.size, this.position)
         this.isInvincible = true;
         this.shootPosition = {
             LEFT: 1,
             RIGHT: 2,
             BOTH: 3
         };
         this.lastShootPosition = this.shootPosition.RIGHT;
         this.isRapidFireActivated = false;
         this.isBonusTimerDisplayed = false;

         this.bonusTimer = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
             color: 0xffffff
         }));
         this.bonusTimer.position.set(this.position.x, this.position.y - this.size.y, 0);
     }

     shoot(isBonus) {
         if (!this.isHitted) {
             var bulletPositionLeft = new THREE.Vector3().set(this.position.x - 20 * -Math.sin(this.rotation.y), this.position.y - 20 * Math.cos(this.rotation.y), 0);
             var bulletPositionRight = new THREE.Vector3().set(this.position.x + 20 * -Math.sin(this.rotation.y), this.position.y + 20 * Math.cos(this.rotation.y), 0);
             var bullet;

             if (!isBonus && this.lastShootPosition == this.shootPosition.RIGHT) {
                 //console.log("cos : ", Math.cos(this.rotation.y), ", sin : ", Math.sin(this.rotation.y), ", bullet position before : ", bulletPosition);
                 bullet = new Bullet(bulletPositionLeft, this.matrix, this.rotation);
             }
             if (!isBonus && this.lastShootPosition == this.shootPosition.LEFT) {
                 bullet = new Bullet(bulletPositionRight, this.matrix, this.rotation);
             }
             if (isBonus) {
                 bullet = new Bullet(bulletPositionLeft, this.matrix, this.rotation);
                 var additionalBullet = new Bullet(bulletPositionRight, this.matrix, this.rotation);
                 gameCore.bullets.push(additionalBullet)
                 gameCore.scene.add(additionalBullet);
                 setTimeout(() => {
                     if (this.isRapidFireActivated)
                         this.shoot(true);
                 }, 400)
             } else {
                 gameCore.audioHandler.fireSound.play();
                 this.needToReload = true;
                 this.reloadSoundPlayed = false;
                 this.updateBulletShootingPosition();
             }
             gameCore.bullets.push(bullet)
             gameCore.scene.add(bullet);

         }
     }

     updateBulletShootingPosition() {
         if (this.lastShootPosition == this.shootPosition.LEFT) {
             this.lastShootPosition = this.shootPosition.RIGHT;
         } else {
             this.lastShootPosition = this.shootPosition.LEFT;
         }
     }

     addLife() {
         if (this.lives < 10) {
             this.lives += 1;
             gameUI.editLives(this.lives, true)
         }
     }

     hitted() {
         var explosion = new Explosion(this.position, 2);

         this.isHitted = true;
         this.visible = false;
         this.fire.visible = false;
         this.position.z = 2000;
         this.fire.position.z = 2000;
         gameUI.editLives(this.lives, false)
         this.lives -= 1;
         this.hideBonusTimer();

         if (this.lives > 0) {
             setTimeout(() => {
                 this.isHitted = false;
                 this.fire.position.z = 0;
                 this.visible = true;
                 this.fire.visible = true;
                 this.position.set(0, 0, 0);
                 this.shield.activate(5, false);
                 this.displayBonusTimer(5000)
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

     displayBonusTimer(bonusLifetime) {
         this.bonusTimer.spawntime = Date.now();
         this.bonusTimer.lifetime = bonusLifetime;
         this.bonusTimer.visible = true;
         this.bonusTimer.scale.set(100, 2, 1);
         this.isBonusTimerDisplayed = true;
     }

     hideBonusTimer() {
         this.isBonusTimerDisplayed = false;
         this.bonusTimer.visible = false;
     }

     update() {
         ////////// Keys event handling //////////
         // left arrow key : eventHandler.keys[37]
         // right arrow key : eventHandler.keys[39]
         // up arrow key : eventHandler.keys[38]
         if (eventHandler.keys[37]) this.velocity.arl = gameParameters.spaceship.rotationSpeed;
         else this.velocity.arl = 0;
         if (eventHandler.keys[39]) this.velocity.arr = -gameParameters.spaceship.rotationSpeed;
         else this.velocity.arr = 0;
         if (eventHandler.keys[38]) {
             this.velocity.forwardX = -Math.cos(this.rotation.y) * gameParameters.spaceship.speed;
             this.velocity.forwardY = -Math.sin(this.rotation.y) * gameParameters.spaceship.speed;
             this.fire.increase(0.2);
         } else {
             this.velocity.forwardX = this.velocity.forwardY = 0;
             this.fire.decrease(0.2);
         }


         // Spacebar key handling
         if (eventHandler.keys[32] && !this.needToReload) {
             this.shoot(false);
             timestamp = Date.now();
         }

         // To be realistic, the sound must be played 400 ms before
         if (timestamp + gameParameters.bullet.timestamp < Date.now() + 400 && this.needToReload && !this.reloadSoundPlayed) {
             gameCore.audioHandler.reloadSound.play();
             this.reloadSoundPlayed = true;
         }
         // Then the player can really shot again
         if (timestamp + gameParameters.bullet.timestamp < Date.now() && this.needToReload) {
             this.needToReload = false;
         }

         if (gameUI != null && !gameUI.isPaused) {
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
             if (Math.abs(this.position.x) > gameCore.cameraHandler.size.x / 2) {
                 this.position.x = -this.position.x;
             }
             if (Math.abs(this.position.y) > gameCore.cameraHandler.size.y / 2) {
                 this.position.y = -this.position.y;
             }

             // Bonus timer updating
             if (this.isBonusTimerDisplayed && this.bonusTimer.scale.x > 1) {
                 let tick = (Date.now() - this.bonusTimer.spawntime) / this.bonusTimer.lifetime * 100;
                 if (gameCore.cameraHandler.cameraType == gameCore.cameraHandler.cameraTypes.PURSUIT) {
                     this.bonusTimer.rotation.set(0, 0, this.rotation.y + Math.PI / 2)
                     this.bonusTimer.position.set(this.fire.position.x, this.fire.position.y, -15);
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
         if (this.shield != null)
             this.shield.update(this.position, this.isInvincible);

         // Update the fire
         if (this.fire != null && this.position != null)
             this.fire.update(this.position, this.size, this.rotation);

     }
 }
