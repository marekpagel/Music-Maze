var PathCamera = function(camera) {
    this.camera = camera;
    this.moves = []; // queue

    return {
        move: function(pos, rot, callback) {
            var moveTween = new TWEEN.Tween(self.camera.position)
                .to(pos, 1000);

            if (!rot.equals(self.camera.rotation)) {
                var rotateTween = new TWEEN.Tween(self.camera.rotation)
                    .to(rot, 1000)
                    .onComplete(callback);

                moveTween.chain(rotateTween);
            } else {
                moveTween.onComplete(callback);
            }
            moveTween.start();
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

            if (self.keyboard.pressed("q")) {
                console.log(camera.position);
            }
        }

    };
};
