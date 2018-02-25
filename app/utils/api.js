const { WebClient } = require('@slack/client');
const moment = require('moment');

const createClient = (token) => {
  const client = new WebClient(token);

  return {
    getFiles: () => new Promise((resolve, reject) => client.files.list({
      ts_from: moment().subtract(1, 'months').format('X'),
      ts_to: moment().subtract(20, 'seconds').format('X'),
    }, (err, filesResponse) => {
      if (err) reject(err);
      resolve(filesResponse);
    })),

    getRecentFiles: () => new Promise((resolve, reject) => client.files.list({
      ts_from: moment().subtract(1, 'months').format('X'),
      ts_to: moment().subtract(5, 'seconds').format('X'),
    }, (err, filesResponse) => {
      if (err) reject(err);
      resolve(filesResponse);
    })),

    getProfile: user => new Promise((resolve, reject) => {
      client.users.profile.get({
        user,
      }, (err, userProfile) => {
        if (err) reject(err);
        resolve(userProfile);
      });
    }),

    deleteFile: id => new Promise((resolve, reject) => client.files.delete(
      id,
      (err, fileResponse) => (err ? reject(err) : resolve(fileResponse)),
    )),
  };
};

const getAccessToken = ({
  clientId,
  clientSecret,
  code,
  redirectUri,
}) => {
  const api = new WebClient();

  return new Promise((resolve, reject) => api.oauth.access(
    clientId,
    clientSecret,
    code,
    redirectUri,
    (err, authResponse) => {
      if (err) reject(err);

      console.log('user_id from slack :', authResponse.user_id);
      console.log('token from slack :', authResponse.access_token);

      resolve(authResponse);
    },
  ));
};

module.exports = {
  createClient,
  getAccessToken,
};
