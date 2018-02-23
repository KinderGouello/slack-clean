const WebClient = require('@slack/client').WebClient;
const moment = require('moment');

const createClient = token => {
  const client = new WebClient(token);
  
  return {
    getFiles: () => {
      return new Promise((resolve, reject) => client.files.list({
        ts_to: moment().subtract(1, 'months').format('X'),
        ts_to: moment().subtract(20, 'seconds').format('X'),
      }, (err, filesResponse) => {
        if (err) reject(err);

        resolve(filesResponse);
      }
      ));
    },
    getProfile: () => {
      new Promise((resolve, reject) => client.users.profile.get(
        { user: file.user }, (err, userProfile) => {

        }));
    }
  }
}

module.exports = {
  createClient,
}