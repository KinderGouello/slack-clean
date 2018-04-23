const api = require('../utils/api');
const db = require('../utils/db');
const axios = require('axios');

const buildTextMessages = responses =>
  responses.reduce((lines, line) => `${lines}${line}\n`, '');

module.exports = async (payload) => {
  const files = JSON.parse(await db.get(payload.callback_id));
  const user = JSON.parse(await db.get(payload.user.id));
  const client = api.createClient(user.token);

  db.del(payload.callback_id);

  const promises = files.map(async (file) => {
    const fileResponse = await client.deleteFile(file.id);

    if (fileResponse.ok) {
      return `Le fichier "${file.title}" a été supprimé.`;
    }
    return `Le fichier "${file.title}" n’a pas pu être supprimé.`;
  });

  return Promise
    .all(promises)
    .then(responses => axios.post(payload.response_url, {
      attachments: [
        {
          text: buildTextMessages(responses),
          color: '#3eb991',
        },
      ],
    }))
    .catch((err) => { throw new Error(err); });
};
