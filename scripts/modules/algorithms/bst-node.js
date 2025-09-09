export class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.x = 0; // Позиция для визуализации
    this.y = 0; // Позиция для визуализации
    this.highlighted = false;
    this.visited = false;
  }

  // Метод для сброса состояния узла
  resetState() {
    this.highlighted = false;
    this.visited = false;
  }
}
