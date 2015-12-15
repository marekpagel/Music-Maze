var Music = function() {
    var analyser, frequencyData, audioSrc, audioCtx, lastcolor = 0.45, isMuted = false, gainNode, aheadAnalyser, delayNode;

    var beatParams = {
        beatCutOff:  0,
        beatTime:  0
    };

    var aheadBeatParams = {
        beatCutOff:  0,
        beatTime:  0
    };

    var rgbSplit = false;
    var rgbSplitAmount = new THREE.Vector2(0,0);

    var color = [1,1,1];

    var audio = new Audio();
    audio.crossOrigin = 'Anonymous';
    document.body.appendChild(audio);

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    aheadAnalyser = audioCtx.createAnalyser();
    delayNode = audioCtx.createDelay(2.0);
    analyser.smoothingTimeConstant = 0;
    gainNode = audioCtx.createGain();

    aheadAnalyser.connect(delayNode);
    delayNode.connect(analyser);
    analyser.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    var fftBinCount = analyser.frequencyBinCount;
    var levelHistory = [];
    var length = 256;
    for(var i = 0; i < length; i++) {
        levelHistory.push(Math.random() * 255);
    }

    frequencyData = new Uint8Array(fftBinCount);

    return {
        // TODO: use a playlist?
        play: function(waiting, playing) {
            audio.onwaiting = waiting;
            audio.onplaying = playing;
            audio.play();
        },

        prepareMusic: function(url, manager) {
            manager.itemStart(url);
            audio.src = url;
            audio.oncanplay = function() {
                audioSrc = audioCtx.createMediaElementSource(audio);
                audioSrc.connect(aheadAnalyser);
                manager.itemEnd(url);
            };
            audio.load();
        },

        updateLightColor: function() {
            var sum = 0;
            for (var i = 0; i < 128; i++) {
                sum += frequencyData[i];
            }
            ambientColor = sum / 128 / 255;
            // [0.5, 0.8] -> [0.1, 1]
            // approximation based on one sample song
            // right now aplification is quite useless
            aplifiedAmbientColor = (ambientColor-0.5)/(0.3) * 0.9 + 0.2
            var colordif = Math.abs(aplifiedAmbientColor - lastcolor);

            color = [1,1,1];
            if ( colordif > 0.12) {
                color = [1, 1, 1];
            } else if ( colordif > 0.09) {
                color = [0.7, 0.7, 0.7];
            } else if (colordif > 0.05) {
                color = [0.3, 0.3, 0.3];
            }

            lastcolor = aplifiedAmbientColor;
            this.lightColor = [aplifiedAmbientColor, aplifiedAmbientColor, aplifiedAmbientColor];
        },

        updateRgbSplit: function() {
            analyser.getByteFrequencyData(frequencyData);
            var sum = 0;
            for (var i = 0; i < 128; ++i) {
                sum += frequencyData[i];
            }
            rgbSplitAmount.set(sum / (4*255), 0);
        },

        rgbSplitAmount: rgbSplitAmount,
        lightColor: color,

        test: function() {
            console.log(this.getProbDist());
        },

        update: function() {
            aheadAnalyser.getByteFrequencyData(frequencyData);
            var level = this._calc_level();

            levelHistory.push(level);
            levelHistory.shift(1);

            analyser.getByteFrequencyData(frequencyData);

            this.updateLightColor();

            level = this._calc_level();
            var onBeat = function() {
                rgbSplit = true;
            };

            var offBeat = function() {
                rgbSplit = false;
            };
            this._detectBeat(level, beatParams, onBeat, offBeat);
            if (rgbSplit) {
                this.updateRgbSplit();
            } else {
                rgbSplitAmount.set(0,0);
            }
        },

        _calc_level: function(anal) {
            // get the average volume level
            var sum = 0;
            for(var j = 0; j < fftBinCount; j++) {
                sum += frequencyData[j];
            }

            return sum / 128;
        },

        _detectBeat: function(level, params, onBeat, offBeat) {
            //detect peaks (beats)
            if (level > params.beatCutOff && level > 40){
                params.beatCutOff = level *1.1;
                params.beatTime = 0;
                onBeat();
            }else{
                if (params.beatTime <= 17){
                    params.beatTime ++;
                }else{
                    if (typeof offBeat !== 'undefined')
                        offBeat();
                    params.beatCutOff *= 0.95;
                    params.beatCutOff = Math.max(params.beatCutOff,40);
                }
            }
        },

        getProbDist: function() {
            var dist = new Array(3);
            for (i = 0; i < 3; ++i) {
                dist[i] = 0;
            }

            var i = 0;

            var onBeat = function() {
                dist[0] += 1;
            };

            for (; i < length/3; ++i) {
                this._detectBeat(levelHistory[i], aheadBeatParams, onBeat);
            }

            onBeat = function() {
                dist[1] += 1;
            };

            for (; i < 2*(length/3); ++i) {
                this._detectBeat(levelHistory[i], aheadBeatParams, onBeat);
            }

            onBeat = function() {
                dist[2] += 1;
            };

            for (; i < length; ++i) {
                this._detectBeat(levelHistory[i], aheadBeatParams, onBeat);
            }
            var sum = dist[0] + dist[1] + dist[2];
            for (i = 0; i < 3; ++i) {
                dist[i] /= sum;
            }
            return dist;
        },

        mute: function() {
            if (isMuted) {
                gainNode.gain.value = 1;
                muteToggleBtn.src="img/speaker100.svg"
                isMuted = false;
            } else {
                gainNode.gain.value = 0;
                muteToggleBtn.src="img/speaker113.svg"
                isMuted = true;
            }

        },

        get currentTime () {
            return audio.currentTime;
        }
    };
}
