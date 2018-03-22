const { WebClient } = require('@slack/client');

module.exports = {
  createByUser: token => new WebClient(token),
  createByApp: () => new WebClient(),
};
