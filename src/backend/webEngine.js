'use strict';

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
    const body = await getBody(stream);
    return JSON.parse(body.toString());
  } catch {
    return null;
  }
};

const responseMessageFromCode = {
  400: 'Invalid body',
  404: 'Invalid api path',
  401: 'Token not found',
};

const isAuthenticated = async (headers, repository) => {
  if ('token' in headers) {
    return await repository.operators.existsToken(headers.token);
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
    const body = await parseBody(request);
    const { endpoint, schema } = router.getController(url, method);

    if (schema.needToken) {
      const authenticated = await isAuthenticated(headers, repository);
      if (!authenticated) {
        processError(response, 401);
        continue;
      }
    }

    const validationResult = validator.validate(body, schema);
    if (validationResult.valid) {
      processError(response, 400);
      continue;
    }

    const args = getArguments(body, schema);
    try {
      const answer = { ok: true, data: endpoint(...args) };
      response.writeHead(200, defaultHeaders);
      response.end(JSON.stringify(answer));
    } catch (error) {
      response.writeHead(400, defaultHeaders);
      response.end(JSON.stringify({ ok: false, message: error.message }));
    }
  }
};
