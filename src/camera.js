var PathCamera = function(camera) {
    this.camera = camera;
    
    return {
        /*
	    function moveCamera() {
            i++;
	        if (i >= 35) { return; }
	
	        setTimeout(function() {
	            camera.position.z = camera.position.z -= 1;
	            
	            moveCamera();
	        }, 100);
	    }
	
	    function rotateCamera() {
            j++;
	        if (j >= 17) { return; }
	
	        setTimeout(function() {
	            camera.rotation.y += Math.PI / 30;
	            
	            rotateCamera();
	        }, 100);
	    }
	    */
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
	    }
	
	};
};
