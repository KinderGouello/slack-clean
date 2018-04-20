require('dotenv').config();
const api = require('../utils/api');

const buildTextMessages = responses =>
  responses.reduce((lines, line) => `${lines}${line}\n`, '');

module.exports = async (req, res) => {
  console.log('List files');
  const client = api.createClient(JSON.parse(req.user).token);

  const { files } = await client.getFiles(req.body.user_id);

  if (!files.length) {
    return res.send('Aucun fichier à supprimer');
  }

  const promises = files.map(async (file) => {
    const fileResponse = await client.deleteFile(file.id);

    if (fileResponse.ok) {
      return `Le fichier "${file.title}" a été supprimé.`;
    }
    return `Le fichier "${file.title}" n’a pas pu être supprimé.`;
  });

  res.charset = 'uf8';

  return Promise
    .all(promises)
    .then(responses => res.send(`${files.length} fichiers trouvés.\n\n${buildTextMessages(responses)}`))
    .catch((err) => { throw new Error(err); });
};
