'use strict';

class AsyncQueue<T> {
  private resolves: Array<(value: T) => void> = [];
  private items: T[] = [];

  put(item: T): void {
    if (this.resolves.length > 0) {
      const resolve = this.resolves.shift()!;
      return void resolve(item);
    }
    this.items.push(item);
  }

  get(): Promise<T> {
    return new Promise<T>((resolve) => {
      if (this.items.length === 0) this.resolves.push(resolve);
      else resolve(this.items.shift()!);
    });
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    const next = () => this.get().then((value) => ({ value, done: false }));
    return { next };
  }
}

module.exports = AsyncQueue;
