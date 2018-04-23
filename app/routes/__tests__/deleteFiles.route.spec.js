const deleteFilesRoute = require('../deleteFiles.route');
const deleteFiles = require('../../tasks/deleteFiles');
const db = require('../../utils/db');

jest.mock('../../tasks/deleteFiles');
jest.mock('../../utils/db');

describe('/delete-files', () => {
  it('should execute files deletion', async () => {
    const response = { send: jest.fn() };

    await deleteFilesRoute({
      payload: {
        actions: [{
          value: '',
        }],
        callback_id: 'delete',
      },
    }, response);

    expect(db.del).toHaveBeenCalledWith('delete');
    expect(response.send).toHaveBeenCalledWith({ delete_original: true });
  });

  it('should cancel process', async () => {
    const req = {
      payload: {
        actions: [{
          value: '1',
        }],
        callback_id: 'delete',
      },
    };
    const response = { send: jest.fn() };

    await deleteFilesRoute(req, response);

    expect(deleteFiles).toHaveBeenCalledWith(req.payload);
    expect(response.send).toHaveBeenCalledWith({
      attachments: [
        {
          text: 'Traitement en cours...',
          color: '#e9a820',
        },
      ],
    });
  });
});
