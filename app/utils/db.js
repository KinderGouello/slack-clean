require('dotenv').config();
const redis = require('redis');

const getClient = () =>
  redis.createClient({
    port: process.env.REDIS_PORT || '',
    host: process.env.REDIS_HOST || '',
    password: process.env.REDIS_PASSWORD || '',
  });

const get = key =>
  new Promise((resolve, reject) => getClient().get(key, (err, reply) => {
    if (err) reject(err);

    console.log(`Get key ${key} from Redis result :`, reply);
    resolve(reply);
  }));

const set = (key, value) =>
  new Promise((resolve, reject) => getClient().set(key, value, (err, reply) => {
    if (err) reject(err);

    console.log(`Save key ${key} to Redis with value ${value} and result :`, reply);
    resolve(reply);
  }));

module.exports = {
  get,
  set,
};
