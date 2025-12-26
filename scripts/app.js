import StateManager from "./state/state-manager.js";
import algorithmsRegistry from "./algorithms-registry.js";
import { ArrayRenderer } from "./modules/renderer/array-renderer.js";
import { TreeRenderer } from "./modules/renderer/tree-renderer.js";
import { GraphRenderer } from "./modules/renderer/graph-renderer.js";

const stateManager = new StateManager(algorithmsRegistry);
const arrayRenderer = new ArrayRenderer();
const treeRenderer = new TreeRenderer();
const graphRenderer = new GraphRenderer();

function showSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(`${section}-section`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.nav-btn[data-section="${section}"]`).classList.add('active');
  document.querySelectorAll('.stats-section').forEach(stat => stat.style.display = 'none');
  if (section === 'sorting') {
    document.getElementById('sorting-stats').style.display = '';
  } else if (section === 'trees') {
    document.getElementById('tree-stats').style.display = '';
  } else if (section === 'graphs') {
    document.getElementById('graph-stats').style.display = '';
  }
}

Array.from(document.querySelectorAll('.nav-btn')).forEach(btn => {
  btn.onclick = () => {
    showSection(btn.dataset.section);
    stateManager.setCategory(btn.dataset.section);
    handleAlgorithmSelectUpdate(btn.dataset.section);
  };
});

function handleAlgorithmSelectUpdate(section) {
  if (section === 'sorting') {
    document.getElementById('algorithm-select').onchange = (e) => {
      stateManager.setAlgorithm(algorithmValueFromUi(e.target.value));
      // Обновляем inputData напрямую из поля массива
      const arrRaw = document.getElementById('inputArray')?.value;
      if (arrRaw) {
        const arr = arrRaw.split(',').map(Number).filter(x => !isNaN(x));
        stateManager.setInputData(arr);
      }
      stateManager.generateSteps();
    };
    stateManager.setAlgorithm(algorithmValueFromUi(document.getElementById('algorithm-select').value));
    // Обязательно зачитываем массив из inputArray (инициализация)
    let defaultArr = [8, 2, 3, 5, 7, 1];
    const inputArrStr = document.getElementById('inputArray')?.value;
    if (inputArrStr) {
      const arr = inputArrStr.split(',').map(Number).filter(x => !isNaN(x));
      if (arr.length > 0) defaultArr = arr;
    }
    stateManager.setInputData(defaultArr);
    stateManager.generateSteps();
    document.getElementById('generate-btn').onclick = () => {
      const size = parseInt(document.getElementById('array-size').value) || 20;
      const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90 + 10));
      document.getElementById('inputArray').value = arr.join(',');
      stateManager.setInputData(arr);
      stateManager.generateSteps();
    };
    document.getElementById('inputArray').oninput = (e) => {
      const arr = e.target.value.split(',').map(Number).filter(x => !isNaN(x));
      stateManager.setInputData(arr);
      stateManager.generateSteps();
    };
    document.getElementById('start-btn').onclick = stateManager.play.bind(stateManager);
    document.getElementById('pause-btn').onclick = stateManager.pause.bind(stateManager);
    document.getElementById('step-btn').onclick = stateManager.stepForward.bind(stateManager);
    document.getElementById('resetBtn') && (document.getElementById('resetBtn').onclick = stateManager.reset.bind(stateManager));
    document.getElementById('array-size').oninput = (e) => {
      document.getElementById('size-value').textContent = e.target.value;
    };
    document.getElementById('speed').oninput = (e) => {
      document.getElementById('speed-value').textContent = e.target.value;
      stateManager.setSpeed(1100 - parseInt(e.target.value) * 100); // 1..10 -> 1000..100ms
    }
  } else if (section === 'trees') {
    document.getElementById('tree-algorithm-select').onchange = (e) => {
      stateManager.setAlgorithm('bstSteps'); // Для примера только BST
      stateManager.generateSteps();
    };
    document.getElementById('insert-btn').onclick = () => {
      let txt = document.getElementById('treeOpsInput');
      if (!txt) {
        txt = document.createElement('textarea');
        txt.id = 'treeOpsInput';
        txt.value = "insert 5";
        document.getElementById('trees-section').appendChild(txt);
      }
      txt.value += (txt.value ? ', ' : '') + 'insert ' + Math.floor(Math.random() * 90 + 10);
      stateManager.setInputData(txt.value);
      stateManager.generateSteps();
    };
    document.getElementById('remove-btn').onclick = () => {
      let txt = document.getElementById('treeOpsInput');
      if (!txt) return;
      txt.value += (txt.value ? ', ' : '') + 'delete ' + Math.floor(Math.random() * 90 + 10);;
      stateManager.setInputData(txt.value);
      stateManager.generateSteps();
    };
    document.getElementById('search-btn').onclick = () => {
      let txt = document.getElementById('treeOpsInput');
      if (!txt) return;
      txt.value += (txt.value ? ', ' : '') + 'search ' + Math.floor(Math.random() * 90 + 10);
      stateManager.setInputData(txt.value);
      stateManager.generateSteps();
    };
    document.getElementById('clear-tree-btn').onclick = () => {
      let txt = document.getElementById('treeOpsInput');
      if (txt) txt.value = '';
      stateManager.setInputData('');
      stateManager.generateSteps();
    };
    document.getElementById('treeOpsInput').onchange = (e) => {
      stateManager.setInputData(e.target.value);
      stateManager.generateSteps();
    }
  } else if (section === 'graphs') {
    document.getElementById('graph-algorithm-select').onchange = (e) => {
      stateManager.setAlgorithm(e.target.value);
      stateManager.generateSteps();
    }
    document.getElementById('add-node-btn').onclick = () => {
      let txt = document.getElementById('graphInput');
      if (!txt) {
        txt = document.createElement('textarea');
        txt.id = 'graphInput';
        txt.value = "0,1;1,0";
        document.getElementById('graphs-section').appendChild(txt);
      } else {
        const n = txt.value.split(';').length;
        const rows = txt.value.split(';').map(row => row.trim().split(',').map(Number));
        rows.forEach(row => row.push(0));
        rows.push(Array(n + 1).fill(0));
        txt.value = rows.map(row => row.join(',')).join(';');
      }
      stateManager.setInputData(txt.value);
      stateManager.generateSteps();
    };
    document.getElementById('add-edge-btn').onclick = () => {
      let txt = document.getElementById('graphInput');
      if (!txt) return;
      const n = txt.value.split(';').length;
      if (n < 2) return;
      const i = Math.floor(Math.random() * n), j = (i + 1 + Math.floor(Math.random() * (n - 1))) % n;
      const rows = txt.value.split(';').map(row => row.trim().split(',').map(Number));
      rows[i][j] = 1; rows[j][i] = 1;
      txt.value = rows.map(row => row.join(',')).join(';');
      stateManager.setInputData(txt.value);
      stateManager.generateSteps();
    };
    document.getElementById('run-graph-btn').onclick = () => {
      stateManager.generateSteps();
    };
    document.getElementById('clear-graph-btn').onclick = () => {
      let txt = document.getElementById('graphInput');
      if (txt) txt.value = '';
      stateManager.setInputData('');
      stateManager.generateSteps();
    };
    document.getElementById('graphInput').onchange = (e) => {
      stateManager.setInputData(e.target.value);
      stateManager.generateSteps();
    };
  }
}
function algorithmValueFromUi(val) {
  if (val === "bubble") return "bubbleSort";
  if (val === "quick") return "quickSort";
  if (val === "heap") return "heapSort";
  if (val === "merge") return "mergeSort";
  return val;
}
showSection('sorting');
handleAlgorithmSelectUpdate('sorting');

stateManager.subscribe((state) => {
  if (state.currentCategory === 'sorting') {
    document.getElementById('visualization-container').innerHTML = '';
    if (state.visualizationState.length)
      arrayRenderer.draw(state.visualizationState[state.currentStepIndex], document.getElementById('visualization-container'));
  } else if (state.currentCategory === 'trees') {
    document.getElementById('tree-visualization-container').innerHTML = '';
    if (state.visualizationState.length)
      treeRenderer.draw(state.visualizationState[state.currentStepIndex], document.getElementById('tree-visualization-container'));
  } else if (state.currentCategory === 'graphs') {
    document.getElementById('graph-visualization-container').innerHTML = '';
    if (state.visualizationState.length)
      graphRenderer.draw(state.visualizationState[state.currentStepIndex], document.getElementById('graph-visualization-container'));
  }
  document.getElementById('sorting-stats').style.display = state.currentCategory === 'sorting' ? '' : 'none';
  document.getElementById('tree-stats').style.display = state.currentCategory === 'trees' ? '' : 'none';
  document.getElementById('graph-stats').style.display = state.currentCategory === 'graphs' ? '' : 'none';
});
