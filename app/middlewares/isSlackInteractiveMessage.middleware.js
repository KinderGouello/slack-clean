require('dotenv').config();

const slackVerificationToken = process.env.SLACK_VERIFICATION_TOKEN || '';

module.exports = (req, res, next) => {
  if (req.body.payload === undefined) {
    return res.end('This is not a Slack call');
  }

  const payload = JSON.parse(req.body.payload);

  if (payload.token !== slackVerificationToken) {
    return res.end('You are not allowed to do this');
  }

  req.payload = payload;

  return next();
};
