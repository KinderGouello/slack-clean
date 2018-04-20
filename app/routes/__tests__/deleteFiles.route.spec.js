const deleteFilesRoute = require('../deleteFiles.route');
const api = require('../../utils/api');

jest.mock('../../utils/api');

describe('/delete-files', () => {
  it('should delete slack files', async () => {
    const response = { send: jest.fn() };

    api.createClient.mockImplementation(() => ({
      getFiles: () => ({
        files: [
          {
            id: 1,
            title: 'File 1',
          },
          {
            id: 2,
            title: 'File 2',
          },
        ],
      }),
      deleteFile: () => ({ ok: true }),
    }));

    await deleteFilesRoute({
      user: '{ "token": "user-token" }',
      body: {
        user_id: 'HDOIH',
      },
    }, response);

    expect(response.send)
      // eslint-disable-next-line quotes
      .toHaveBeenCalledWith("2 fichiers trouvés.\n\nLe fichier \"File 1\" a été supprimé.\nLe fichier \"File 2\" a été supprimé.\n");
  });

  it('should have no files to delete', async () => {
    const response = { send: jest.fn() };

    api.createClient.mockImplementation(() => ({
      getFiles: () => ({ files: [] }),
    }));

    await deleteFilesRoute({
      user: '{ "token": "user-token" }',
      body: {
        user_id: 'HDOIH',
      },
    }, response);

    expect(response.send).toHaveBeenCalledWith('Aucun fichier à supprimer');
  });

  it('should have error when delete file', async () => {
    const response = { send: jest.fn() };

    api.createClient.mockImplementation(() => ({
      getFiles: () => ({
        files: [{
          id: 1,
          title: 'File 1',
        }],
      }),
      deleteFile: () => ({ ok: false }),
    }));

    await deleteFilesRoute({
      user: '{ "token": "user-token" }',
      body: {
        user_id: 'HDOIH',
      },
    }, response);

    expect(response.send)
      // eslint-disable-next-line quotes
      .toHaveBeenCalledWith("1 fichiers trouvés.\n\nLe fichier \"File 1\" n’a pas pu être supprimé.\n");
  });
});
