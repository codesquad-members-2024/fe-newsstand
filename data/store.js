export class Store {
  constructor() {
    this.observers = [];
    this.state = {
      viewType: "grid",
      subsType: "off",
    };
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  removeObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }
  notifyObservers() {
    this.observers.forEach((renderFunc) => {
      renderFunc(this.state);
    });
  }
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyObservers();
  }
  getState() {
    return this.state;
  }
}

export const store = new Store();
