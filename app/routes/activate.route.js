require('dotenv').config();
const url = require('url');

const clientId = process.env.SLACK_CLIENT_ID || '';
const redirectUri = process.env.REDIRECT_URI || '';
const state = process.env.STATE || '';
const slackAuthUrl = 'https://slack.com/oauth/authorize';
const scope = 'files:read,files:write:user,users.profile:read';

module.exports = (req, res) =>
  res.redirect(url.format({
    pathname: slackAuthUrl,
    query: {
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      state,
    },
  }));
