require('dotenv').config();
const slack = require('../slack-api-proxy');
const api = require('../api');

const env = Object.assign({}, process.env);

jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000);
jest.mock('../slack-api-proxy');

afterEach(() => {
  process.env = env;
});

const slackUserClient = {
  files: {
    list: jest.fn(),
    delete: jest.fn(),
  },
};
const slackAppClient = {
  oauth: {
    access: jest.fn(),
  },
};

slack.createByUser.mockImplementation(() => slackUserClient);
slack.createByApp.mockImplementation(() => slackAppClient);

describe('api createClient', () => {
  it('should return getFiles, getProfile, deleteFile', () => {
    const apiClient = api.createClient();

    expect(apiClient).toHaveProperty('getFiles');
    expect(apiClient).toHaveProperty('deleteFile');
  });
});

describe('api getFiles', () => {
  it('should return files', async () => {
    process.env.NODE_ENV = 'production';
    slackUserClient.files.list.mockImplementation(() => ['file1', 'file2']);

    const files = await api.createClient().getFiles('user01');

    expect.assertions(2);
    expect(files).toEqual(['file1', 'file2']);
    expect(slackUserClient.files.list).toHaveBeenCalledWith({
      count: 30,
      user: 'user01',
      ts_to: '1484398308',
      types: 'images',
    });
  });
});

describe('api deleteFile', () => {
  it('should delete file', async () => {
    slackUserClient.files.delete.mockImplementation(() => 'ok');

    const response = await api.createClient().deleteFile('624372684');

    expect.assertions(2);
    expect(response).toEqual('ok');
    expect(slackUserClient.files.delete).toHaveBeenCalledWith('624372684');
  });
});

describe('api getAccessToken', () => {
  it('should return access token', async () => {
    const params = {
      clientId: 'id',
      clientSecret: 'secret',
      code: 'code',
      redirectUri: 'http://redirect',
    };
    slackAppClient.oauth.access.mockImplementation(() => 'token');

    const accessToken = await api.getAccessToken(params);

    expect.assertions(2);
    expect(accessToken).toEqual('token');
    expect(slackAppClient.oauth.access).toHaveBeenCalledWith(
      params.clientId,
      params.clientSecret,
      params.code,
      params.redirectUri,
    );
  });
});
