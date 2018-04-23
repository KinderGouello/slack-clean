const db = require('../db');
const redis = require('redis');
const { promisify } = require('util');

redis.createClient = jest.fn(() => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
}));

jest.mock('util');

describe('db', () => {
  describe('get', () => {
    it('should return value by key', async () => {
      const promise = jest.fn();
      promisify.mockImplementation(() => promise);

      db.get('foo');

      expect(promise).toHaveBeenCalledWith('foo');
    });
  });

  describe('set', () => {
    it('should set value with key', async () => {
      const promise = jest.fn(() => Promise.resolve('OK'));
      promisify.mockImplementation(() => promise);

      db.set('foo', 'bar');

      expect(promise).toHaveBeenCalledWith('foo', 'bar');
    });
  });

  describe('del', () => {
    it('should delete value', async () => {
      const promise = jest.fn(() => Promise.resolve('OK'));
      promisify.mockImplementation(() => promise);

      db.del('foo');

      expect(promise).toHaveBeenCalledWith('foo');
    });
  });
});
