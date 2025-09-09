import { RendererInterface } from "../../interfaces/renderer-interface.js";

export class SVGRenderer extends RendererInterface {
  constructor(container) {
    super(container);
    this.svg = null;
  }

  init() {
    // Полностью очищаем контейнер
    this.container.innerHTML = "";

    // Создаем SVG элемент
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("id", "visualization-svg");
    this.svg.setAttribute("viewBox", `0 0 100 100`);
    this.svg.setAttribute("preserveAspectRatio", "none");

    this.container.appendChild(this.svg);

    // Обработка изменения размера
    this.resize(this.container.clientWidth, this.container.clientHeight);

    console.log("SVG Renderer инициализирован");
  }

  render(data, highlights = [], sortedIndices = []) {
    if (!this.svg) this.init();

    // Полностью очищаем SVG перед отрисовкой нового массива
    this.svg.innerHTML = "";

    if (!data || data.length === 0) {
      console.error("Нет данных для отрисовки");
      return;
    }

    const barWidth = 100 / data.length;
    const maxValue = Math.max(...data);

    // Создаем элементы заново
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * 100;

      const bar = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      bar.setAttribute("class", "bar");
      bar.setAttribute("x", index * barWidth);
      bar.setAttribute("y", 100 - barHeight);
      bar.setAttribute("width", barWidth - 0.2);
      bar.setAttribute("height", barHeight);

      // Устанавливаем классы в зависимости от состояния
      if (highlights.includes(index)) {
        bar.classList.add("comparing");
      }
      if (sortedIndices.includes(index)) {
        bar.classList.add("sorted");
      }

      this.svg.appendChild(bar);

      // Добавляем текст со значением (только для массивов разумного размера)
      if (data.length <= 30) {
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("class", "bar-value");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("x", index * barWidth + barWidth / 2);
        text.setAttribute("y", 100 - barHeight / 2);
        text.textContent = value;
        this.svg.appendChild(text);
      }
    });
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
