require('dotenv').config();
const port = process.env.PORT || 9000;
const token = process.env.SLACK_APP_TOKEN || '';
const clientId = process.env.SLACK_CLIENT_ID || '';
const clientSecret = process.env.SLACK_CLIENT_SECRET || '';
const redirectUri = process.env.REDIRECT_URI || '';
const state = process.env.STATE || '';

const WebClient = require('@slack/client').WebClient;
const moment = require('moment');

const isAuthenticated = require('./middlewares/isAuthenticated.middleware');
const db = require('./db');
const api = require('./api');
const redis = require('redis');
const redisClient = redis.createClient({
  'port': process.env.REDIS_PORT || '',
  'host': process.env.REDIS_HOST || '',
  'password': process.env.REDIS_PASSWORD || '',
});
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const scope = 'files:read,files:write:user,users.profile:read';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/getToken', function (req, res) {
  if (!req.query.code || req.query.state !== state) {
    res.send('Error during logging');
  }

  const api = new WebClient();

  api.oauth.access(clientId, clientSecret, req.query.code, redirectUri, (err, authResponse) => {
    if (err) throw err;

    console.log('user_id', authResponse.user_id);
    console.log('token', authResponse.access_token);
    console.log('save', JSON.stringify({
      'token': authResponse.access_token,
    }));

    redisClient.set(authResponse.user_id, JSON.stringify({
      'token': authResponse.access_token,
    }), (err, reply) => {
      if (err) throw err;

      console.log('reply save', reply);

      res.send('Ok merci, c’est super cool ! Tu peux maintenant lancer ta commande sur Slack et nettoyer tous tes fichiers');
    });
  });
});

app.get('/activate', (req, res) =>
  res.redirect(`https://slack.com/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`)
);

app.post('/delete-files', isAuthenticated, async (req, res) => {
  console.log('List files');
  const client = api.createClient(JSON.parse(user).token);
  const { files } = await client.getFiles();

  if (files.length) {
    return res.send('No file to delete');
  }

  const promises = files.map(async (file) => {
    const { profile } = await client.getProfile();
    const fileResponse = await client.deleteFile(file.id);

    if (filesResponse.ok) {
      return `Fichier "${file.title}", déposé par ${userProfile.profile.real_name}, a été supprimé.`;
    } else {
      return `Le fichier "${file.title}", déposé par ${userProfile.profile.real_name}, n’a pas pu être supprimé.`;
    }
  });

  Promise
    .all(promises)
    .then(responses => res.send(responses.reduce((lines, line) => `${lines}${line}\n`, '')))
    .catch(err => { throw new Error(err); })
});

app.listen(port);
