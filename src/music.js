var Music = function() {
    var analyser, frequencyData, audioSrc, audioCtx, lastcolor = 0.45, isMuted = false, gainNode, aheadAnalyser, delayNode;

    var beatCutOff = 0;
    var beatTime = 0;

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
        levelHistory.push(0);
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
            this.lightColor = color;
        },

        updateRgbSplit: function() {
            // TODO: use something more reasonable
            // At first I thought that RGB split should happen with BASS.
            // So we need to also set a threshold and so on.
            analyser.getByteFrequencyData(frequencyData);
            var sum = 0;
            for (var i = 0; i < 128; ++i) {
                sum += frequencyData[i];
            }
            rgbSplitAmount.set(sum / (4096*255), 0);
        },

        rgbSplitAmount: rgbSplitAmount,
        lightColor: color,

        test: function() {
            console.log(this.getProbDist());
        },

        update: function() {
            aheadAnalyser.getByteFrequencyData(frequencyData);

            // get the average volume level
            var sum = 0;
            for(var j = 0; j < fftBinCount; j++) {
                sum += frequencyData[j];
            }

            level = sum / fftBinCount;

            levelHistory.push(level);
            levelHistory.shift(1);

            analyser.getByteFrequencyData(frequencyData);

            this.updateLightColor();

            // get the average volume level
            var sum = 0;
            for(var j = 0; j < fftBinCount; j++) {
                sum += frequencyData[j];
            }

            level = sum / fftBinCount;

            //detect peaks (beats)
            if (level > beatCutOff && level > 30){
                beatCutOff = level *1.1;
                beatTime = 0;
                rgbSplit = true;
            }else{
                if (beatTime <= 20){
                    beatTime ++;
                }else{
                    rgbSplit = false;
                    beatCutOff *= 0.97;
                    beatCutOff = Math.max(beatCutOff,30);
                }
            }

            if (rgbSplit) {
                this.updateRgbSplit();
            } else {
                rgbSplitAmount.set(0,0);
            }
        },

        getProbDist: function() {
            var dist = new Array(3);
            for (i = 0; i < 3; ++i) {
                dist[i] = 0;
            }
            var i = 0;
            for (; i < length/3; ++i) {
                dist[0] += levelHistory[i];
            }
            for (; i < 2*(length/3); ++i) {
                dist[1] += levelHistory[i];
            }
            for (; i < length; ++i) {
                dist[2] += levelHistory[i];
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
                isMuted = false;
            } else {
                gainNode.gain.value = 0;
                isMuted = true;
            }

        }
    };
}
