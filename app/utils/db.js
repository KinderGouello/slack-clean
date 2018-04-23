require('dotenv').config();
const redis = require('redis');
const { promisify } = require('util');

const getClient = () =>
  redis.createClient({
    url: process.env.REDIS_URL,
  });

const get = (key) => {
  const client = getClient();
  client.getAsync = promisify(client.get);

  return client.getAsync(key);
};

const set = (key, value) => {
  const client = getClient();
  client.setAsync = promisify(client.set);

  return client.setAsync(key, value)
    .then(res => console.log(`Save ${key} with value ${value} and result :`, res));
};

const del = (key) => {
  const client = getClient();
  client.delAsync = promisify(client.del);

  return client.delAsync(key)
    .then(res => console.log(`Delete ${key} and result :`, res));
};

module.exports = {
  get,
  set,
  del,
};
