import { BSTNode } from "./bst-node.js";

export class BinarySearchTree {
  static timeComplexity = {
    insert: "O(h)",
    search: "O(h)",
    delete: "O(h)",
    worst: "O(n)",
  };
  static spaceComplexity = "O(n)";
  static algorithmName = "Бинарное дерево поиска";

  constructor() {
    this.root = null;
    this.comparisons = 0;
    this.operations = 0;
  }

  // Вставка нового значения
  insert(value) {
    this.operations++;
    const newNode = new BSTNode(value);

    if (this.root === null) {
      this.root = newNode;
      return { node: newNode, comparisons: this.comparisons };
    }

    return this.insertNode(this.root, newNode);
  }

  insertNode(node, newNode) {
    this.comparisons++;

    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
        newNode.parent = node;
        return { node: newNode, comparisons: this.comparisons };
      } else {
        return this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
        newNode.parent = node;
        return { node: newNode, comparisons: this.comparisons };
      } else {
        return this.insertNode(node.right, newNode);
      }
    }
  }

  // Поиск значения
  find(value) {
    this.comparisons = 0;
    this.operations++;
    return this.findNode(this.root, value);
  }

  findNode(node, value) {
    if (node === null) {
      return { node: null, comparisons: this.comparisons };
    }

    this.comparisons++;
    if (value === node.value) {
      return { node, comparisons: this.comparisons };
    } else if (value < node.value) {
      return this.findNode(node.left, value);
    } else {
      return this.findNode(node.right, value);
    }
  }

  // Поиск минимального значения в поддереве
  findMinNode(node) {
    if (node.left === null) {
      return node;
    } else {
      return this.findMinNode(node.left);
    }
  }

  // Удаление значения
  remove(value) {
    this.comparisons = 0;
    this.operations++;
    this.root = this.removeNode(this.root, value);
    return { comparisons: this.comparisons };
  }

  removeNode(node, value) {
    if (node === null) {
      return null;
    }

    this.comparisons++;
    if (value < node.value) {
      node.left = this.removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this.removeNode(node.right, value);
      return node;
    } else {
      // Узел с одним потомком или без потомков
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      // Узел с двумя потомками
      const minNode = this.findMinNode(node.right);
      node.value = minNode.value;
      node.right = this.removeNode(node.right, minNode.value);
      return node;
    }
  }

  // Обход дерева в порядке возрастания
  inOrderTraversal(node = this.root, result = []) {
    if (node !== null) {
      this.inOrderTraversal(node.left, result);
      result.push(node.value);
      this.inOrderTraversal(node.right, result);
    }
    return result;
  }

  // Сброс подсветки всех узлов
  resetHighlights() {
    this.traverseAndReset(this.root);
  }

  traverseAndReset(node) {
    if (node !== null) {
      node.resetState();
      this.traverseAndReset(node.left);
      this.traverseAndReset(node.right);
    }
  }

  // Подсчет высоты дерева
  getHeight(node = this.root) {
    if (node === null) {
      return 0;
    }

    const leftHeight = this.getHeight(node.left);
    const rightHeight = this.getHeight(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  // Подсчет количества узлов
  getNodeCount(node = this.root) {
    if (node === null) {
      return 0;
    }

    return 1 + this.getNodeCount(node.left) + this.getNodeCount(node.right);
  }

  // Очистка дерева
  clear() {
    this.root = null;
    this.comparisons = 0;
    this.operations = 0;
  }
}
