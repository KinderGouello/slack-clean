const activateRoute = require('../activate.route');
const url = require('url');

jest.mock('url');

describe('/activate', () => {
  it('should redirect to slack autorization', () => {
    const response = { redirect: jest.fn() };

    url.format.mockImplementation(() => 'http://urlslack');

    activateRoute({}, response);

    expect(response.redirect).toHaveBeenCalledWith('http://urlslack');
  });
});
