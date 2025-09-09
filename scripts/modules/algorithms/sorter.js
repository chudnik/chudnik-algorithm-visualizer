export class Sorter {
  constructor() {
    if (this.constructor === Sorter) {
      throw new Error("Cannot instantiate abstract class");
    }
    this.isSorting = false;
    this.generator = null;
    this.comparisonsCount = 0;
    this.swapsCount = 0;
  }

  *sort(array) {
    throw new Error("Method 'sort()' must be implemented");
  }

  start(array) {
    this.isSorting = true;
    this.generator = this.sort(array);
    return this;
  }

  next() {
    if (!this.generator) return { done: true };

    const result = this.generator.next();

    if (result.done) {
      this.isSorting = false;
    }

    return result;
  }

  stop() {
    this.isSorting = false;
    this.generator = null;
  }
}
