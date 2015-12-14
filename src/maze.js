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

        texture.needsUpdate = true;
    })
};

Maze.prototype = {
    constructor: Maze,

    /**
     * Draw next iteration of the maze at a given position
     * prob is an array that decides probabilities of left, right and straight connectors (can have all 3, at least 1)
     *
     * returns array of open connector points
     */
    next: function(position, rotation, prob) {
        var self = this;
        var mesh = new THREE.Mesh();
        mesh.name = counter;

        var connectors = [];

        var leftRnd = Math.random();
        //leftRnd = 1;
        if (leftRnd < prob[0]) {
            var spot = parseInt(self.len/5 + Math.random() * 3 * self.len/5);
            var sl = spot - self.len/5;
            var sr = spot + self.len/5;
            var leftWall1 = this._createLeftWall(sl,
                    new THREE.Vector3(-10, 0, -self.len/10 -sl/2));
            var leftWall2 = this._createLeftWall(self.len - sr + self.len/5,
                    new THREE.Vector3(-10, 0, -self.len + (self.len - sr) / 2));

            mesh.add(leftWall1);
            mesh.add(leftWall2);

            connectors.push(this._getConnector(position, rotation, -spot, halfPi));
        } else {
            var leftWall = this._createLeftWall(self.len,
                    new THREE.Vector3(-10, 0, -60));
            mesh.add(leftWall);
        }

        var rightRnd = Math.random();
        if (rightRnd < prob[1]) {
            var spot = parseInt(self.len/5 + Math.random() * 3 * self.len/5);
            var sl = spot - self.len/5;
            var sr = spot + self.len/5;
            var rightWall1 = this._createRightWall(sl,
                    new THREE.Vector3(10, 0, -self.len/10 -sl/2));
            var rightWall2 = this._createRightWall(self.len - sr + self.len/5,
                    new THREE.Vector3(10, 0, -self.len + (self.len - sr) / 2));

            mesh.add(rightWall1);
            mesh.add(rightWall2);

            connectors.push(this._getConnector(position, rotation, -spot, -halfPi));
        } else {
            var rightWall = this._createRightWall(self.len,
                    new THREE.Vector3(10, 0, -60));
            mesh.add(rightWall);
        }

        var frontRnd = Math.random();
        if (frontRnd < prob[2] || (leftRnd >= prob[0] && rightRnd >= prob[1])) {
            connectors.push(this._getConnector(position, rotation, -5*self.len/5, 0));
        } else {
            var backWall = this._createWall(self.width, self.width, self.wallTexture,
                    new THREE.Vector3(0, 0, -100),
                    new THREE.Vector3());
            mesh.add(backWall);
        }

        var ceiling = this._createWall(self.width, self.len, self.ceilingTexture,
                new THREE.Vector3(0, 10, -60),
                new THREE.Vector3(halfPi, 0, 0));
        var floorM = this._createWall(self.width, self.len, self.floorTexture,
                new THREE.Vector3(0, -10, -60),
                new THREE.Vector3(-halfPi, 0, 0));

        mesh.add(ceiling);
        mesh.add(floorM);

        mesh.position.copy(position);
        mesh.rotation.setFromVector3(rotation);
        scene.add(mesh);
        
        return connectors;
    },

    _createLeftWall: function(width, position) {
        return this._createWall(width, this.width, this.wallTexture, position,
                new THREE.Vector3(0, halfPi, 0)
        );
    },

    _createRightWall: function(width, position) {
        return this._createWall(width, this.width, this.wallTexture, position,
                new THREE.Vector3(0, -halfPi, 0)
        );
    },

    _createWall: function(width, height, texture, position, rotation) {
        w = width / 20;
        h = height / 20;

        var geometry = new THREE.PlaneGeometry(width, height);
        var uvs = geometry.faceVertexUvs[ 0 ];
        uvs[ 0 ][ 0 ].set( 0, h );
        uvs[ 0 ][ 1 ].set( 0, 0 );
        uvs[ 0 ][ 2 ].set( w, h);
        uvs[ 1 ][ 0 ].set( 0, 0 );
        uvs[ 1 ][ 1 ].set( w, 0 );
        uvs[ 1 ][ 2 ].set( w, h);
        var material = new THREE.MeshLambertMaterial({ map: texture });
        var wall = new THREE.Mesh(geometry, material);

        wall.position.copy(position);
        wall.rotation.setFromVector3(rotation);

        return wall;
    },
    
    _getConnector: function(position, rotation, newPosition, newAngle) {
        var c = new THREE.Vector3(0,0,newPosition);
        c.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.y).add(position).round();
        var rot = rotation.clone();
        rot.copy(rotation);
        rot.y += newAngle;
        return {
            position: c,
            rotation: rot
        };
    }    
};
