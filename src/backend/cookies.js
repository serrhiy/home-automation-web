'use strict';

const MAX_AGE = 24 * 60 * 60;
const DEFAULT_COOKIE = `Max-Age=${MAX_AGE}; Path=/; Secure; HttpOnly`;

const parseCookie = (string) => {
  if (!string) return {};
  const result = {};
  const cookies = string.split(';');
  for (const cookie of cookies) {
    const [key, value = ''] = cookie.split('=');
    result[key.trim()] = value.trim();
  }
  return result;
};

module.exports = (rawCookie) => {
  const cookie = parseCookie(rawCookie);
  const newCookies = [];
  const cookies = {
    set: (key, value) =>
      void newCookies.push(`${key}=${value}; ${DEFAULT_COOKIE}`),
    get: (key) => cookie[key],
    delete: (key) => void newCookies.push(`${key}=0; Max-Age=0`),
    has: (key) => key in cookie,
  };
  return { newCookies, cookies };
};
