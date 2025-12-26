// Новый модуль: возвращает массив шагов для StateManager
export default function bubbleSortSteps(inputArray) {
  const arr = inputArray.slice();
  const steps = [];
  let n = arr.length;
  for (let i = 0; i < n - 1; ++i) {
    for (let j = 0; j < n - i - 1; ++j) {
      steps.push({ array: arr.slice(), highlight: [j, j + 1], swapped: false });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({ array: arr.slice(), highlight: [j, j + 1], swapped: true });
      }
    }
  }
  steps.push({ array: arr.slice(), highlight: [], swapped: false });
  return steps;
}
