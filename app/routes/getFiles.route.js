require('dotenv').config();
const api = require('../utils/api');
const db = require('../utils/db');

module.exports = async (req, res) => {
  console.log('List files');
  const client = api.createClient(JSON.parse(req.user).token);
  const { files } = await client.getFiles(req.body.user_id);

  if (files.length <= 0) {
    return res.send({
      text: 'Aucun fichier à supprimer',
    });
  }

  const callbackId = `delete_images_${req.body.user_id}`;

  await db.set(callbackId, JSON.stringify(files), 'EX', 3600);

  return res.send({
    text: `${files.length} fichiers trouvés`,
    attachments: [
      {
        text: files.reduce((acc, file) => `${acc}<${file.thumb_360}|${file.title}>\n`, ''),
      },
      {
        title: 'Confirmer la suppression',
        fallback: 'Confirmer la suppression',
        color: '#6ecadc',
        callback_id: callbackId,
        actions: [
          {
            name: 'image1',
            text: 'Oui',
            type: 'button',
            value: true,
          },
          {
            name: 'image2',
            text: 'Annuler',
            type: 'button',
            value: false,
            style: 'danger',
          },
        ],
      },
    ],
  });
};
