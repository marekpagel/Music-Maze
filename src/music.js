var Music = function() {
    var analyser, frequencyData, audioSrc, audioCtx, lastcolor = 0.45, isMuted = false, gainNode;

    return {
        play: function() {
            // TODO: use a playlist?
            // TODO: stream the audio
            audioSrc.start(0);
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

        loadAudio: function(path, manager) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            var loader = new MusicLoader(manager);
            var caller = this;
            loader.load(path, function(response) {
                audioCtx.decodeAudioData(response, function(buffer) {
                    caller._initAudio(buffer);
                    loader.manager.itemEnd(path);
                })
            });
        },

        _initAudio: function(buffer) {
            audioSrc = audioCtx.createBufferSource();
            audioSrc.buffer = buffer;

            analyser = audioCtx.createAnalyser();
            analyser.smoothingTimeConstant = 0;
            gainNode = audioCtx.createGain();

            audioSrc.connect(analyser);
            analyser.connect(gainNode);
            gainNode.connect(audioCtx.destination)

            frequencyData = new Uint8Array(analyser.frequencyBinCount);

        }
    };
}
