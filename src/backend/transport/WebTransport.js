'use strict';

const http = require('node:http');
const { once } = require('node:events');
const AsyncQueue = require('./AsyncQueue.js');

class WebTransport {
  #server = null;
  #asyncQueue = null;

  constructor({ port }) {
    this.#server = http.createServer(this.#onRequest.bind(this));
    this.#server.listen(port, '0.0.0.0');
    this.#asyncQueue = new AsyncQueue();
    return once(this.#server, 'listening').then(() => this);
  }

  #onRequest(request, response) {
    this.#asyncQueue.put({ request, response });
  }

  [Symbol.asyncIterator]() {
    return this.#asyncQueue[Symbol.asyncIterator]();
  }

  [Symbol.asyncDispose]() {
    this.#server.closeAllConnections();
    return this.#server[Symbol.asyncDispose]();
  }
}

module.exports = WebTransport;
