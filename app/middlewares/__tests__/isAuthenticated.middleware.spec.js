const isAuthenticatedMiddleware = require('../isAuthenticated.middleware');
const db = require('../../utils/db');

jest.mock('../../utils/db');

describe('User doesn\'t exist in database', () => {
  it('should return a message', async () => {
    const response = { end: jest.fn() };

    db.get.mockImplementation(() => false);

    await isAuthenticatedMiddleware({ body: { user_id: 'USER_ID' } }, response);

    expect(response.end).toHaveBeenCalled();
  });
});

describe('User exist in database', () => {
  it('should continue', async () => {
    const next = jest.fn();
    const req = { body: { user_id: 'USER_ID' } };

    db.get.mockImplementation(() => 'user');

    await isAuthenticatedMiddleware(req, {}, next);

    expect(req.user).toEqual('user');
    expect(next).toHaveBeenCalled();
  });
});
