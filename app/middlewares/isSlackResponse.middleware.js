const db = require('../utils/db');

const state = process.env.STATE || '';

module.exports = async (req, res, next) => {
  if (!req.query.code || req.query.state !== state) {
    return res.end('This is not a Slack response');
  }

  next();
}