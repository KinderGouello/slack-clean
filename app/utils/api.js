const { promisify } = require('util');
const slack = require('./slack-api-proxy');
const moment = require('moment');

const createClient = (token) => {
  const client = slack.createByUser(token);
  const getFiles = promisify(client.files.list);
  const getProfile = promisify(client.users.profile.get);
  const deleteFile = promisify(client.files.delete);

  return {
    getFiles: () => getFiles({
      ts_from: moment().subtract(1, 'months').format('X'),
      ts_to: moment().subtract(20, 'seconds').format('X'),
    }),
    getProfile: user => getProfile({ user }),
    deleteFile: id => deleteFile(id),
  };
};

const getAccessToken = ({
  clientId,
  clientSecret,
  code,
  redirectUri,
}) => {
  const client = slack.createByApp();
  const getToken = promisify(client.oauth.access);

  return getToken(clientId, clientSecret, code, redirectUri);
};

module.exports = {
  createClient,
  getAccessToken,
};
