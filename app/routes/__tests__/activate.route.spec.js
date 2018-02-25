require('dotenv').config();
const activateRoute = require('../activate.route');
const url = require('url');
jest.mock('url');

const clientId = process.env.SLACK_CLIENT_ID || '';
const redirectUri = process.env.REDIRECT_URI || '';
const state = process.env.STATE || '';

describe('/activate', () => {
  it('should redirect to slack autorization', () => {
    const response = { redirect: jest.fn() }
    url.format.mockImplementation(() => 'http://urlslack');

    activateRoute({}, response);

    expect(response.redirect).toHaveBeenCalledWith('http://urlslack');
  });
});