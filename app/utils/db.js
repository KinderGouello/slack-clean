require('dotenv').config();
const redis = require('redis');

const getClient = () =>
  redis.createClient({
    url: process.env.REDIS_URL,
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
