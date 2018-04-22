require('dotenv').config();
const isSlackInteractiveMessage = require('../isSlackInteractiveMessage.middleware');

const slackVerificationToken = process.env.SLACK_VERIFICATION_TOKEN || '';

describe('POST Query not by Slack', () => {
  it('should return a message', () => {
    const response = { end: jest.fn() };

    isSlackInteractiveMessage({ body: {} }, response);

    expect(response.end).toHaveBeenCalled();
  });
});

describe('POST Query not allowed', () => {
  it('should return a message', () => {
    const response = { end: jest.fn() };

    isSlackInteractiveMessage({
      body: {
        payload: '{ "token": "dsfdklfjkdshklfj" }',
      },
    }, response);

    expect(response.end).toHaveBeenCalled();
  });
});

describe('POST Query ok', () => {
  it('should continue', () => {
    const next = jest.fn();

    isSlackInteractiveMessage({
      body: {
        payload: `{ "token": "${slackVerificationToken}" }`,
      },
    }, {}, next);

    expect(next).toHaveBeenCalled();
  });
});
