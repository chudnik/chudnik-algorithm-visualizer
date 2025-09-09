export class StateManager {
  constructor() {
    this.state = {};
    this.listeners = [];
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  getState() {
    return this.state;
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}
