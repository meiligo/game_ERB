export class SceneManager {
  constructor({ ui, store }) {
    this.ui = ui;
    this.store = store;
    this.registry = new Map();
    this.current = null;
  }

  register(key, sceneClass) {
    this.registry.set(key, sceneClass);
  }

  async start(key) {
    await this.goto(key);
  }

  async goto(key) {
    const Scene = this.registry.get(key);
    if (!Scene) throw new Error(`Scene not found: ${key}`);

    if (this.current?.onExit) await this.current.onExit();
    this.current = new Scene({ ui: this.ui, store: this.store, scenes: this });
    if (this.current.onEnter) await this.current.onEnter();
  }
}
