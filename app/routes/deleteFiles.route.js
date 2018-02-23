const api = require('../utils/api');

module.exports = async (req, res) => {
  console.log('List files');
  const client = api.createClient(JSON.parse(user).token);
  const { files } = await client.getFiles();

  if (files.length) {
    return res.send('No file to delete');
  }

  const { profile } = await client.getProfile();

  const promises = files.map(async (file) => {
    const fileResponse = await client.deleteFile(file.id);

    if (fileResponse.ok) {
      return `Fichier "${file.title}", déposé par ${profile.real_name}, a été supprimé.`;
    } else {
      return `Le fichier "${file.title}", déposé par ${profile.real_name}, n’a pas pu être supprimé.`;
    }
  });

  Promise
    .all(promises)
    .then(responses => res.send(responses.reduce((lines, line) => `${lines}${line}\n`, '')))
    .catch(err => { throw new Error(err); });
}