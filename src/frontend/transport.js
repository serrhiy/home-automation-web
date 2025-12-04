export default async (url, method, data) => {
  const body = JSON.stringify({ data, method });
  const options = { method: 'post', credentials: 'include', body };
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(response.statusText);
  const json = await response.json();
  if (!json.ok) throw new Error(json.message);
  return json.data;
};
