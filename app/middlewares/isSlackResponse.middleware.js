require('dotenv').config();
const state = process.env.STATE || '';

module.exports = (req, res, next) => {
  if (!req.query.code || req.query.state !== state) {
    return res.end('This is not a Slack response');
  }

  next();
}