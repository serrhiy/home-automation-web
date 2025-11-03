'use strict';

const http = require('node:http');
const { once } = require('node:events');

class WebHTTP2Transport {
  #server = null;
  constructor({ port }) {
    const callback = (request, response) => response.end('Success');
    this.#server = http.createServer(callback);
    this.#server.listen(port, '0.0.0.0');
    return once(this.#server, 'listening');
  }
}

module.exports = WebHTTP2Transport;
