// DFS generator: adjacency matrix as input
export default function dfsSteps(input) {
  // input: csv-matrix string, e.g. '0,1,1;1,0,0;1,0,0'
  if (!input) return [];
  const rows = input.split(';');
  const matrix = rows.map(r => r.trim().split(',').map(Number));
  const n = matrix.length, steps = [];
  const visited = Array(n).fill(false);
  function dfs(v) {
    visited[v] = true;
    steps.push({ graph: matrix, highlight: [v], op: 'visit', visited: [...visited] });
    for (let u=0; u<n; ++u) {
      if (matrix[v][u] && !visited[u]) {
        steps.push({ graph: matrix, highlight: [v, u], op: 'edge'});
        dfs(u);
      }
    }
    steps.push({ graph: matrix, highlight: [v], op: 'back' });
  }
  dfs(0); // Старт из 0-й вершины
  return steps;
}

