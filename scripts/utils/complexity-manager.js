export class ComplexityManager {
  static getSortingComplexity(algorithmName) {
    const complexities = {
      bubble: {
        time: "O(n²)",
        space: "O(1)",
        name: "Сортировка пузырьком",
      },
      selection: {
        time: "O(n²)",
        space: "O(1)",
        name: "Сортировка выбором",
      },
      insertion: {
        time: "O(n²)",
        space: "O(1)",
        name: "Сортировка вставками",
      },
      quick: {
        time: "O(n log n)",
        space: "O(log n)",
        name: "Быстрая сортировка",
      },
      merge: {
        time: "O(n log n)",
        space: "O(n)",
        name: "Сортировка слиянием",
      },
    };

    return complexities[algorithmName] || complexities["bubble"];
  }

  static getTreeComplexity(algorithmName) {
    const complexities = {
      bst: {
        insert: "O(h)",
        search: "O(h)",
        delete: "O(h)",
        worst: "O(n)",
        space: "O(n)",
        name: "Бинарное дерево поиска",
      },
      avl: {
        insert: "O(log n)",
        search: "O(log n)",
        delete: "O(log n)",
        worst: "O(log n)",
        space: "O(n)",
        name: "AVL дерево",
      },
      heap: {
        insert: "O(log n)",
        search: "O(n)",
        delete: "O(log n)",
        worst: "O(n)",
        space: "O(n)",
        name: "Бинарная куча",
      },
    };

    return complexities[algorithmName] || complexities["bst"];
  }

  static getGraphComplexity(algorithmName) {
    const complexities = {
      bfs: {
        time: "O(V + E)",
        space: "O(V)",
        name: "Поиск в ширину (BFS)",
      },
      dfs: {
        time: "O(V + E)",
        space: "O(V)",
        name: "Поиск в глубину (DFS)",
      },
      dijkstra: {
        time: "O(V²)",
        space: "O(V)",
        name: "Алгоритм Дейкстры",
      },
    };

    return complexities[algorithmName] || complexities["bfs"];
  }
}
