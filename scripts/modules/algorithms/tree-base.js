export class TreeBase {
  constructor() {
    this.root = null;
  }

  // Базовые методы для деревьев
  insert(value) {
    throw new Error("Method 'insert()' must be implemented");
  }

  remove(value) {
    throw new Error("Method 'remove()' must be implemented");
  }

  search(value) {
    throw new Error("Method 'search()' must be implemented");
  }

  // Метод для визуализации
  *traverse() {
    throw new Error("Method 'traverse()' must be implemented");
  }
}
