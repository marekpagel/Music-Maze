var Maze = function(scene, textureLoader) {
    this.scene = scene;
    this.textureLoader = textureLoader;

    this.width = 20;
    this.len   = 100;
    
    this.wallColor    = [0x555555, 0x333333];
    this.ceilingColor = 0x111111;
    
    this.floorTexture = textureLoader.load('http://cglearn.codelight.eu/files/course/7/textures/wallTexture2.jpg', function(texture) {
	    texture.wrapS = THREE.RepeatWrapping;
	    texture.wrapT = THREE.RepeatWrapping;
	    texture.repeat.set(2, 10);
	    texture.needsUpdate = true;
	});

    return {
        /**
         * Draw next iteration of the maze at a given position
         * prob is an array that decides probabilities of left, right and straight connectors (can have all 3, at least 1)
         *
         * returns array of open connector points
         */
        next: function(position, rotation, prob) {
			var halfPi = Math.PI / 2;
			var mesh = new THREE.Mesh();
			
			var connectors = [];
			
            var leftRnd = Math.random();
            //leftRnd = 1;
            if (leftRnd < prob[0]) {
                // Todo: place the connector at a random spot in [20,80] range
            
				var leftWall1 = this._createWall(self.wallColor[0], self.len/5, self.width);
				leftWall1.position.set(-10, 0, 4*self.len/5);
				leftWall1.rotation.set(0, halfPi, 0);
				mesh.add(leftWall1);

				var leftWall2 = this._createWall(self.wallColor[0], 3*self.len/5, self.width);
				leftWall2.position.set(-10, 0, self.len/5);
				leftWall2.rotation.set(0, halfPi, 0);
				mesh.add(leftWall2);
				
				connectors.push([]);
			} else {
			    var leftWall = this._createWall(self.wallColor[0], self.len, self.width);
			    leftWall.position.set(-10, 0, 40);
			    leftWall.rotation.set(0, halfPi, 0);
			    mesh.add(leftWall);
			}
			
			var rightRnd = Math.random();
			//rightRnd = 1;
			if (rightRnd < prob[1]) {
			    // Todo: place the connector at a random spot in [20,80] range
			
				var rightWall1 = this._createWall(self.wallColor[1], 1*self.len/5, self.width);
				rightWall1.position.set(10, 0, 4*self.len/5);
				rightWall1.rotation.set(0, -halfPi, 0);
				mesh.add(rightWall1);

				var rightWall2 = this._createWall(self.wallColor[1], 3*self.len/5, self.width);
				rightWall2.position.set(10, 0, 1*self.len/5);
				rightWall2.rotation.set(0, -halfPi, 0);
				mesh.add(rightWall2);

				connectors.push([]);
			} else {
			    var rightWall = this._createWall(self.wallColor[1], self.len, self.width);
			    rightWall.position.set(10, 0, 40);
			    rightWall.rotation.set(0, -halfPi, 0);
			    mesh.add(rightWall);
			}
			
			var frontRnd = Math.random();
			if (frontRnd < prob[2]) {
				connectors.push([]);
		    } else {
		        var backWall = this._createWall(0x444444, self.width, self.width);
		        backWall.position.set(0, 0, -10);
		        mesh.add(backWall);
		    }
			
			var ceiling = this._createWall(self.ceilingColor, self.width, self.len);
			ceiling.position.set(0, 10, 40);
			ceiling.rotation.set(halfPi, 0, 0);
			mesh.add(ceiling);
			
			var floor = this._createWall(0x222222, self.width, self.len);
			floor.position.set(0, -10, 40);
			floor.rotation.set(-halfPi, 0, 0);

			floor.material = new THREE.MeshLambertMaterial({ map: self.floorTexture });
			mesh.add(floor);

			mesh.position.set(position[0],position[1],position[2]);
			mesh.rotation.set(rotation[0],rotation[1],rotation[2]);
			
			scene.add(mesh);
        },
        
		_createWall: function(colorCode, width, height) {
			var geometry = new THREE.PlaneGeometry(width, height, width, height);
			var material = new THREE.MeshBasicMaterial({color: colorCode});
			var wall = new THREE.Mesh(geometry, material);
			
			return wall;
		}
    };
};
