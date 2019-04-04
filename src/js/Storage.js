class Storage {
    constructor() {
        this.isFirstLaunch;
        this.data = {
            options: {
                musicVolume: 50,
                soundVolume: 50,
                glowingEffect: true
            }
        }
        this.data.scores = [];
    }

    load() {
        var storageData = localStorage.getItem('playerData');
        if (storageData != null)
            this.data = JSON.parse(storageData);

        $("#sliderMusic").val(this.data.options.musicVolume);
        $("#sliderSound").val(this.data.options.soundVolume);
        $("#glowEffectCheckbox").attr("checked", this.data.options.glowingEffect);
        if(!this.data.options.glowingEffect) {
            $('#glowEffect .value').html('Desactivated');
            gameCore.setGlowLayers(0);
        } else {
            gameCore.setGlowLayers(1);
        }
    }

    save() {
        this.data.options.musicVolume = Number($("#sliderMusic").val());
        this.data.options.soundVolume = Number($("#sliderSound").val());
        this.data.options.glowingEffect = $("#glowEffectCheckbox").prop('checked');

        var json = JSON.stringify(this.data);
        localStorage.setItem('playerData', json);
    }

    getData() {
        return this.data;
    }

    isNewRecord(_value) {
        var position = 0;
        var found = false;
        if (this.data.scores.length == 0)
            return new Array(true, 0);
        for (var i = 0; i < this.data.scores.length; i++) {
            if (this.data.scores[i].score <= _value) {
                position = i;
                found = true;
                return new Array(found, position);
            }
        }
        return new Array(found)
    }

    addNewRecord(_score, _index) {
        this.data.scores.splice(_index, 0, _score);
        if (this.data.scores.length > 5)
            this.data.scores.pop();

        this.save();
        gameUI.displayFromStorage();
    }
}
