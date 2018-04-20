require('dotenv').config();
const api = require('../utils/api');

module.exports = async (req, res) => {
  console.log('List files');
  const client = api.createClient(JSON.parse(req.user).token);

  const { files } = await client.getFiles(req.body.user_id);

  if (!files.length) {
    return res.send('No file to delete');
  }

  const { profile } = await client.getProfile(req.body.user_id);

  const promises = files.map(async (file) => {
    const fileResponse = await client.deleteFile(file.id);

    if (fileResponse.ok) {
      return `Fichier "${file.title}", déposé par ${profile.real_name}, a été supprimé.`;
    }
    return `Le fichier "${file.title}", déposé par ${profile.real_name}, n’a pas pu être supprimé.`;
  });

  return Promise
    .all(promises)
    .then(responses => res.send(responses.reduce((lines, line) => `${lines}${line}\n`, '')))
    .catch((err) => { throw new Error(err); });
};
