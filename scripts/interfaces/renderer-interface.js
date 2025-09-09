export class RendererInterface {
  constructor(container) {
    if (this.constructor === RendererInterface) {
      throw new Error("Cannot instantiate abstract class");
    }
    this.container = container;
  }

  init() {
    throw new Error("Method 'init()' must be implemented");
  }

  render(data, highlights = [], sortedIndices = []) {
    throw new Error("Method 'render()' must be implemented");
  }

  clear() {
    throw new Error("Method 'clear()' must be implemented");
  }

  resize(width, height) {
    throw new Error("Method 'resize()' must be implemented");
  }
}
