class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe(f) {
    this.observers.push(f);
  }

  unsubscribe(f) {
    // this.observers = this.observers.filter(subscriber => subscriber !== f);
    const index = this.observers.indexOf(f);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data) {
    this.observers.forEach(observer => observer(data));
  }
}

export default new Observable();
