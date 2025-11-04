const methodsMap = {
  create: 'post',
  get: 'get',
  put: 'update',
  delete: 'delete',
};

export default async (url, method, data) => {
  const body = JSON.stringify(data);
  const httpmethod = methodsMap[method] ?? 'get';
  const options = { method: httpmethod, credentials: 'include', body };
  const response = await fetch(url, options);
  const json = await response.json();
  if (!json.ok) throw new Error(json.message);
  return json.data;
};
