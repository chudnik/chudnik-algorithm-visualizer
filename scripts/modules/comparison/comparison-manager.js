export class ComparisonManager {
  constructor() {
    this.sortOrder = {};
  }

  init() {
    this.setupEventListeners();
    this.filterComparisonTable();
  }

  setupEventListeners() {
    // Обработчики для фильтров
    document.querySelectorAll(".comparison-filters input").forEach((input) => {
      input.addEventListener("change", () => {
        this.filterComparisonTable();
      });
    });

    // Обработчики для сортировки таблицы
    document.querySelectorAll(".comparison-table th").forEach((th, index) => {
      th.addEventListener("click", () => {
        this.sortTable(index);
      });
    });
  }

  filterComparisonTable() {
    const checkedAlgorithms = Array.from(
      document.querySelectorAll(".comparison-filters input:checked")
    ).map((input) => input.value);

    document.querySelectorAll(".comparison-table tbody tr").forEach((row) => {
      const algorithm = row.dataset.algorithm;
      if (checkedAlgorithms.includes(algorithm)) {
        row.classList.remove("hidden");
      } else {
        row.classList.add("hidden");
      }
    });
  }

  sortTable(columnIndex) {
    const table = document.querySelector(".comparison-table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr:not(.hidden)"));
    const header = table.querySelectorAll("th")[columnIndex];

    // Определяем направление сортировки
    const isAscending = header.getAttribute("data-sort") === "asc";
    header.setAttribute("data-sort", isAscending ? "desc" : "asc");

    // Сбрасываем индикаторы сортировки
    table.querySelectorAll("th").forEach((th) => {
      th.classList.remove("sort-asc", "sort-desc");
    });

    // Добавляем индикатор сортировки
    header.classList.add(isAscending ? "sort-desc" : "sort-asc");

    // Сортируем строки
    rows.sort((a, b) => {
      const aValue = a.cells[columnIndex].textContent;
      const bValue = b.cells[columnIndex].textContent;

      return this.compareValues(aValue, bValue, isAscending);
    });

    // Очищаем таблицу
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // Добавляем отсортированные строки
    rows.forEach((row) => tbody.appendChild(row));
  }

  compareValues(a, b, isAscending) {
    // Специальная логика сравнения для Big O notation
    const complexityOrder = {
      "O(1)": 0,
      "O(log n)": 1,
      "O(n)": 2,
      "O(n log n)": 3,
      "O(n²)": 4,
      Да: 0,
      Нет: 1,
    };

    const aOrder = complexityOrder[a] !== undefined ? complexityOrder[a] : a;
    const bOrder = complexityOrder[b] !== undefined ? complexityOrder[b] : b;

    if (aOrder < bOrder) return isAscending ? -1 : 1;
    if (aOrder > bOrder) return isAscending ? 1 : -1;
    return 0;
  }
}
