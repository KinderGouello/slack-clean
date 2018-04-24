require('dotenv').config();
const slack = require('./slack-api-proxy');
const moment = require('moment');

const createClient = (token) => {
  const client = slack.createByUser(token);

  return {
    getFiles: user => client.files.list(Object.assign(
      {
        count: 30,
        user,
        types: 'images',
      },
      (process.env.NODE_ENV === 'production') ? { ts_to: moment().subtract(1, 'months').format('X') } : {},
    )),
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
