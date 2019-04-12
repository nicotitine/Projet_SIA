class LightningBox {
    constructor(_size) {

        this.resize(_size)
        this.lightningColor = new THREE.Color(0xB0FFFF);
        this.outlineColor = new THREE.Color(0x00FFFF);
        this.lightningMaterial = new THREE.MeshBasicMaterial( { color: this.lightningColor } );

        this.lightningParams = {
			sourceOffset: new THREE.Vector3(),
			destOffset: new THREE.Vector3(),
			radius0: 0.8,
			radius1: 0.8,
			minRadius: 0,
			maxIterations: 7,
			isEternal: true,
			timeScale: 1,
			propagationTimeFactor: 0.05,
			vanishingTimeFactor: 0.95,
			subrayPeriod: 5,
			subrayDutyCycle: 0.07,
			maxSubrayRecursion: 3,
			ramification: 1,
			recursionProbability: 0.6,
			roughness: 0.85,
			straightness: 0.98
		};

        this.lightnings = [];
        this.lightningsMesh = [];

        this.links.forEach(function(_link) {
            this.lightnings.push(new THREE.LightningStrike( this.lightningParams ));
            this.lightningsMesh.push(new THREE.Mesh( this.lightnings[this.lightnings.length - 1], this.lightningMaterial ));
        }, this)

        this.size();
    }

    resize(_size) {
        this.positions = [
            new THREE.Vector3(_size.x / 2, _size.y / 2, -50),
            new THREE.Vector3(_size.x / 2, - _size.y / 2, -50),
            new THREE.Vector3(- _size.x / 2, - _size.y / 2, -50),
            new THREE.Vector3(- _size.x / 2, _size.y / 2, -50),
            new THREE.Vector3(_size.x / 2, _size.y / 2, 50),
            new THREE.Vector3(_size.x / 2, - _size.y / 2, 50),
            new THREE.Vector3(- _size.x / 2, - _size.y / 2, 50),
            new THREE.Vector3(- _size.x / 2, _size.y / 2, 50)
        ];

        this.links = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 4]
        ]
    }

    size() {
        for(var i = 0; i < this.links.length; i++) {
            this.lightningsMesh[i].layers.enable(1);
            this.lightnings[i].rayParameters.sourceOffset.set(this.positions[this.links[i][0]].x, this.positions[this.links[i][0]].y, this.positions[this.links[i][0]].z);
            this.lightnings[i].rayParameters.destOffset.set(this.positions[this.links[i][1]].x, this.positions[this.links[i][1]].y, this.positions[this.links[i][1]].z);
        }

    }

    update(_t) {
        this.lightnings.forEach(function(_lightning, _i) {
            _lightning.rayParameters.sourceOffset.set(this.positions[this.links[_i][0]].x, this.positions[this.links[_i][0]].y, this.positions[this.links[_i][0]].z);
            _lightning.rayParameters.destOffset.set(this.positions[this.links[_i][1]].x, this.positions[this.links[_i][1]].y, this.positions[this.links[_i][1]].z);
            _lightning.update(_t);
        }, this);
    }
}
