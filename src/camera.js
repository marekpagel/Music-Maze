var PathCamera = function(camera) {
    this.camera = camera;
    this.rotationSteps = 15;
    this.moveTimeout = 25;
    this.rotationTimeout = 35;
    this.moves = []; // queue

    return {
        move2: function(pos, rot, end) {
            var moveTween = new TWEEN.Tween(self.camera.position)
                .to({x: pos[0], y: pos[1], z:pos[2]}, 1000);

            var rotateTween = new TWEEN.Tween(self.camera.rotation)
                .to({y: rot}, 1000)
                .onComplete(end);

            moveTween.chain(rotateTween);
            moveTween.start();
        },
        move: function(position, rotation, callback) {
            var dx = position[0] - self.camera.position.x;
            var dy = position[1] - self.camera.position.y;
            var dz = position[2] - self.camera.position.z;


            var steps = Math.max(Math.abs(dz), Math.max(Math.abs(dx), Math.abs(dy)));

            var caller = this;
            
            var callback = function() {
                currentMove = self.moves.shift();
                caller.move(currentMove[0][0], currentMove[0][1][1]);
            };
            
            var rotate = function() {
                caller._rotate(self.rotationSteps, rotation, callback);
            };

            this._move(steps, [dx/steps,dy/steps,dz/steps], rotate);
        },

        addMove: function(move) {
            self.moves.push(move);
        },
        
        getNextMove: function() {
            return self.moves[0];
        },
        
        nearNextMove: function() {
            var position = currentMove[0][0];

            var dx = Math.pow(position[0] - self.camera.position.x, 2);
            var dy = Math.pow(position[1] - self.camera.position.y, 2);
            var dz = Math.pow(position[2] - self.camera.position.z, 2);
            
            var dist = Math.sqrt(dx + dy + dz);
            return dist <= 25.0;
        },

        popQueue: function() {
            return self.moves.shift();
        },
        
        // for debugging only
        _getMoves: function() { return self.moves },

        _move: function(steps, delta, callback) {
            if (steps == 0) {
                if (!(callback == undefined)) {
                    callback();
                }

                return;
            }

            self.camera.position.x += delta[0];
            self.camera.position.y += delta[1];
            self.camera.position.z += delta[2];

            var caller = this;
            setTimeout(function() {
                caller._move(steps-1, delta, callback);
            }, self.moveTimeout);
        },

        /**
         * Assuming 45 degree turns at the moment
         */
        _rotate: function(steps, angle, callback) {
            if (steps == 0) {
                if (!(callback == undefined)) {
                    callback();
                }

                return;
            }

            camera.rotation.y += angle / self.rotationSteps;

            var caller = this;
            setTimeout(function() {
                caller._rotate(steps-1, angle, callback);
            }, self.rotationTimeout);
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
