class Viewport {
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.ratio = this.width / this.height;
        this.scale = 1;
    }
}
