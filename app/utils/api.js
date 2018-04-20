const slack = require('./slack-api-proxy');
const moment = require('moment');

const createClient = (token) => {
  const client = slack.createByUser(token);

  return {
    getFiles: () => client.files.list({
      ts_from: moment().subtract(1, 'months').format('X'),
      ts_to: moment().subtract(20, 'seconds').format('X'),
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
