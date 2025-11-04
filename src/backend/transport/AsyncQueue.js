'use strict';

class AsyncQueue {
  #resolves = [];
  #items = [];

  put(item) {
    if (this.#resolves.length !== 0) {
      const resolve = this.#resolves.shift();
      return void resolve(item);
    }
    this.#items.push(item);
  }

  get() {
    return new Promise((resolve) => {
      if (this.#items.length === 0) this.#resolves.push(resolve);
      else resolve(this.#items.shift());
    });
  }

  [Symbol.asyncIterator]() {
    const next = () => this.get().then((value) => ({ value, done: false }));
    return { next };
  }
}

module.exports = AsyncQueue;
