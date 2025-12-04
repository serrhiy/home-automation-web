'use strict';

const getCookies = require('./cookies.js');

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const getBody = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : null;
};

const parseBody = async (stream) => {
  try {
    const data = await getBody(stream);
    const body = data === null ? null : JSON.parse(data.toString());
    return { invalid: false, body };
  } catch {
    return { invalid: true, body: null };
  }
};

const responseMessageFromCode = {
  400: 'Invalid body',
  404: 'Invalid api path',
  401: 'Token not found',
};

const isAuthenticated = async (cookies, repository) => {
  if (cookies.has('token')) {
    return await repository.operators.existsToken(cookies.get('token'));
  }
  return false;
};

const processError = (response, statusCode) => {
  const message = responseMessageFromCode[statusCode] ?? 'Error occured';
  response.writeHead(statusCode, message, defaultHeaders);
  response.end(JSON.stringify({ ok: false, message }));
};

const getArguments = (body, schema) => {
  if ('field' in schema) {
    return schema.order.map((field) => body[field]);
  }
  return [];
};

module.exports = async (router, validator, transport, repository) => {
  for await (const { request, response } of transport) {
    const { url, headers } = request;
    const method = request.method.toLowerCase();
    if (!router.exists(url, method)) {
      processError(response, 404);
      continue;
    }
    const { invalid, body } = await parseBody(request);
    if (invalid) {
      processError(response, 400);
      continue;
    }
    const { endpoint, schema } = router.getController(url, method);
    const { newCookies, cookies } = getCookies(headers.cookie);

    if (schema.needToken) {
      const authenticated = await isAuthenticated(cookies, repository);
      if (!authenticated) {
        processError(response, 401);
        continue;
      }
    }

    const validationResult = validator.validate(body, schema);
    if (validationResult.valid) {
      processError(response, 401);
      continue;
    }

    const args = getArguments(body, schema);
    try {
      const answer = { ok: true, data: endpoint(...args, cookies) };
      response.writeHead(200, { ...defaultHeaders, 'Set-Cookie': newCookies });
      response.end(JSON.stringify(answer));
    } catch (error) {
      response.writeHead(400, defaultHeaders);
      response.end(JSON.stringify({ ok: false, message: error.message }));
    }
  }
};
