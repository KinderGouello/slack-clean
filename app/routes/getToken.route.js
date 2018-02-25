const api = require('../utils/api');
const db = require('../utils/db');

const clientId = process.env.SLACK_CLIENT_ID || '';
const clientSecret = process.env.SLACK_CLIENT_SECRET || '';
const redirectUri = process.env.REDIRECT_URI || '';

module.exports = async (req, res) => {
  const { user_id: userId, access_token: accessToken } = await api.getAccessToken({
    clientId,
    clientSecret,
    code: req.query.code,
    redirectUri,
  });

  const save = await db.set(userId, JSON.stringify({ token: accessToken }));

  if (save) {
    return res.end('Ok merci, c’est super cool ! Tu peux maintenant lancer ta commande sur Slack et nettoyer tous tes fichiers');
  }

  return res.end('Un probleme s est produit pendant la sauvegarde du token, veuillez réessayer');
}