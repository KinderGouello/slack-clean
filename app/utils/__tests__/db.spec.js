const redis = require('redis');
const db = require('../db');

describe('get action', () => {
  it('should retrieve user by id', async () => {
    redis.createClient.mockImplementation(() => ({
      get: 15,
    }));

    const user = await db.get(15);
    console.log(user);
  });
});
