require('dotenv').config();
const redis = require('redis');
const { promisify } = require('util');

const getClient = () =>
  redis.createClient({
    url: process.env.REDIS_URL,
  });

const get = (key) => {
  const client = getClient();
  const getAsync = promisify(client.get).bind(client);

  return getAsync(key);
};

const set = (key, value) => {
  const client = getClient();
  const setAsync = promisify(client.set).bind(client);

  return setAsync(key, value)
    .then(res => console.log(`Save ${key} with value ${value} and result :`, res));
};

const del = (key) => {
  const client = getClient();
  const delAsync = promisify(client.del).bind(client);

  return delAsync(key)
    .then(res => console.log(`Delete ${key} and result :`, res));
};

module.exports = {
  get,
  set,
  del,
};
