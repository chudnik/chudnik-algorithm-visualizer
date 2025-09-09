import EventBus from "./core/event-bus.js";
import { StateManager } from "./core/state-manager.js";
import { SVGRenderer } from "./modules/renderer/svg-renderer.js";
import { BubbleSort } from "./modules/algorithms/bubble-sort.js";
import { generateRandomArray } from "./utils/random-generator.js";

class AlgorithmVisualizer {
  constructor() {
    console.log("Инициализация приложения...");
    this.stateManager = new StateManager();
    this.renderer = null;
    this.treeRenderer = null;
    this.graphRenderer = null;
    this.currentAlgorithm = null;
    this.animationId = null;
    this.isSorting = false;
    this.animationSpeed = 500;
    this.currentSection = "sorting";

    this.initializeComponents();
    this.setupEventListeners();

    console.log("Приложение инициализировано");
  }

  initializeComponents() {
    console.log("Инициализация компонентов...");

    // Инициализация рендерера для сортировок
    const container = document.getElementById("visualization-container");
    if (!container) {
      console.error("Контейнер для визуализации не найден!");
      return;
    }

    this.renderer = new SVGRenderer(container);
    this.renderer.init();

    // Инициализация рендерера для деревьев
    const treeContainer = document.getElementById(
      "tree-visualization-container"
    );
    if (treeContainer) {
      this.treeRenderer = new SVGRenderer(treeContainer);
      this.treeRenderer.init();
    }

    // Инициализация рендерера для графов
    const graphContainer = document.getElementById(
      "graph-visualization-container"
    );
    if (graphContainer) {
      this.graphRenderer = new SVGRenderer(graphContainer);
      this.graphRenderer.init();
    }

    // Загрузка начального состояния
    const initialArray = generateRandomArray(20);
    this.stateManager.setState({
      array: initialArray,
      algorithm: "bubble",
      speed: 5,
      isSorting: false,
      stats: { comparisons: 0, swaps: 0, iterations: 0 },
      currentSection: "sorting",
    });

    // Первоначальная отрисовка
    this.renderArray();

    console.log("Компоненты инициализированы");
  }

  setupEventListeners() {
    console.log("Настройка обработчиков событий...");

    // Навигация между разделами
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const section = e.target.dataset.section;
        this.switchSection(section);
      });
    });

    // Обработчики для раздела сортировок
    document.getElementById("generate-btn").addEventListener("click", () => {
      const size = parseInt(document.getElementById("array-size").value);
      this.generateNewArray(size);
    });

    document.getElementById("start-btn").addEventListener("click", () => {
      this.startVisualization();
    });

    document.getElementById("pause-btn").addEventListener("click", () => {
      this.pauseVisualization();
    });

    document.getElementById("step-btn").addEventListener("click", () => {
      this.stepVisualization();
    });

    document
      .getElementById("algorithm-select")
      .addEventListener("change", (e) => {
        this.selectAlgorithm(e.target.value);
      });

    document.getElementById("array-size").addEventListener("input", (e) => {
      document.getElementById("size-value").textContent = e.target.value;
    });

    document.getElementById("speed").addEventListener("input", (e) => {
      document.getElementById("speed-value").textContent = e.target.value;
      this.changeSpeed(parseInt(e.target.value));
    });

    // Обработчики для раздела деревьев
    document.getElementById("insert-btn")?.addEventListener("click", () => {
      this.insertTreeNode();
    });

    document.getElementById("remove-btn")?.addEventListener("click", () => {
      this.removeTreeNode();
    });

    document.getElementById("search-btn")?.addEventListener("click", () => {
      this.searchTreeNode();
    });

    document.getElementById("clear-tree-btn")?.addEventListener("click", () => {
      this.clearTree();
    });

    document
      .getElementById("tree-algorithm-select")
      ?.addEventListener("change", (e) => {
        this.selectTreeAlgorithm(e.target.value);
      });

    // Обработчики для раздела графов
    document.getElementById("add-node-btn")?.addEventListener("click", () => {
      this.addGraphNode();
    });

    document.getElementById("add-edge-btn")?.addEventListener("click", () => {
      this.addGraphEdge();
    });

    document.getElementById("run-graph-btn")?.addEventListener("click", () => {
      this.runGraphAlgorithm();
    });

    document
      .getElementById("clear-graph-btn")
      ?.addEventListener("click", () => {
        this.clearGraph();
      });

    document
      .getElementById("graph-algorithm-select")
      ?.addEventListener("change", (e) => {
        this.selectGraphAlgorithm(e.target.value);
      });

    // Обработка изменения размера окна
    window.addEventListener("resize", () => {
      this.handleResize();
    });

    console.log("Обработчики событий настроены");
  }

  switchSection(section) {
    console.log("Переключение на раздел:", section);

    // Обновляем активную кнопку навигации
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    document
      .querySelector(`[data-section="${section}"]`)
      .classList.add("active");

    // Скрываем все разделы и показываем выбранный
    document.querySelectorAll(".section").forEach((s) => {
      s.classList.remove("active");
    });

    document.getElementById(`${section}-section`).classList.add("active");

    // Останавливаем текущую визуализацию
    this.pauseVisualization();

    // Обновляем состояние
    this.stateManager.setState({ currentSection: section });
    this.currentSection = section;

    // Сбрасываем статистику
    this.resetStats();
  }

  // Методы для раздела сортировок
  selectAlgorithm(algorithmName) {
    console.log("Выбор алгоритма:", algorithmName);
    this.pauseVisualization();

    switch (algorithmName) {
      case "bubble":
        this.currentAlgorithm = new BubbleSort();
        break;
      // Добавьте другие алгоритмы по мере реализации
      default:
        this.currentAlgorithm = new BubbleSort();
    }

    this.stateManager.setState({ algorithm: algorithmName });
    this.updateAlgorithmDescription(algorithmName);
  }

  generateNewArray(size) {
    console.log("Генерация нового массива размером", size);
    this.pauseVisualization();
    const newArray = generateRandomArray(size);
    this.stateManager.setState({
      array: newArray,
      stats: { comparisons: 0, swaps: 0, iterations: 0 },
    });
    this.renderArray();
  }

  renderArray(highlights = [], sortedIndices = []) {
    const state = this.stateManager.getState();
    if (this.renderer && state.array) {
      this.renderer.render(state.array, highlights, sortedIndices);
    }
  }

  startVisualization() {
    if (this.isSorting) return;

    const state = this.stateManager.getState();
    if (!this.currentAlgorithm) {
      this.selectAlgorithm(state.algorithm);
    }

    console.log("Запуск алгоритма:", state.algorithm);
    this.isSorting = true;
    this.currentAlgorithm.start(state.array);
    this.stateManager.setState({
      stats: { comparisons: 0, swaps: 0, iterations: 0 },
    });

    this.animateSort();
  }

  pauseVisualization() {
    this.isSorting = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  stepVisualization() {
    if (this.isSorting) return;

    const state = this.stateManager.getState();
    if (!this.currentAlgorithm) {
      this.selectAlgorithm(state.algorithm);
    }

    if (!this.currentAlgorithm.generator) {
      this.currentAlgorithm.start(state.array);
      this.stateManager.setState({
        stats: { comparisons: 0, swaps: 0, iterations: 0 },
      });
    }

    const result = this.currentAlgorithm.next();
    if (!result.done) {
      this.updateStateAndRender(result.value);
    } else {
      console.log("Алгоритм завершен");
      this.isSorting = false;
    }
  }

  animateSort() {
    if (!this.isSorting) return;

    const result = this.currentAlgorithm.next();

    if (!result.done) {
      this.updateStateAndRender(result.value);

      setTimeout(() => {
        this.animationId = requestAnimationFrame(() => this.animateSort());
      }, this.animationSpeed);
    } else {
      console.log("Алгоритм завершен");
      this.isSorting = false;
    }
  }

  updateStateAndRender(stepData) {
    const currentStats = this.stateManager.getState().stats;
    const newStats = {
      comparisons: stepData.comparisons || currentStats.comparisons,
      swaps: stepData.swaps || currentStats.swaps,
      iterations: currentStats.iterations + 1,
    };

    this.stateManager.setState({
      array: stepData.array,
      stats: newStats,
    });

    this.renderArray(stepData.highlights || [], stepData.sortedIndices || []);

    this.updateStats();
  }

  updateStats() {
    const stats = this.stateManager.getState().stats;

    document.getElementById("comparisons").textContent = stats.comparisons;
    document.getElementById("swaps").textContent = stats.swaps;
    document.getElementById("iterations").textContent = stats.iterations;
  }

  resetStats() {
    this.stateManager.setState({
      stats: { comparisons: 0, swaps: 0, iterations: 0 },
    });
    this.updateStats();
  }

  changeSpeed(speed) {
    this.animationSpeed = 1100 - speed * 100;
  }

  handleResize() {
    if (this.renderer) {
      const container = document.getElementById("visualization-container");
      this.renderer.resize(container.clientWidth, container.clientHeight);
      this.renderArray();
    }

    if (this.treeRenderer && this.currentSection === "trees") {
      const container = document.getElementById("tree-visualization-container");
      this.treeRenderer.resize(container.clientWidth, container.clientHeight);
      // Перерисовка дерева
    }

    if (this.graphRenderer && this.currentSection === "graphs") {
      const container = document.getElementById(
        "graph-visualization-container"
      );
      this.graphRenderer.resize(container.clientWidth, container.clientHeight);
      // Перерисовка графа
    }
  }

  updateAlgorithmDescription(algorithmName) {
    const descriptions = {
      bubble:
        "Сортировка пузырьком — простой алгоритм сортировки, который многократно проходит через массив, сравнивает соседние элементы и меняет их местами, если они находятся в неправильном порядке.",
      selection:
        "Сортировка выбором — алгоритм, который на каждом шаге находит минимальный элемент из unsorted части массива и помещает его в конец sorted части.",
      insertion:
        "Сортировка вставками — алгоритм, который строит отсортированную последовательность, по одному элементу за раз, вставляя каждый новый элемент в правильную позицию.",
      quick:
        'Быстрая сортировка — эффективный алгоритм "разделяй и властвуй", который выбирает опорный элемент и разделяет массив на две части: элементы меньше опорного и элементы больше опорного.',
      merge:
        'Сортировка слиянием — алгоритм "разделяй и властвуй", который разделяет массив на две половины, сортирует их рекурсивно, а затем объединяет отсортированные половины.',
    };

    const descriptionElement = document.getElementById("algorithm-description");
    if (descriptionElement) {
      descriptionElement.textContent =
        descriptions[algorithmName] || descriptions["bubble"];
    }
  }

  // Методы для раздела деревьев (заглушки)
  selectTreeAlgorithm(algorithmName) {
    console.log("Выбор алгоритма дерева:", algorithmName);
    // Реализация выбора алгоритма для деревьев
  }

  insertTreeNode() {
    console.log("Добавление узла дерева");
    // Реализация добавления узла
  }

  removeTreeNode() {
    console.log("Удаление узла дерева");
    // Реализация удаления узла
  }

  searchTreeNode() {
    console.log("Поиск узла дерева");
    // Реализация поиска узла
  }

  clearTree() {
    console.log("Очистка дерева");
    // Реализация очистки дерева
  }

  // Методы для раздела графов (заглушки)
  selectGraphAlgorithm(algorithmName) {
    console.log("Выбор алгоритма графа:", algorithmName);
    // Реализация выбора алгоритма для графов
  }

  addGraphNode() {
    console.log("Добавление узла графа");
    // Реализация добавления узла
  }

  addGraphEdge() {
    console.log("Добавление ребра графа");
    // Реализация добавления ребра
  }

  runGraphAlgorithm() {
    console.log("Запуск алгоритма на графе");
    // Реализация запуска алгоритма
  }

  clearGraph() {
    console.log("Очистка графа");
    // Реализация очистки графа
  }
}

// Запуск приложения после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM загружен, запуск приложения...");
  new AlgorithmVisualizer();
});
