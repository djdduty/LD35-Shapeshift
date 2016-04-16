function ClientScene() {
    this.scene = new Scene();
}

ClientScene.prototype.fromState = function(state) {
    this.scene.fromState(state);
}

ClientScene.prototype.update = function(delta) {
    this.scene.update(delta);
}
