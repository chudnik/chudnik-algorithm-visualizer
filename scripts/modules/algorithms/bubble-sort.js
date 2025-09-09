import { Sorter } from "./sorter.js";

export class BubbleSort extends Sorter {
  static timeComplexity = "O(n²)";
  static spaceComplexity = "O(1)";
  static algorithmName = "Сортировка пузырьком";

  *sort(array) {
    const n = array.length;
    let swapped;
    let sortedIndices = [];

    // Создаем копию массива для работы
    const workingArray = [...array];

    for (let i = 0; i < n - 1; i++) {
      swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        // Возвращаем состояние для визуализации
        yield {
          array: [...workingArray],
          highlights: [j, j + 1],
          comparisons: this.comparisonsCount,
        };

        this.comparisonsCount++;

        if (workingArray[j] > workingArray[j + 1]) {
          // Меняем элементы местами в рабочем массиве
          [workingArray[j], workingArray[j + 1]] = [
            workingArray[j + 1],
            workingArray[j],
          ];
          swapped = true;
          this.swapsCount++;

          // Возвращаем состояние после обмена
          yield {
            array: [...workingArray],
            highlights: [j, j + 1],
            comparisons: this.comparisonsCount,
            swaps: this.swapsCount,
          };
        }
      }

      // Добавляем индекс отсортированного элемента
      sortedIndices.push(n - i - 1);

      // Возвращаем состояние с обновленным списком отсортированных индексов
      yield {
        array: [...workingArray],
        highlights: [],
        sortedIndices: [...sortedIndices],
        comparisons: this.comparisonsCount,
        swaps: this.swapsCount,
      };

      if (!swapped) break;
    }

    // Финальное состояние - весь массив отсортирован
    yield {
      array: [...workingArray],
      highlights: [],
      sortedIndices: Array.from({ length: n }, (_, i) => i),
      comparisons: this.comparisonsCount,
      swaps: this.swapsCount,
      completed: true,
    };
  }

  start(array) {
    this.comparisonsCount = 0;
    this.swapsCount = 0;
    this.isSorting = true;
    this.generator = this.sort(array);
    return this;
  }
}
