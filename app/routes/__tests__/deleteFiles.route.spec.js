const deleteFilesRoute = require('../deleteFiles.route');
const api = require('../../utils/api');

jest.mock('../../utils/api');

describe('/delete-files', () => {
  it('should delete slack files', async () => {
    const response = { send: jest.fn() };

    api.createClient.mockImplementation(() => ({
      getRecentFiles: () => ({
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
      getProfile: () => ({ profile: { real_name: 'Bobby' } }),
      deleteFile: () => ({ ok: true }),
    }));

    await deleteFilesRoute({ user: '{ "token": "user-token" }' }, response);

    expect(response.send)
      // eslint-disable-next-line quotes
      .toHaveBeenCalledWith("Fichier \"File 1\", déposé par Bobby, a été supprimé.\nFichier \"File 2\", déposé par Bobby, a été supprimé.\n");
  });

  it('should have no files to delete', async () => {
    const response = { send: jest.fn() };

    api.createClient.mockImplementation(() => ({
      getRecentFiles: () => ({ files: [] }),
    }));

    await deleteFilesRoute({ user: '{ "token": "user-token" }' }, response);

    expect(response.send).toHaveBeenCalledWith('No file to delete');
  });

  it('should have error when delete file', async () => {
    const response = { send: jest.fn() };

    api.createClient.mockImplementation(() => ({
      getRecentFiles: () => ({
        files: [{
          id: 1,
          title: 'File 1',
        }],
      }),
      getProfile: () => ({ profile: { real_name: 'Bobby' } }),
      deleteFile: () => ({ ok: false }),
    }));

    await deleteFilesRoute({ user: '{ "token": "user-token" }' }, response);

    expect(response.send)
      // eslint-disable-next-line quotes
      .toHaveBeenCalledWith("Le fichier \"File 1\", déposé par Bobby, n’a pas pu être supprimé.\n");
  });
});
