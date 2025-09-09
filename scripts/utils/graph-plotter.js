export class GraphPlotter {
  static drawGraph(canvas, complexityType, complexity) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Очищаем canvas
    ctx.clearRect(0, 0, width, height);

    // Рисуем оси
    ctx.beginPath();
    ctx.strokeStyle = "#8E8D8A";
    ctx.lineWidth = 1;
    ctx.moveTo(10, height - 10);
    ctx.lineTo(width - 10, height - 10);
    ctx.moveTo(10, height - 10);
    ctx.lineTo(10, 10);
    ctx.stroke();

    // Подписи осей
    ctx.font = "8px Arial";
    ctx.fillStyle = "#8E8D8A";
    ctx.fillText("n", width - 5, height - 15);
    ctx.fillText("t", 5, 10);

    // Рисуем график в зависимости от типа сложности
    ctx.beginPath();
    ctx.strokeStyle = "#E85A4F";
    ctx.lineWidth = 2;

    const points = [];
    const maxX = width - 20;
    const maxY = height - 20;

    for (let x = 0; x <= maxX; x += 2) {
      const n = (x / maxX) * 10;
      let y;

      switch (complexity) {
        case "1": // O(1)
          y = 1;
          break;
        case "n": // O(n)
          y = n;
          break;
        case "n^2": // O(n²)
          y = n * n;
          break;
        case "h": // O(h) - высота дерева
          y = Math.log2(n + 1) * 2;
          break;
        case "log n": // O(log n)
          y = Math.log2(n + 1);
          break;
        case "n log n": // O(n log n)
          y = n * Math.log2(n + 1);
          break;
        case "v+e": // O(V + E)
          y = n + n * 0.5; // Примерная аппроксимация
          break;
        case "v": // O(V)
          y = n;
          break;
        default:
          y = n;
      }

      // Нормализуем y для отображения
      const maxFunctionValue = 10;
      const yPos = height - 10 - (y / maxFunctionValue) * maxY;
      points.push({ x: x + 10, y: yPos });

      if (x === 0) {
        ctx.moveTo(x + 10, yPos);
      } else {
        ctx.lineTo(x + 10, yPos);
      }
    }

    ctx.stroke();

    // Добавляем точки на график
    points.forEach((point, index) => {
      if (index % 10 === 0) {
        // Рисуем каждую 10-ю точку
        ctx.beginPath();
        ctx.fillStyle = "#E85A4F";
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Добавляем подпись
    ctx.font = "10px Arial";
    ctx.fillStyle = "#E85A4F";
    ctx.fillText(complexityType, width / 2 - 15, 15);
  }

  static initAllGraphs() {
    document.querySelectorAll(".complexity-graph").forEach((canvas) => {
      const type = canvas.dataset.type;
      const complexity = canvas.dataset.complexity;
      this.drawGraph(canvas, type, complexity);
    });
  }
}
