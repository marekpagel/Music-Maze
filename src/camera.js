var PathCamera = function(camera) {
    this.camera = camera;
    this.rotationSteps = 15;
    
    return {
        move: function(position, rotation) {
            var dx = position[0] - self.camera.position.x;
            var dy = position[1] - self.camera.position.y;
            var dz = position[2] - self.camera.position.z;
        
            var steps = Math.max(Math.abs(dz), Math.max(Math.abs(dx), Math.abs(dy)));
        
            this._move(steps, [dx/steps,dy/steps,dz/steps], rotation);
        },
        
        _move: function(steps, delta, rotation) {
            if (steps == 0) {
                this._rotate(self.rotationSteps, rotation);
                return;
            }
            
            self.camera.position.x += delta[0];
            self.camera.position.y += delta[1];
            self.camera.position.z += delta[2];
        
            var caller = this;
	        setTimeout(function() {
	            caller._move(steps-1, delta, rotation);
	        }, 50);
        },
        
        /**
         * Assuming 45 degree turns at the moment
         */
        _rotate: function(steps, angle) {
            if (steps == 0) return;
        
            camera.rotation.y += angle / self.rotationSteps;
            
            var caller = this;
	        setTimeout(function() {
	            caller._rotate(steps-1, angle);
	        }, 50);
        }
	};
};

var DebugCamera = function(camera, keyboard) {
    this.camera   = camera;
    this.keyboard = keyboard;
    
    return {

	    move: function() {
		    if (self.keyboard.pressed("left")){
			    self.camera.rotation.set(0, self.camera.rotation.y + toRad(2 % 360), 0);
		    }
		
		    if (self.keyboard.pressed("right")){
			    self.camera.rotation.set(0, self.camera.rotation.y - toRad(2 % 360), 0);
		    }
		
		    var forward = new THREE.Vector3(0,0,-1);
		    forward.applyAxisAngle(new THREE.Vector3(0,1,0), self.camera.rotation.y);
		    forward.multiplyScalar(0.5);
		
		    if (self.keyboard.pressed("up")){
			    self.camera.position.add(forward);
		    }
		
		    if (self.keyboard.pressed("down")){
			    self.camera.position.sub(forward);
		    }
		    
		    console.log(camera.position);
	    }
	
	};
};
