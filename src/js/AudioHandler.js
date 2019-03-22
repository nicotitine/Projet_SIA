class AudioHandler {
    constructor() {
        this.backgroundMusic = new Howl({
            src: ['src/medias/sounds/background-music.wav']
        });

        this.fireSound = new Howl({
            src: ['src/medias/sounds/fire.wav']
        });

        this.reloadSound = new Howl({
            src: ['src/medias/sounds/reload.wav']
        });

        this.explosionSound = new Howl({
            src: ['src/medias/sounds/explosion.wav']
        });

        this.backgroundMusic.play();
        this.backgroundMusic.loop(true);
    }

    changeMusicVolume(newValue) {
        this.backgroundMusic.volume(newValue);
    }

    changeSoundVolume(newValue) {
        this.fireSound.volume(newValue);
        this.reloadSound.volume(newValue);
        this.explosionSound.volume(newValue);
    }
}
