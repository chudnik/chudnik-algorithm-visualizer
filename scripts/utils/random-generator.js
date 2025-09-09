export function generateRandomArray(size, min = 5, max = 95) {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );
}
