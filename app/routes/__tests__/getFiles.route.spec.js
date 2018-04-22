const getFilesRoute = require('../getFiles.route');
const api = require('../../utils/api');
const db = require('../../utils/db');

jest.mock('../../utils/api');
jest.mock('../../utils/db');

describe('/get-files', () => {
  it('should list slack files', async () => {
    const req = {
      user: '{ "token": "user-token" }',
      body: {
        user_id: 'HDOIH',
      },
    };
    const response = { send: jest.fn() };
    const files = [
      {
        id: 1,
        title: 'File 1',
        thumb_360: 'http://file1.com',
      },
      {
        id: 2,
        title: 'File 2',
        thumb_360: 'http://file2.com',
      },
    ];

    api.createClient.mockImplementation(() => ({
      getFiles: () => ({
        files,
      }),
    }));

    db.set.mockImplementation(() => true);

    await getFilesRoute(req, response);

    expect(db.set).toHaveBeenCalledWith(`delete_images_${req.body.user_id}`, JSON.stringify(files), 'EX', 3600);
    expect(response.send)
      // eslint-disable-next-line quotes
      .toHaveBeenCalledWith({
        text: '2 fichiers trouvés',
        attachments: [
          {
            text: '<http://file1.com|File 1>\n<http://file2.com|File 2>\n',
          },
          {
            title: 'Confirmer la suppression',
            fallback: 'Confirmer la suppression',
            color: '#6ecadc',
            callback_id: `delete_images_${req.body.user_id}`,
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
  });

  it('should have no files to list', async () => {
    const response = { send: jest.fn() };

    api.createClient.mockImplementation(() => ({
      getFiles: () => ({ files: [] }),
    }));

    await getFilesRoute({
      user: '{ "token": "user-token" }',
      body: {
        user_id: 'HDOIH',
      },
    }, response);

    expect(response.send).toHaveBeenCalledWith({ "text": "Aucun fichier à supprimer" });
  });
});
