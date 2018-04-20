const { promisify } = require('util');
const slack = require('../slack-api-proxy');
const api = require('../api');

jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000);
jest.mock('util');
jest.mock('../slack-api-proxy');

const slackUserClient = {
  files: {
    list: jest.fn(),
    delete: jest.fn(),
  },
  users: {
    profile: {
      get: jest.fn(),
    },
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
    expect(apiClient).toHaveProperty('getProfile');
    expect(apiClient).toHaveProperty('deleteFile');

    expect(promisify).toHaveBeenCalledWith(slackUserClient.files.list);
    expect(promisify).toHaveBeenCalledWith(slackUserClient.users.profile.get);
    expect(promisify).toHaveBeenCalledWith(slackUserClient.files.delete);
  });
});

describe('api getFiles', () => {
  it('should return files', async () => {
    const getFiles = jest.fn().mockImplementation(() => ['file1', 'file2']);
    promisify.mockImplementation(() => getFiles);

    const files = await api.createClient().getFiles();

    expect.assertions(2);
    expect(files).toEqual(['file1', 'file2']);
    expect(getFiles).toHaveBeenCalledWith({ ts_from: '1484398308', ts_to: '1487076688' });
  });
});

describe('api getProfile', () => {
  it('should return user profile', async () => {
    const getProfile = jest.fn().mockImplementation(() => ({ name: ' John' }));
    promisify.mockImplementation(() => getProfile);

    const profile = await api.createClient().getProfile('624372684');

    expect.assertions(2);
    expect(profile).toEqual({ name: ' John' });
    expect(getProfile).toHaveBeenCalledWith({ user: '624372684' });
  });
});

describe('api deleteFile', () => {
  it('should delete file', async () => {
    const deleteFile = jest.fn().mockImplementation(() => 'ok');
    promisify.mockImplementation(() => deleteFile);

    const response = await api.createClient().deleteFile('624372684');

    expect.assertions(2);
    expect(response).toEqual('ok');
    expect(deleteFile).toHaveBeenCalledWith('624372684');
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
    const getToken = jest.fn().mockImplementation(() => 'token');
    promisify.mockImplementation(() => getToken);

    const accessToken = await api.getAccessToken(params);

    expect.assertions(3);
    expect(accessToken).toEqual('token');
    expect(promisify).toHaveBeenCalledWith(slackAppClient.oauth.access);
    expect(getToken).toHaveBeenCalledWith(
      params.clientId,
      params.clientSecret,
      params.code,
      params.redirectUri,
    );
  });
});
