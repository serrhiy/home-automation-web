'use strict';

class TTLMap extends Map {
  #ttl = undefined;

  constructor(ttl) {
    super();
    this.#ttl = ttl * 1000;
  }

  set(key, value) {
    super.set(key, value);
    setTimeout(this.delete.bind(this, key), this.#ttl);
  }
}

module.exports = TTLMap;
