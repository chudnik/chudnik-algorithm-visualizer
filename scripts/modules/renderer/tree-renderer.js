import { RendererInterface } from "../../interfaces/renderer-interface.js";

export class TreeRenderer extends RendererInterface {
  constructor(container) {
    super(container);
    this.svg = null;
    this.nodeRadius = 20;
    this.horizontalSpacing = 50; // Можно настроить, но основной расчет ниже
    this.verticalSpacing = 80;
  }

  init() {
    this.container.innerHTML = "";

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("id", "tree-svg");
    this.svg.setAttribute("viewBox", "0 0 800 600");
    this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    this.container.appendChild(this.svg);
    this.resize(this.container.clientWidth, this.container.clientHeight);
  }

  // Расчет позиций узлов
  calculateNodePositions(node, x, y, level, positions, xOffset) {
    if (node === null) return;

    // Сохраняем позицию текущего узла
    node.x = x;
    node.y = y;
    positions.push({ node, x, y });

    // Уменьшаем горизонтальное смещение для следующего уровня
    // Это создает "сужающийся" эффект для нижних уровней дерева
    const nextXOffset = xOffset * 0.6; // Можно использовать 0.5 для более широкого дерева

    if (node.left !== null) {
      this.calculateNodePositions(
        node.left,
        x - xOffset, // Смещаемся влево на текущее смещение
        y + this.verticalSpacing, // Спускаемся на уровень вниз
        level + 1,
        positions,
        nextXOffset // Передаем новое, уменьшенное смещение
      );
    }

    if (node.right !== null) {
      this.calculateNodePositions(
        node.right,
        x + xOffset, // Смещаемся вправо на текущее смещение
        y + this.verticalSpacing, // Спускаемся на уровень вниз
        level + 1,
        positions,
        nextXOffset // Передаем новое, уменьшенное смещение
      );
    }
  }

  // ✅ ЕДИНСТВЕННЫЙ И ПРАВИЛЬНЫЙ МЕТОД RENDER
  render(tree, highlightedNode = null, visitedNodes = []) {
    if (!this.svg) this.init();
    this.svg.innerHTML = "";

    if (tree.root === null) {
      this.renderEmptyTree();
      return;
    }

    const positions = [];
    // Начинаем с X=400 (центр), Y=50, и начальное смещение для детей будет 200
    // Это значение (200) определяет, насколько далеко будут первые дети от родителя
    this.calculateNodePositions(tree.root, 400, 50, 0, positions, 200);

    // Сначала рисуем линии (чтобы они были под узлами)
    this.renderConnections(tree.root);

    // Затем рисуем узлы
    positions.forEach(({ node }) => {
      this.renderNode(node, highlightedNode, visitedNodes);
    });
  }

  // ❌ УДАЛЕН ДУБЛИРУЮЩИЙСЯ МЕТОД RENDER

  renderEmptyTree() {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "400");
    text.setAttribute("y", "300");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#8E8D8A");
    text.setAttribute("font-size", "24");
    text.textContent = "Дерево пустое";
    this.svg.appendChild(text);
  }

  renderConnections(node) {
    if (node === null) return;

    if (node.left !== null) {
      this.drawConnection(node, node.left);
      this.renderConnections(node.left);
    }

    if (node.right !== null) {
      this.drawConnection(node, node.right);
      this.renderConnections(node.right);
    }
  }

  drawConnection(parentNode, childNode) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", parentNode.x);
    line.setAttribute("y1", parentNode.y);
    line.setAttribute("x2", childNode.x);
    line.setAttribute("y2", childNode.y);
    line.setAttribute("stroke", "#8E8D8A");
    line.setAttribute("stroke-width", "2");
    this.svg.appendChild(line);
  }

  renderNode(node, highlightedNode, visitedNodes) {
    // Рисуем круг (узел)
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "node");

    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", this.nodeRadius);

    // Определяем класс для стилизации через CSS
    if (node.highlighted || node === highlightedNode) {
      circle.setAttribute("class", "highlighted");
    } else if (node.visited || visitedNodes.includes(node)) {
      circle.setAttribute("class", "visited");
    }

    circle.setAttribute("stroke", "#8E8D8A");
    circle.setAttribute("stroke-width", "2");
    g.appendChild(circle);

    // Добавляем текст (значение узла)
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", node.x);
    text.setAttribute("y", node.y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "central");
    text.setAttribute("fill", "#EAE7DC");
    text.setAttribute("font-size", "14");
    text.setAttribute("font-weight", "bold");
    text.textContent = node.value;
    g.appendChild(text);

    this.svg.appendChild(g);
  }

  clear() {
    if (this.svg) {
      this.svg.innerHTML = "";
    }
  }

  resize(width, height) {
    if (this.svg) {
      this.svg.style.width = `${width}px`;
      this.svg.style.height = `${height}px`;
    }
  }
}
