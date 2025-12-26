import bubbleSortSteps from './modules/algorithms/bubble-sort.js';
import bstSteps from './modules/algorithms/bst.js';
import dfsSteps from './modules/algorithms/graph-dfs.js';
// TODO: добавьте quickSortSteps, heapSortSteps, mergeSortSteps, bfsSteps, dijkstraSteps аналогично.

const algorithmsRegistry = {
  sorting: {
    bubbleSort: bubbleSortSteps,
    // quickSort: quickSortSteps,
    // heapSort: heapSortSteps,
    // mergeSort: mergeSortSteps
  },
  trees: {
    bstSteps
  },
  graphs: {
    dfs: dfsSteps
    // bfs: bfsSteps, dijkstra: dijkstraSteps
  }
};
export default algorithmsRegistry;
