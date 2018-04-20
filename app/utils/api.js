const slack = require('./slack-api-proxy');

const createClient = (token) => {
  const client = slack.createByUser(token);

  return {
    getFiles: () => client.files.list({
      count: 5,
    }),
    getProfile: user => client.users.profile.get({ user }),
    deleteFile: id => client.files.delete(id),
  };
};

const getAccessToken = ({
  clientId,
  clientSecret,
  code,
  redirectUri,
}) => {
  const client = slack.createByApp();

  return client.oauth.access(clientId, clientSecret, code, redirectUri);
};

module.exports = {
  createClient,
  getAccessToken,
};
