export class GraphBase {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  // Базовые методы для графов
  addNode(id, value) {
    throw new Error("Method 'addNode()' must be implemented");
  }

  addEdge(source, target, weight) {
    throw new Error("Method 'addEdge()' must be implemented");
  }

  // Алгоритмы обхода
  *bfs(startNode) {
    throw new Error("Method 'bfs()' must be implemented");
  }

  *dfs(startNode) {
    throw new Error("Method 'dfs()' must be implemented");
  }

  *dijkstra(startNode, endNode) {
    throw new Error("Method 'dijkstra()' must be implemented");
  }
}
