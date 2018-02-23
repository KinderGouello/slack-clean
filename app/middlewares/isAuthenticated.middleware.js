const db = require('./db');

module.exports = async (req, res, next) => {
  console.log('user_id from request :', req.body.user_id);

  req.user = await db.get(req.body.user_id);

  if (!req.user) {
    res.end('Tu n’as pas activé le cleaner, click là : https://slackstatslv.herokuapp.com/activate');
  }

  next();
}