AfterEffects = function(renderer, width, height) {
    vShader = document.getElementById('vShader').textContent;
    fShader = document.getElementById('fShader').textContent;
    this.renderer = renderer;
    var material = new THREE.ShaderMaterial( {
        uniforms: {
            tex: { type: 't'},
            amount: { type: 'v2'},
        },
        vertexShader: vShader,
        fragmentShader: fShader
    });
    this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1),
            material);
    this.quad.scale.set(width,height,1);
    this.scene = new THREE.Scene();
    this.scene.add(this.quad);
    this.camera = new THREE.OrthographicCamera(
                            width / - 2,
                            width / 2,
                            height / 2,
                            height / - 2,
                            -100, 100);
    this.target = new THREE.WebGLRenderTarget(width, height, {
        generateMipmaps: false
    });
}

AfterEffects.prototype.render = function(scene, camera, amount) {
    this.renderer.render(scene, camera, this.target, true);
    this.quad.material.uniforms.tex.value = this.target;
    amount.x /= this.target.width;
    amount.y /= this.target.height;
    this.quad.material.uniforms.amount.value = amount;
    this.renderer.render(this.scene, this.camera);
}

AfterEffects.prototype.setSize = function(width, height) {
    this.camera.projectionMatrix.makeOrthographic(
                            width / - 2,
                            width / 2,
                            height / 2,
                            height / - 2,
                            -100, 100);
    this.quad.scale.set(width, height, 1);
    this.target.setSize(width, height);
}
