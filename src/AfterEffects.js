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
    this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(width,height),
            material);
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

AfterEffects.prototype.render = function(scene, camera) {
    this.renderer.render(scene, camera, this.target, true);
    this.quad.material.uniforms.tex.value = this.target;
    // TODO: connect this vector with music
    this.quad.material.uniforms.amount.value = new THREE.Vector2(0.00,0.03);
    this.renderer.render(this.scene, this.camera);
}
