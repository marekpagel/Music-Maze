var Music = function() {
    var analyser, frequencyData, audioSrc, audioCtx, lastcolor = 0.45, isMuted = false, gainNode;

    var audio = new Audio();
    audio.crossOrigin = 'Anonymous';
    document.body.appendChild(audio);

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.smoothingTimeConstant = 0;
    gainNode = audioCtx.createGain();

    analyser.connect(gainNode);
    gainNode.connect(audioCtx.destination)

    frequencyData = new Uint8Array(analyser.frequencyBinCount);

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
                audioSrc.connect(analyser);
                manager.itemEnd(url);
            };
            audio.load();
        },

        getLightColor: function() {
            analyser.getByteFrequencyData(frequencyData);
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

            return color;
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
