MusicLoader = function ( manager ) {
    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
};

MusicLoader.prototype = {
    constructor: MusicLoader,

    load: function(url, onLoad) {
        var scope = this;
        var cached = THREE.Cache.get(url);
        if (cached !== undefined) {
            if (onLoad) {
                setTimeout( function() {
                    onLoad(cached);
                }, 0);
            }
            return cached;
        }

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.addEventListener('load', function(event) {
            var response = event.target.response;
            THREE.Cache.add(url, response);
            if (onLoad) onLoad(response);
            //scope.manager.itemEnd(url);
        }, false);

        request.addEventListener('error', function(event) {
            scope.manager.itemError(url);
        }, false);
        request.crossOrigin = 'Anonymous';
        request.send(null);
        scope.manager.itemStart(url);
        return request;
    }
};
