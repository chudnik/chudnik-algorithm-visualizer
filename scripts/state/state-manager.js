export default class StateManager {
  constructor(algorithmsRegistry = {}) {
    this.algorithmsRegistry = algorithmsRegistry;
    this.currentCategory = null;
    this.currentAlgorithm = null;
    this.inputData = null;
    this.visualizationState = [];
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.speed = 500;
    this._intervalId = null;
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }
  _emit() {
    this.listeners.forEach(cb => cb(this.getState()));
  }

  setCategory(category) {
    this.currentCategory = category;
    this._emit();
  }

  setAlgorithm(algorithm) {
    this.currentAlgorithm = algorithm;
    this._emit();
  }

  setInputData(data) {
    this.inputData = data;
    this._emit();
  }

  setSpeed(speed) {
    this.speed = speed;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
    this._emit();
  }

  generateSteps() {
    const algoFn = this.algorithmsRegistry?.[this.currentCategory]?.[this.currentAlgorithm];
    if (!algoFn) throw new Error('Algorithm not found');
    this.visualizationState = algoFn(this.inputData);
    this.currentStepIndex = 0;
    this._emit();
  }

  stepForward() {
    if (this.currentStepIndex < this.visualizationState.length - 1) {
      this.currentStepIndex++;
      this._emit();
    }
  }

  stepBackward() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this._emit();
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this._emit();
    this._intervalId = setInterval(() => {
      if (this.currentStepIndex >= this.visualizationState.length - 1) {
        this.pause();
        return;
      }
      this.stepForward();
    }, this.speed);
  }

  pause() {
    this.isPlaying = false;
    if (this._intervalId) clearInterval(this._intervalId);
    this._intervalId = null;
    this._emit();
  }

  reset() {
    this.pause();
    this.currentStepIndex = 0;
    this._emit();
  }

  getCurrentStep() {
    return this.visualizationState[this.currentStepIndex];
  }

  getState() {
    return {
      currentCategory: this.currentCategory,
      currentAlgorithm: this.currentAlgorithm,
      inputData: this.inputData,
      visualizationState: this.visualizationState,
      currentStepIndex: this.currentStepIndex,
      isPlaying: this.isPlaying,
      speed: this.speed,
    };
  }
}

