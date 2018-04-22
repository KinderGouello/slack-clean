const db = require('../utils/db');
const deleteFiles = require('../tasks/deleteFiles');

module.exports = async (req, res) => {
  if (req.payload.actions[0].value === '') {
    await db.del(req.payload.callback_id);

    return res.send({
      delete_original: true,
    });
  }

  deleteFiles(req.payload);

  return res.send({
    attachments: [
      {
        text: 'Processing...',
        color: '#e9a820',
      },
    ],
  });
};
