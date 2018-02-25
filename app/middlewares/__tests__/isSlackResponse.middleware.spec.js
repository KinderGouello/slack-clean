require('dotenv').config();
const isSlackResponseMiddleware = require('../isSlackResponse.middleware');
const state = process.env.STATE || '';

describe('Query is empty', () => {
  it('should return a message', () => {
    const response = { end: jest.fn() };

    isSlackResponseMiddleware({
      query: {}
    }, response);

    expect(response.end).toHaveBeenCalled();
  });
});

describe('Query has no code but the same state', () => {
  it('should return a message', () => {
    const response = { end: jest.fn() };

    isSlackResponseMiddleware({
      query: {
        state,
      }
    }, response);

    expect(response.end).toHaveBeenCalled();
  });
});

describe('Query has a code but not the same state', () => {
  it('should return a message', () => {
    const response = { end: jest.fn() };

    isSlackResponseMiddleware({
      query: {
        code: 'dhjkg123hjj',
        state: 'not-same-state',
      }
    }, response);

    expect(response.end).toHaveBeenCalled();
  });
});

describe('Query has a code and the same state', () => {
  it('should continue', () => {
    const next = jest.fn();

    isSlackResponseMiddleware({
      query: {
        code: 'dhjkg123hjj',
        state,
      }
    }, {}, next);

    expect(next).toHaveBeenCalled();
  });
});