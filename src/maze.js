var halfPi = Math.PI / 2;
Maze = function ( scene, textureLoader) {
    this.imgServer = 'https://raw.githubusercontent.com/marekpagel/Music-Maze/master/img/';

    this.scene = scene;
    this.textureLoader = textureLoader;

    this.width = 20;
    this.len   = 100;

    this.ceilingTexture = textureLoader.load(this.imgServer + "ceiling.jpg", function(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 10);
        texture.needsUpdate = true;
    });

    this.wallTexture = textureLoader.load(this.imgServer + "wall.jpg", function(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.needsUpdate = true;
    });

    this.floorTexture = textureLoader.load(this.imgServer + "floor.jpg", function(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        texture.repeat.set(1, 4);
        texture.needsUpdate = true;
    })
};

Maze.prototype = {
    constructor: Maze,

    /**
     * Draw next iteration of the maze at a given position
     * prob is an array that decides probabilities of left, right and straight connectors (can have all 3, at least 1)
     *
     * // TODO fix weird behaviour of left vs right wall when dealing with rotated local space
     *
     * returns array of open connector points
     */
    next: function(position, rotation, prob) {
        var self = this;
        var mesh = new THREE.Mesh();

        var connectors = [];

        var leftRnd = Math.random();
        //leftRnd = 1;
        if (leftRnd < prob[0]) {
            // Todo: place the connector at a random spot in [20,80] range

            var leftWall1 = this._createLeftWall(self.len/5, [-10, 0, 4*self.len/5]);
            var leftWall2 = this._createLeftWall(3*self.len/5, [-10, 0, self.len/5]);
            mesh.add(leftWall2);
            mesh.add(leftWall1);

            //connectors.push([position[0]-self.len,position[1],position[2]+3*self.len/5]);
            connectors.push([]);
        } else {
            var leftWall = this._createLeftWall(self.len, [-10, 0, 40]);
            mesh.add(leftWall);
        }

        var rightRnd = Math.random();
        //rightRnd = 1;
        if (rightRnd < prob[1]) {
            // Todo: place the connector at a random spot in [20,80] range

            var rightWall1 = this._createRightWall(self.len/5, [10, 0, 4*self.len/5]);
            var rightWall2 = this._createRightWall(3*self.len/5, [10, 0, self.len/5]);
            mesh.add(rightWall1);
            mesh.add(rightWall2);

            connectors.push([]);
        } else {
            var rightWall = this._createRightWall(self.len, [10, 0, 40]);
            mesh.add(rightWall);
        }

        var frontRnd = Math.random();
        if (frontRnd < prob[2]) {
            connectors.push([]);
        } else {
            var backWall = this._createWall(self.width, self.width, self.wallTexture, [0, 0, -10], [0, 0, 0]);
            mesh.add(backWall);

            // awkward fix for weird positioning we have atm
            // TODO: remove this once coordinates are properly handled
            var backWall2 = this._createWall(self.width, self.width, self.wallTexture, [0, 0, 90], [0, 2*halfPi, 0]);
            mesh.add(backWall2);
        }

        var ceiling = this._createWall(self.width, self.len, self.ceilingTexture, [0, 10, 40], [halfPi, 0, 0]);
        var floorM = this._createWall(self.width, self.len, self.floorTexture, [0, -10, 40], [-halfPi, 0, 0]);

        mesh.add(ceiling);
        mesh.add(floorM);

        mesh.position.set(position[0],position[1],position[2]);
        mesh.rotation.set(rotation[0],rotation[1],rotation[2]);

        scene.add(mesh);
    },

    _createLeftWall: function(width, position) {
        return this._createWall(width, this.width, this.wallTexture, position, [0, halfPi, 0]);
    },

    _createRightWall: function(width, position) {
        return this._createWall(width, this.width, this.wallTexture, position, [0, -halfPi, 0]);
    },

    _createWall: function(width, height, texture, position, rotation) {
        var geometry = new THREE.PlaneGeometry(width, height, width, height);
        var material = new THREE.MeshLambertMaterial({ map: texture });
        var wall = new THREE.Mesh(geometry, material);

        wall.position.set(position[0], position[1], position[2]);
        wall.rotation.set(rotation[0], rotation[1], rotation[2]);

        return wall;
    }
};
