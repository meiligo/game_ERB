export class SceneManager {
  constructor() {
    this.scenes = {};
    this.current = null;
    this.lock = false;
  }

  register(name, scene) {
    this.scenes[name] = scene;
  }

  async start(name) {
    await this.goto(name);
  }

  async goto(name) {
    if (this.lock) return;
    this.lock = true;

    if (this.current?.exit) this.current.exit();
    this.current = this.scenes[name];
    await this.current.enter();

    this.lock = false;
  }
}
