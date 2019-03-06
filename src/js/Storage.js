class Storage {
    constructor() {
        this.isFirstLaunch;
        this.data = {
            options: {
                musicVolume: 100,
                soundVolume: 100
            }
        }
        this.data.scores = [];
    }

    load() {
        var storageData = localStorage.getItem('playerData');
        if(storageData != null)
            this.data = JSON.parse(storageData);

        $("#sliderMusic").val(this.data.options.musicVolume);
        $("#sliderSound").val(this.data.options.soundVolume);
    }

    save() {
        this.data.options.musicVolume = Number($("#sliderMusic").val());
        this.data.options.soundVolume = Number($("#sliderSound").val());

        var json = JSON.stringify(this.data);
        localStorage.setItem('playerData', json);
    }

    getData() {
        return this.data;
    }

    isNewRecord(newValue) {
        var position = 0;
        var found = false;
        if(this.data.scores.length == 0)
            return new Array(true, 0);
        for(var i = 0; i < this.data.scores.length; i++) {
            if(this.data.scores[i].score <= newValue) {
                position = i;
                found = true;
                return new Array(found, position);
            }
        }
        return new Array(found)
    }

    addNewRecord(score, index) {
        this.data.scores.splice(index, 0, score);
        if(this.data.scores.length > 5)
            this.data.scores.pop();

        this.save();
        gameUI.displayFromStorage();
    }
}
