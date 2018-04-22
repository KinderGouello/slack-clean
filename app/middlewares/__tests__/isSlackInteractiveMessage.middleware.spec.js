require('dotenv').config();
const isSlackInteractiveMessage = require('../isSlackInteractiveMessage.middleware');

const slackVerificationToken = process.env.SLACK_VERIFICATION_TOKEN || '';

describe('POST Query not by Slack', () => {
  it('should return a message', async () => {
    const response = { end: jest.fn() };

    isSlackInteractiveMessage({ body: {} }, response);

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
