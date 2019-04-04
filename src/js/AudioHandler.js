class AudioHandler {
    constructor() {
        this.backgroundMusic = new Howl({
            src: ['src/medias/sounds/background-music.wav']
        });

        this.fireSound = new Howl({
            src: ['src/medias/sounds/fire.wav']
        });

        this.explosionSound = new Howl({
            src: ['src/medias/sounds/explosion.wav']
        });

        this.backgroundMusic.play();
        this.backgroundMusic.loop(true);
    }

    changeMusicVolume(_value) {
        this.backgroundMusic.volume(_value);
    }

    changeSoundVolume(_value) {
        this.fireSound.volume(_value);
        this.explosionSound.volume(_value);
    }
}
