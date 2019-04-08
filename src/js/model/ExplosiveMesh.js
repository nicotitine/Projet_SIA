class ExplosiveMesh extends CollidableMesh {
    constructor(_geometry, _material, _scale, _levelExplode) {

        super(_geometry, _material, _scale);
        
        this.levelExplode = _levelExplode;
    }

    explode() {
        new Explosion(this.position, this.levelExplode);
        gameCore.audioHandler.explosionSound.play();
    }
}
